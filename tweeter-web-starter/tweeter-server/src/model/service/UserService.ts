import { Buffer } from "buffer";
import { AuthToken, User, FakeData, UserDto, AuthTokenDto } from "tweeter-shared";
import bcrypt from "bcryptjs";
import { DAOFactory } from "../../factory/DAOFactory"
import { UserDAO } from "../../dao/UserDAO";
import { AuthTokenDAO } from "../../dao/AuthTokenDAO";
import { FollowDAO } from "../../dao/FollowDAO";


export class UserService {
    private readonly userDAO: UserDAO;
    private readonly authTokenDAO: AuthTokenDAO;
    private readonly followDAO: FollowDAO;
    
    constructor() {
        this.userDAO = DAOFactory.getDynamoUserDAO();
        this.authTokenDAO = DAOFactory.getDynamoAuthTokenDAO();
        this.followDAO = DAOFactory.getDynamoFollowDAO();
    }

  public async getIsFollowerStatus (
    token: string,
    user: UserDto,
    selectedUser: UserDto
  ): Promise<boolean> {
    await this.authTokenDAO.validate(token)
    return await this.followDAO.GetIsFollowerStatus(user.alias, selectedUser.alias)
  };

  public async getFolloweeCount (
    token: string,
    userAlias: string
  ): Promise<number> {
    await this.authTokenDAO.validate(token)
    return await this.followDAO.GetFolloweeCount(userAlias)
  };

  public async getFollowerCount (
    token: string,
    userAlias: string
  ): Promise<number> {
    await this.authTokenDAO.validate(token)
    return await this.followDAO.GetFollowerCount(userAlias)
  };

  public async follow (
    token: string,
    userToFollow: UserDto
  ): Promise<[followerCount: number, followeeCount: number]> {
    await this.authTokenDAO.validate(token)
    const userAlias = await this.authTokenDAO.getUserAliasFromToken(token)
    await this.followDAO.Follow(userAlias, userToFollow.alias)
    return await this.getCounts(token, userToFollow.alias);
  };

  public async unfollow (
    token: string,
    userToUnfollow: UserDto
  ): Promise<[followerCount: number, followeeCount: number]> {
    await this.authTokenDAO.validate(token)
    const userAlias = await this.authTokenDAO.getUserAliasFromToken(token)
    await this.followDAO.Unfollow(userAlias, userToUnfollow.alias)
    return await this.getCounts(token, userToUnfollow.alias);
  };

  public async login (
    alias: string,
    password: string
  ): Promise<[UserDto, AuthTokenDto]> {
    const user = await this.userDAO.login(alias, password)
    if (user === null) {
      throw new Error(`[Bad Request] Invalid alias or password`);
    }
    
    const authToken = await this.authTokenDAO.create(alias);

    return [user, authToken];
  };

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: string,
    imageFileExtension: string
): Promise<[UserDto, AuthTokenDto]> {
    const imageBytes: Uint8Array = Buffer.from(userImageBytes, "base64")
    const hashedPassword = await bcrypt.hash(password, 5);
    
    const user =  await this.userDAO.register(firstName, lastName, alias, hashedPassword, imageBytes, imageFileExtension);
    const authToken = await this.authTokenDAO.create(alias);

    if (user === null) {
        throw new Error(`[Bad Request] Unable to register new user, please check entered information`);
    }

    return [user, authToken]
}

  public async logout (token: string): Promise<void> {
    await this.authTokenDAO.delete(token)
  };

  public async getUser (
    token: string,
    alias: string
  ): Promise<UserDto | null> {
    await this.authTokenDAO.validate(token)
    return await this.userDAO.getUser(alias)
  };

  public async getCounts(token: string, userAlias: string): Promise<[followerCount: number, followeeCount: number]> {
    const followerCount = await this.getFollowerCount(token, userAlias);
    const followeeCount = await this.getFolloweeCount(token, userAlias);

    return [followerCount, followeeCount] 
  }
}