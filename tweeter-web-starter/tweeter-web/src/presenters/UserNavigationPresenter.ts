import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export interface UserNavigationView {
  setDisplayedUser: (user: User) => void
  displayErrorMessage: (message: string, bootstrapClasses?: string) => void
}

export class UserNavigationPresenter {
  public userService: UserService;
  public view: UserNavigationView;

  public constructor(view: UserNavigationView) {
    this.userService = new UserService();
    this.view = view
  }

  public async navigateToUser (event: React.MouseEvent, authToken: AuthToken | null, currentUser: User | null): Promise<void> {
    event.preventDefault();
  
    try {
      const alias = this.extractAlias(event.target.toString());
      const user = await this.userService.getUser(authToken!, alias);
  
      if (user) {
        this.view.setDisplayedUser(currentUser?.equals(user) ? currentUser : user);
      }
    } catch (error) {
      this.view.displayErrorMessage(`Failed to get user because of exception: ${error}`);
    }
  };

  public extractAlias (value: string): string {
    const index = value.indexOf("@");
    return value.substring(index);
  };
}