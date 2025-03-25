import { AuthToken, User, FakeData, PagedUserItemRequest } from "tweeter-shared";
import { ServerFacade } from "../../network/ServerFacade";

export class FollowService {
  private serverFacade: ServerFacade;

  constructor() {
    this.serverFacade = new ServerFacade();
  }

   public async loadMoreFollowers(
      authToken: AuthToken,
      userAlias: string,
      pageSize: number,
      lastItem: User | null
    ): Promise<[User[], boolean]> {
      // TODO: Replace with the result of calling server
      return FakeData.instance.getPageOfUsers(lastItem, pageSize, userAlias);
    };
  
    public async loadMoreFollowees(
      authToken: AuthToken,
      userAlias: string,
      pageSize: number,
      lastItem: User | null
    ): Promise<[User[], boolean]> {
      const request: PagedUserItemRequest = {
        token: authToken.token,
        userAlias: userAlias,
        pageSize: pageSize,
        lastItem: lastItem ? lastItem.dto : null,
      };
      return this.serverFacade.getMoreFollowees(request);
    }
}