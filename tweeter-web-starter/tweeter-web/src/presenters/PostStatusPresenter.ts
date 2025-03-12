import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";
import { AuthStateView, Presenter } from "./Presenter";

export interface PostStatusView extends AuthStateView{
  setPost: (post: string) => void;
}

export class PostStatusPresenter extends Presenter<PostStatusView>{
  private _statusService: StatusService;

  public constructor(view: PostStatusView) {
    super(view)
    this._statusService = new StatusService();
  }

  public get statusService() {
    return this._statusService;
  }

  public submitPost = async (event: React.MouseEvent, post: string, currentUser: User, authToken: AuthToken) => {
    event.preventDefault();
    await this.doFailureReportingOperation(async () => {
      this.view.setIsLoading(true);
      this.view.displayInfoMessage("Posting status...", 0);
      if (!currentUser || !authToken) {
        throw new Error("User not authenticated.");
      }
      const status = new Status(post, currentUser, Date.now());
      await this.statusService.postStatus(authToken, status);
      this.view.setPost("");
      this.view.displayInfoMessage("Status posted!", 2000);
    }, "post the status" );
    this.view.clearLastInfoMessage();
    this.view.setIsLoading(false);
  };

  public clearPost = (event: React.MouseEvent) => {
    event.preventDefault();
    this.view.setPost("");
  };

  public checkButtonStatus = (authToken: AuthToken, currentUser: User): boolean => {
    return !authToken || !currentUser;
  };
}