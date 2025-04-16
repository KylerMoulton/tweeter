import { DAOFactory } from "../../factory/DAOFactory";
import { UserDto, PostSegment } from "tweeter-shared";

const statusDAO = DAOFactory.getDynamoStatusDAO();

export const handler = async function (event: any) {
  for (const record of event.Records) {
    const {
      followerAliases,
      post,
      timestamp,
      user,
      segments,
    } = JSON.parse(record.body);
    let startTime = Date.now()
    await statusDAO.updateFeed(
      followerAliases,
      post,
      user as UserDto,
      timestamp,
      segments as PostSegment[]
    );
    let nTime = Date.now()
    let elapsedTime = nTime - startTime
    await new Promise((resolve => setTimeout(resolve, Math.max(1000-elapsedTime,0))))
  }

  return null;
};
