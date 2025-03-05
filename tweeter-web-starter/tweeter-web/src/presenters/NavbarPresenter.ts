import { AuthToken } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { MessageView, Presenter, View } from "./Presenter";

export interface NavbarView extends MessageView{
  clearUserInfo: () => void;
}

export class NavBarPresenter extends Presenter<NavbarView>{
  public userService: UserService;

  public constructor(view: NavbarView) {
    super(view);
    this.userService = new UserService();
  }

  public logOut = async (authToken: AuthToken | null) => {
    this.view.displayInfoMessage("Logging Out...", 0);
    this.doFailureReportingOperation(async () => {
      await this.userService.logout(authToken!);
      this.view.clearLastInfoMessage();
      this.view.clearUserInfo();
    }, "log user out");
  };
}