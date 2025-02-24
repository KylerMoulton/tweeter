import { AuthToken } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export interface NavbarView {
  clearUserInfo: () => void;
  displayInfoMessage: (message: string, duration: number) => void;
  displayErrorMessage: (message: string) => void;
  clearLastInfoMessage: () => void;
}


export class NavBarPresenter {
    public userService: UserService;
    public view: NavbarView;

    public constructor(view: NavbarView) {
      this.userService = new UserService();
      this.view = view
    }

    public logOut = async (authToken: AuthToken | null) => {
      this.view.displayInfoMessage("Logging Out...", 0);
  
      try {
        await this.userService.logout(authToken!);
  
        this.view.clearLastInfoMessage();
        this.view.clearUserInfo();
      } catch (error) {
        this.view.displayErrorMessage(
          `Failed to log user out because of exception: ${error}`
        );
      }
    };
}