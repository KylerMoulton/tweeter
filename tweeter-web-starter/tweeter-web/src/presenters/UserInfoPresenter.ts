import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export interface UserInfoView {
  setIsFollower: (isFollower: boolean) => void;
  setFolloweeCount: (count: number) => void;
  setFollowerCount: (count: number) => void;
  setIsLoading: (isLoading: boolean) => void;
  setDisplayedUser: (user: User) => void;
  getAuthToken: () => AuthToken | null;
  getCurrentUser: () => User | null;
  getDisplayedUser: () => User | null;
  displayErrorMessage: (message: string) => void;
  displayInfoMessage: (message: string, duration: number) => void;
  clearLastInfoMessage: () => void;
}

export class UserInfoPresenter {
  public userService: UserService;
  public view: UserInfoView;

  public constructor(view: UserInfoView) {
    this.userService = new UserService();
    this.view = view;
  }
  public setIsFollowerStatus = async (
      authToken: AuthToken,
      currentUser: User,
      displayedUser: User
    ) => {
      try {
        if (currentUser === displayedUser) {
          this.view.setIsFollower(false);
        } else {
          this.view.setIsFollower(
            await this.userService.getIsFollowerStatus(authToken!, currentUser!, displayedUser!)
          );
        }
      } catch (error) {
        this.view.displayErrorMessage(
          `Failed to determine follower status because of exception: ${error}`
        );
      }
    };

public setNumbFollowees = async (
    authToken: AuthToken,
    displayedUser: User
  ) => {
    try {
      this.view.setFolloweeCount(await this.userService.getFolloweeCount(authToken, displayedUser));
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to get followees count because of exception: ${error}`
      );
    }
  };

  public setNumbFollowers = async (
    authToken: AuthToken,
    displayedUser: User
  ) => {
    try {
      this.view.setFollowerCount(await this.userService.getFollowerCount(authToken, displayedUser));
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to get followers count because of exception: ${error}`
      );
    }
  };

  public switchToLoggedInUser = (event: React.MouseEvent): void => {
    event.preventDefault();
    this.view.setDisplayedUser(this.view.getCurrentUser()!);
  };

  public followDisplayedUser = async (
    event: React.MouseEvent
  ): Promise<void> => {
    event.preventDefault();

    try {
      this.view.setIsLoading(true);
      this.view.displayInfoMessage(`Following ${this.view.getDisplayedUser!.name}...`, 0);

      const [followerCount, followeeCount] = await this.userService.follow(
        this.view.getAuthToken()!,
        this.view.getDisplayedUser()!
      );

      this.view.setIsFollower(true);
      this.view.setFollowerCount(followerCount);
      this.view.setFolloweeCount(followeeCount);
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to follow user because of exception: ${error}`
      );
    } finally {
      this.view.clearLastInfoMessage();
      this.view.setIsLoading(false);
    }
  };

  public unfollowDisplayedUser = async (
    event: React.MouseEvent
  ): Promise<void> => {
    event.preventDefault();

    try {
      this.view.setIsLoading(true);
      this.view.displayInfoMessage(
        `Unfollowing ${this.view.getDisplayedUser()!.name}...`,
        0
      );

      const [followerCount, followeeCount] = await this.userService.unfollow(
        this.view.getAuthToken()!,
        this.view.getDisplayedUser()!
      );

      this.view.setIsFollower(false);
      this.view.setFollowerCount(followerCount);
      this.view.setFolloweeCount(followeeCount);
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to unfollow user because of exception: ${error}`
      );
    } finally {
      this.view.clearLastInfoMessage();
      this.view.setIsLoading(false);
    }
  };
}