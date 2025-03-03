import { AuthenticationPresenter, AuthenticationView } from "./AuthenticationPresenter";

export class LoginPresenter extends AuthenticationPresenter<AuthenticationView> {
  public loginOnEnter = (
    event: React.KeyboardEvent<HTMLElement>,
    alias: string,
    password: string,
    rememberMe: boolean,
    originalUrl?: string
  ) => {
    this.handleAuthOnEnter(event, () => this.doLogin(alias, password, rememberMe, originalUrl), alias, password);
  };

  public doLogin = async (alias: string, password: string, rememberMe: boolean, originalUrl?: string) => {
    this.doAuthentication(
      () => this.userService.login(alias, password),
      "log user in",
      rememberMe,
      originalUrl || "/"
    );
  };
}
