import { Status, FakeData, AuthToken, PagedStatusItemRequest } from "tweeter-shared";
import { ServerFacade } from "../../network/ServerFacade";

export class StatusService {
  private serverFacade: ServerFacade;

  constructor() {
    this.serverFacade = new ServerFacade();
  }
  
  public async loadMoreFeedItems (
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> {
    const request: PagedStatusItemRequest ={
        token: "",
        userAlias: "",
        pageSize: pageSize,
        lastItem: lastItem ? lastItem.dto : null
    }
    return this.serverFacade.getMoreFeedItems(request);
  };

  public async loadMoreStoryItems (
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> {
    const request: PagedStatusItemRequest ={
        token: "",
        userAlias: "",
        pageSize: pageSize,
        lastItem: lastItem ? lastItem.dto : null
    }
    return this.serverFacade.getMoreStoryItems(request);
  };

  public async postStatus (
    authToken: AuthToken,
    newStatus: Status
  ): Promise<void> {
    // Pause so we can see the logging out message. Remove when connected to the server
    await new Promise((f) => setTimeout(f, 2000));

    // TODO: Call the server to post the status
  };
}