import { Buffer } from "buffer";
import { AuthToken, User, FakeData, GetIsFollowerStatusRequest, FollowCountRequest, FollowStateRequest, LoginRequest } from "tweeter-shared";
import { ServerFacade } from "../../network/ServerFacade";

export class UserService {
    private serverFacade: ServerFacade;

    constructor() {
        this.serverFacade = new ServerFacade();
    }
    
  public async getIsFollowerStatus (
    authToken: AuthToken,
    user: User,
    selectedUser: User
  ): Promise<boolean> {
    const request: GetIsFollowerStatusRequest = {
        token: authToken.token,
        user: user.dto,
        selectedUser: selectedUser.dto
    }

    return this.serverFacade.getIsFollowerStatus(request)
  };

  public async getFolloweeCount (
    authToken: AuthToken,
    user: User
  ): Promise<number> {
    const request: FollowCountRequest = {
        token: authToken.token,
        user: user.dto
    }
    return this.serverFacade.getFolloweeCount(request);
  };

  public async getFollowerCount (
    authToken: AuthToken,
    user: User
  ): Promise<number> {
    const request: FollowCountRequest = {
        token: authToken.token,
        user: user.dto
    }
    return this.serverFacade.getFollowerCount(request);
  };

  public async follow (
    authToken: AuthToken,
    userToFollow: User
  ): Promise<[followerCount: number, followeeCount: number]> {
    const request: FollowStateRequest = {
        token: authToken.token,
        user: userToFollow.dto
    }
    const [followerCount, followeeCount] = await this.serverFacade.Follow(request);
    return [followerCount, followeeCount];
  };

  public async unfollow (
    authToken: AuthToken,
    userToUnfollow: User
  ): Promise<[followerCount: number, followeeCount: number]> {
    const request: FollowStateRequest = {
        token: authToken.token,
        user: userToUnfollow.dto
    }
    const [followerCount, followeeCount] = await this.serverFacade.Unfollow(request);
    return [followerCount, followeeCount];
  };

  public async login (
    alias: string,
    password: string
  ): Promise<[User, AuthToken]> {
    const request: LoginRequest = {
        alias: alias,
        password: password
    }

    return await this.serverFacade.Login(request)
  };

  public async register (
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: Uint8Array,
    imageFileExtension: string
  ): Promise<[User, AuthToken]> {
    // Not neded now, but will be needed when you make the request to the server in milestone 3
    const imageStringBase64: string =
      Buffer.from(userImageBytes).toString("base64");

    // TODO: Replace with the result of calling the server
    const user = FakeData.instance.firstUser;

    if (user === null) {
      throw new Error("Invalid registration");
    }

    return [user, FakeData.instance.authToken];
  };

  public async logout (authToken: AuthToken): Promise<void> {
    // Pause so we can see the logging out message. Delete when the call to the server is implemented.
    await new Promise((res) => setTimeout(res, 1000));
  };

  public async getUser (
    authToken: AuthToken,
    alias: string
  ): Promise<User | null> {
    // TODO: Replace with the result of calling the server
    return FakeData.instance.findUserByAlias(alias);
  };
}