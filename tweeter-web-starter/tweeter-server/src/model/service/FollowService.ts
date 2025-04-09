import { AuthToken, User, FakeData, UserDto } from "tweeter-shared";
import { AuthTokenDAO } from "../../dao/AuthTokenDAO";
import { FollowDAO } from "../../dao/FollowDAO";
import { UserDAO } from "../../dao/UserDAO";
import { DAOFactory } from "../../factory/DAOFactory";

export class FollowService {
    private readonly userDAO: UserDAO;
    private readonly authTokenDAO: AuthTokenDAO;
    private readonly followDAO: FollowDAO;
    
    constructor() {
        this.userDAO = DAOFactory.getDynamoUserDAO();
        this.authTokenDAO = DAOFactory.getDynamoAuthTokenDAO();
        this.followDAO = DAOFactory.getDynamoFollowDAO();
    }
   public async loadMoreFollowers(
      token: string,
      userAlias: string,
      pageSize: number,
      lastItem: UserDto | null
    ): Promise<[UserDto[], boolean]> {
    !await this.authTokenDAO.validate(token)
        const [users, hasMore] = await this.followDAO.LoadMoreFollowersAlias(userAlias, pageSize, lastItem?.alias ?? null)
        const usersDto = await this.userDAO.LoadMoreUsers(users)
      return [usersDto, hasMore]
    };
  
    public async loadMoreFollowees(
      token: string,
      userAlias: string,
      pageSize: number,
      lastItem: UserDto | null
    ): Promise<[UserDto[], boolean]> {
        !await this.authTokenDAO.validate(token)
        const [users, hasMore] = await this.followDAO.LoadMoreFolloweesAlias(userAlias, pageSize, lastItem?.alias ?? null)
        const usersDto = await this.userDAO.LoadMoreUsers(users)
        return [usersDto, hasMore]
    };

  private async getFakeData(lastItem: UserDto | null, pageSize: number, userAlias: string): Promise<[UserDto[], boolean]> {
    const [items, hasMore] = FakeData.instance.getPageOfUsers(User.fromDto(lastItem), pageSize, userAlias);
    const dtos = items.map((user) => user.dto);
    return [dtos, hasMore];
  }
}