import { StatusService } from "../model/service/StatusService";
import { StatusItemPresenter, StatusItemView } from "./StatusItemPresenter";

export const PAGE_SIZE = 10;

export class StoryPresenter extends StatusItemPresenter {
  private statusService: StatusService;

  public constructor(view: StatusItemView) {
    super(view);
    this.statusService = new StatusService();
  }

  public async loadMoreItems() {
      try {
        const [newItems, hasMore] = await this.statusService.loadMoreStoryItems(
          PAGE_SIZE,
          this.lastItem
        );
  
        this.hasMoreItems = hasMore;
        this.lastItem = newItems[newItems.length - 1];
        this.view.addItems(newItems);
      } catch (error) {
        this.view.displayErrorMessage(
          `Failed to load story items because of exception: ${error}`
        );
      }
    };
}