import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";

const sqsClient = new SQSClient({ region: "us-east-1" });

export async function sendToQueue(queueUrl: string, messageBody: object) {
  const command = new SendMessageCommand({
    QueueUrl: queueUrl,
    MessageBody: JSON.stringify(messageBody)
  });
  const result = await sqsClient.send(command);
  console.log("Sent to queue:", result.MessageId);
}
