import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";

export interface PostStatusView {
  setIsLoading: (value: boolean) => void;
  displayInfoMessage: (message: string, duration: number) => void;
  displayErrorMessage: (message: string) => void;
  clearLastInfoMessage: () => void;
  getCurrentUser: () => User | null; // Assuming currentUser is a string
  getAuthToken: () => AuthToken | null;
  setPost: (post: string) => void;
}


export class PostStatusPresenter {
  private statusService: StatusService;
  private view: PostStatusView;

  public constructor(view: PostStatusView) {
    this.statusService = new StatusService();
    this.view = view;
  }

  public submitPost = async (event: React.MouseEvent, post: string) => {
    event.preventDefault();

    try {
      this.view.setIsLoading(true);
      this.view.displayInfoMessage("Posting status...", 0);

      const currentUser = this.view.getCurrentUser();
      const authToken = this.view.getAuthToken();

      if (!currentUser || !authToken) {
        throw new Error("User not authenticated.");
      }

      const status = new Status(post, currentUser, Date.now());
      await this.statusService.postStatus(authToken, status);

      this.view.setPost("");
      this.view.displayInfoMessage("Status posted!", 2000);
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to post the status because of exception: ${error}`
      );
    } finally {
      this.view.clearLastInfoMessage();
      this.view.setIsLoading(false);
    }
  };

  public clearPost = (event: React.MouseEvent) => {
    event.preventDefault();
    this.view.setPost("");
  };

  public checkButtonStatus = (): boolean => {
    return !this.view.getAuthToken() || !this.view.getCurrentUser();
  };
}