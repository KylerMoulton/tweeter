import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { DisplayedUserView, Presenter } from "./Presenter";

export interface UserInfoView extends DisplayedUserView{
  setIsFollower: (isFollower: boolean) => void;
  setFolloweeCount: (count: number) => void;
  setFollowerCount: (count: number) => void;
}

export class UserInfoPresenter extends Presenter<UserInfoView>{
  public userService: UserService;

  public constructor(view: UserInfoView) {
    super(view);
    this.userService = new UserService();
  }

  public setIsFollowerStatus = async (authToken: AuthToken, currentUser: User, displayedUser: User) => {
      this.doFailureReportingOperation(async () => {
        if (currentUser === displayedUser) {
          this.view.setIsFollower(false);
        } else {
          this.view.setIsFollower(
            await this.userService.getIsFollowerStatus(authToken!, currentUser!, displayedUser!)
          );
        }
      }, "determin follower status");
    };

  public setNumbFollowees = async (authToken: AuthToken, displayedUser: User) => {
    this.doFailureReportingOperation(async () => {
      this.view.setFolloweeCount(await this.userService.getFolloweeCount(authToken, displayedUser));
    }, "get followees count");
  };

  public setNumbFollowers = async (authToken: AuthToken, displayedUser: User) => {
    this.doFailureReportingOperation(async () => {
      this.view.setFollowerCount(await this.userService.getFollowerCount(authToken, displayedUser));
    }, "get followers count");
  };

  public switchToLoggedInUser = (event: React.MouseEvent, currentUser: User): void => {
    event.preventDefault();
    this.view.setDisplayedUser(currentUser);
  };

  public followDisplayedUser = async (event: React.MouseEvent, displayedUser: User, authToken: AuthToken): Promise<void> => {
    event.preventDefault();
    this.doFailureReportingOperation(async () => {
      this.view.setIsLoading(true);
      this.view.displayInfoMessage(`Following ${displayedUser.name}...`, 0);

      const [followerCount, followeeCount] = await this.userService.follow(
        authToken,
        displayedUser
      );

      this.view.setIsFollower(true);
      this.view.setFollowerCount(followerCount);
      this.view.setFolloweeCount(followeeCount);
    }, "follow user", () => {
      this.view.clearLastInfoMessage();
      this.view.setIsLoading(false);
    });
  };

  public unfollowDisplayedUser = async (event: React.MouseEvent, displayedUser: User, authToken: AuthToken): Promise<void> => {
    event.preventDefault();
    this.doFailureReportingOperation(async () => {
      this.view.setIsLoading(true);
      this.view.displayInfoMessage(
        `Unfollowing ${displayedUser.name}...`,
        0
      );

      const [followerCount, followeeCount] = await this.userService.unfollow(
        authToken,
        displayedUser
      );

      this.view.setIsFollower(false);
      this.view.setFollowerCount(followerCount);
      this.view.setFolloweeCount(followeeCount);
    }, "unfollow user", () => {
      this.view.clearLastInfoMessage();
      this.view.setIsLoading(false);
    });
  };
}