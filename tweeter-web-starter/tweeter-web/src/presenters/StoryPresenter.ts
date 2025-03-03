import { AuthToken, Status } from "tweeter-shared";
import { StatusItemPresenter } from "./StatusItemPresenter";
import { PAGE_SIZE } from "./PagedItemPresenter";

export class StoryPresenter extends StatusItemPresenter {
  protected getMoreItems(_authToken: AuthToken, _userAlias: string): Promise<[Status[], boolean]> {
    return this.service.loadMoreStoryItems(
      PAGE_SIZE,
      this.lastItem
    );
  }
  protected getItemDescription(): string {
    return "story items";
  }
}