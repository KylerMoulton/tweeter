import { User } from "tweeter-shared";
import { MessageView } from "./Presenter";
import { PagedItemPresenter } from "./PagedItemPresenter";
import { FollowService } from "../model/service/FollowService";

export interface UserItemView extends MessageView{
  addItems: (newItems: User[]) => void;
}
export abstract class UserItemPresenter extends PagedItemPresenter<User, FollowService>{
  protected createService(): FollowService {
    return new FollowService();
  }
}