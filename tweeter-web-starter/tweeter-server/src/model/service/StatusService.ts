import { Status, FakeData, AuthToken, StatusDto } from "tweeter-shared";
import { AuthTokenDAO } from "../../dao/AuthTokenDAO";
import { DAOFactory } from "../../factory/DAOFactory";
import { StatusDAO } from "../../dao/StatusDAO";

export class StatusService {
    private readonly statusDAO: StatusDAO;
    private readonly authTokenDAO: AuthTokenDAO;

    constructor() {
        this.statusDAO = DAOFactory.getDynamoStatusDAO();
        this.authTokenDAO = DAOFactory.getDynamoAuthTokenDAO();
    }
  public async loadMoreFeedItems (
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    // TODO: Replace with the result of calling server
    return this.getFakeData(lastItem, pageSize);
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
    const followers = null
    // authenticate the authtoken
    if (!await this.authTokenDAO.validate(token)) {
        await this.authTokenDAO.delete(token)
    }
    this.statusDAO.updateStory(newStatus.user.alias, newStatus.post, newStatus.user, newStatus.timestamp, newStatus.segments)
    // this.statusDAO.updateFeed(followers, newStatus.post, newStatus.user, newStatus.timestamp, newStatus.segments)
  };

private async getFakeData(lastItem: StatusDto | null, pageSize: number): Promise<[StatusDto[], boolean]> {
    const [items, hasMore] = FakeData.instance.getPageOfStatuses(Status.fromDto(lastItem), pageSize);
    const dtos = items.map((status) => status.dto);
    return [dtos, hasMore];
}
}