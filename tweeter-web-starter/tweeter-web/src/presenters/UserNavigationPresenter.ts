import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { NavHookView, Presenter } from "./Presenter";

export class UserNavigationPresenter extends Presenter<NavHookView>{
  public userService: UserService;

  public constructor(view: NavHookView) {
    super(view);
    this.userService = new UserService();
  }

  public async navigateToUser (event: React.MouseEvent, authToken: AuthToken | null, currentUser: User | null): Promise<void> {
    event.preventDefault();
    await this.doFailureReportingOperation(async () => {
      const alias = this.extractAlias(event.target.toString());
      const user = await this.userService.getUser(authToken!, alias);
      if (user) {
        this.view.setDisplayedUser(currentUser?.equals(user) ? currentUser : user);
      }
    }, "get user");
  };

  public extractAlias (value: string): string {
    const index = value.indexOf("@");
    return value.substring(index);
  };
}