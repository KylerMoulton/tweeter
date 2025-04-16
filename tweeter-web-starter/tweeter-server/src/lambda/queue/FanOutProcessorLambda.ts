import { DAOFactory } from "../../factory/DAOFactory";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";

const followDAO = DAOFactory.getDynamoFollowDAO();
const sqsClient = new SQSClient({ region: "us-east-1" });

function chunkArray<T>(arr: T[], size: number): T[][] {
  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

export const handler = async function (event: any) {
  for (const record of event.Records) {
    const { authorAlias, newStatus } = JSON.parse(record.body);

    const followers = await followDAO.LoadAllFollowers(authorAlias);
    const batches = chunkArray(followers, 150);

    for (const batch of batches) {
      const message = {
        followerAliases: batch,
        timestamp: newStatus.timestamp,
        post: newStatus.post,
        user: newStatus.user,
        segments: newStatus.segments,
      };

      await sqsClient.send(
        new SendMessageCommand({
          QueueUrl: 'https://sqs.us-east-1.amazonaws.com/471112879218/FeedUpdateQueue',
          MessageBody: JSON.stringify(message),
        })
      );
    }
  }
};
