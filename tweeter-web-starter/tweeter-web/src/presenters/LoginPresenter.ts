import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export interface LoginView {
  alias: string;
  password: string;
  rememberMe: boolean;
  originalUrl?: string;

  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  updateUserInfo: (currentUser: User, displayedUser: User | null, authToken: AuthToken, remember: boolean) => void;
  navigate: (url: string) => void;
  displayErrorMessage: (message: string) => void;
}

export class LoginPresenter {
  private userService: UserService;
  private view: LoginView;

  public constructor(view: LoginView) {
    this.userService = new UserService;
    this.view = view;
  }

  public doLogin = async () => {
    try {
      this.view.setIsLoading(true);

      const [user, authToken] = await this.userService.login(this.view.alias, this.view.password);

      this.view.updateUserInfo(user, user, authToken, this.view.rememberMe);

      if (!!this.view.originalUrl) {
        this.view.navigate(this.view.originalUrl);
      } else {
        this.view.navigate("/");
      }
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to log user in because of exception: ${error}`
      );
    } finally {
      this.view.setIsLoading(false);
    }
  };
}