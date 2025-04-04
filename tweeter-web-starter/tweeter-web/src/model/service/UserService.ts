import { Buffer } from "buffer";
import { AuthToken, User, FakeData, GetIsFollowerStatusRequest, FollowCountRequest, FollowStateRequest, LoginRequest, RegisterRequest, TweeterRequest, TweeterUserAliasRequest } from "tweeter-shared";
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
        userAlias: user.alias
    }
    return this.serverFacade.getFolloweeCount(request);
  };

  public async getFollowerCount (
    authToken: AuthToken,
    user: User
  ): Promise<number> {
    const request: FollowCountRequest = {
        token: authToken.token,
        userAlias: user.alias
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
    const request: RegisterRequest = {
        firstName: firstName,
        lastName: lastName,
        alias: alias,
        password: password,
        userImageBytes: Buffer.from(userImageBytes).toString("base64"),
        imageFileExtension: imageFileExtension
    }
    return await this.serverFacade.Register(request);
  };

  public async logout (authToken: AuthToken): Promise<void> {
    const request: TweeterRequest = {
        token: authToken.token,
    }
    return await this.serverFacade.Logout(request)
  };

  public async getUser (
    authToken: AuthToken,
    alias: string
  ): Promise<User | null> {
    const request: TweeterUserAliasRequest = {
        token: authToken.token,
        userAlias: alias
    }
    return await this.serverFacade.GetUser(request)
  };
}