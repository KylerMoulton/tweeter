import { Buffer } from "buffer";
import { AuthToken, User, FakeData, UserDto, AuthTokenDto } from "tweeter-shared";

export class UserService {
  public async getIsFollowerStatus (
    token: string,
    user: UserDto,
    selectedUser: UserDto
  ): Promise<boolean> {
    // TODO: Replace with the result of calling server
    return FakeData.instance.isFollower();
  };

  public async getFolloweeCount (
    token: string,
    user: UserDto
  ): Promise<number> {
    // TODO: Replace with the result of calling server
    return FakeData.instance.getFolloweeCount(user.alias);
  };

  public async getFollowerCount (
    token: string,
    user: UserDto
  ): Promise<number> {
    // TODO: Replace with the result of calling server
    return FakeData.instance.getFollowerCount(user.alias);
  };

  public async follow (
    token: string,
    userToFollow: UserDto
  ): Promise<[followerCount: number, followeeCount: number]> {
    // Pause so we can see the follow message. Remove when connected to the server
    await new Promise((f) => setTimeout(f, 2000));

    // TODO: Call the server

    return await this.getCounts(token, userToFollow);
  };

  public async unfollow (
    token: string,
    userToUnfollow: UserDto
  ): Promise<[followerCount: number, followeeCount: number]> {
    // Pause so we can see the unfollow message. Remove when connected to the server
    await new Promise((f) => setTimeout(f, 2000));

    // TODO: Call the server

    return await this.getCounts(token, userToUnfollow);
  };

  public async login (
    alias: string,
    password: string
  ): Promise<[UserDto, AuthTokenDto]> {
    // TODO: Replace with the result of calling the server
    const user = FakeData.instance.firstUser;

    if (user === null) {
      throw new Error("Invalid alias or password");
    }
    
    const authToken = FakeData.instance.authToken

    if (authToken === null) {
        throw new Error("Authtoken is null");
    }

    console.log(authToken)

    return [user.dto, authToken.dto];
  };

  public async register (
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: string,
    imageFileExtension: string
  ): Promise<[UserDto, AuthTokenDto]> {
    // Not neded now, but will be needed when you make the request to the server in milestone 3
    const imageStringBase64: string =
      Buffer.from(userImageBytes).toString("base64");

    // TODO: Replace with the result of calling the server
    const user = FakeData.instance.firstUser;

    if (user === null) {
      throw new Error("Invalid registration");
    }

    return [user.dto, FakeData.instance.authToken.dto];
  };

  public async logout (token: string): Promise<void> {
    // Pause so we can see the logging out message. Delete when the call to the server is implemented.
    await new Promise((res) => setTimeout(res, 1000));
  };

  public async getUser (
    token: string,
    alias: string
  ): Promise<UserDto | null> {
    // TODO: Replace with the result of calling the server
    const user = FakeData.instance.findUserByAlias(alias);
    return user ? user.dto : null;
  };

  public async getCounts(token: string, user: UserDto): Promise<[followerCount: number, followeeCount: number]> {
    const followerCount = await this.getFollowerCount(token, user);
    const followeeCount = await this.getFolloweeCount(token, user);

    return [followerCount, followeeCount] 
  }
}