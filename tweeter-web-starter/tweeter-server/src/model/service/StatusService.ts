import { Status, FakeData, AuthToken, StatusDto } from "tweeter-shared";
import { AuthTokenDAO } from "../../dao/AuthTokenDAO";
import { DAOFactory } from "../../factory/DAOFactory";
import { StatusDAO } from "../../dao/StatusDAO";
import { FollowDAO } from "../../dao/FollowDAO";

export class StatusService {
    private readonly statusDAO: StatusDAO;
    private readonly followDAO: FollowDAO;
    private readonly authTokenDAO: AuthTokenDAO;

    constructor() {
        this.statusDAO = DAOFactory.getDynamoStatusDAO();
        this.followDAO = DAOFactory.getDynamoFollowDAO()
        this.authTokenDAO = DAOFactory.getDynamoAuthTokenDAO();
    }
  public async loadMoreFeedItems (
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    !await this.authTokenDAO.validate(token)
    return await this.statusDAO.getFeedStatus(userAlias, pageSize, lastItem)
  };

  public async loadMoreStoryItems (
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    !await this.authTokenDAO.validate(token)
    return await this.statusDAO.getStoryStatus(userAlias, pageSize, lastItem)
  };

  public async postStatus (
    token: string,
    newStatus: StatusDto
  ): Promise<void> {
    const followers = await this.followDAO.LoadAllFollowers(newStatus.user.alias)
    if (newStatus == null) {
        throw new Error(`[Bad Request] Request must have a post value`)
    } else if (token == null) {
        throw new Error(`[Bad Request] Must have an authtoken`)
    }
    if (!await this.authTokenDAO.validate(token)) {
        await this.authTokenDAO.delete(token)
    }
    await this.statusDAO.updateStory(newStatus.user.alias, newStatus.post, newStatus.user, newStatus.timestamp, newStatus.segments)
    await this.statusDAO.updateFeed(followers, newStatus.post, newStatus.user, newStatus.timestamp, newStatus.segments)
  };

private async getFakeData(lastItem: StatusDto | null, pageSize: number): Promise<[StatusDto[], boolean]> {
    const [items, hasMore] = FakeData.instance.getPageOfStatuses(Status.fromDto(lastItem), pageSize);
    const dtos = items.map((status) => status.dto);
    return [dtos, hasMore];
}
}