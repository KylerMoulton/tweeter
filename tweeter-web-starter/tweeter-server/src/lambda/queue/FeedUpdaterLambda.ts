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
    await statusDAO.updateFeed(
      followerAliases,
      post,
      user as UserDto,
      timestamp,
      segments as PostSegment[]
    );
  }

  return null;
};
