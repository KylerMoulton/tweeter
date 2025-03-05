import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { AuthStateView, Presenter } from "./Presenter";

export interface AuthenticationView extends AuthStateView {
  updateUserInfo: (
    currentUser: User,
    displayedUser: User | null,
    authToken: AuthToken,
    remember: boolean
  ) => void;
  navigate: (url: string) => void;
}

export abstract class AuthenticationPresenter<V extends AuthenticationView> extends Presenter<V> {
  protected userService: UserService;

  public constructor(view: V) {
    super(view);
    this.userService = new UserService();
  }

  public checkSubmitButtonStatus = (...fields: string[]): boolean => {
    return fields.some((field) => !field);
  };

  public handleAuthOnEnter = (
    event: React.KeyboardEvent<HTMLElement>,
    action: () => void,
    ...fields: string[]
  ) => {
    if (event.key === "Enter" && !this.checkSubmitButtonStatus(...fields)) {
      action();
    }
  };

  protected async doAuthentication(
    authFunction: () => Promise<[User, AuthToken]>,
    operationDescription: string,
    rememberMe: boolean,
    redirectUrl: string = "/"
  ) {
    this.doFailureReportingOperation(async () => {
      this.view.setIsLoading(true);
      const [user, authToken] = await authFunction();
      this.view.updateUserInfo(user, user, authToken, rememberMe);
      this.view.navigate(redirectUrl);
    }, operationDescription, () => {
      this.view.setIsLoading(false);
    });
  }
}