import {
    AuthToken,
    FollowCountRequest,
    FollowCountResponse,
    FollowStateRequest,
    FollowStateResponse,
    GetIsFollowerStatusRequest,
    GetIsFollowerStatusResponse,
    GetUserResponse,
    LoginRegisterResponse,
    LoginRequest,
    PagedStatusItemRequest,
  PagedStatusItemResponse,
  PagedUserItemRequest,
  PagedUserItemResponse,
  PostStatusRequest,
  PostStatusResponse,
  RegisterRequest,
  Status,
  TweeterRequest,
  TweeterResponse,
  TweeterUserAliasRequest,
  User,
  UserDto,
} from "tweeter-shared";
import { ClientCommunicator } from "./ClientCommunicator";

export class ServerFacade {
  private SERVER_URL = "https://umdwy36u9j.execute-api.us-east-1.amazonaws.com/dev";

  private clientCommunicator = new ClientCommunicator(this.SERVER_URL);

  public async getMoreFollowees(
    request: PagedUserItemRequest
  ): Promise<[User[], boolean]> {
    const response = await this.clientCommunicator.doPost< 
      PagedUserItemRequest, 
      PagedUserItemResponse 
    >(request, "/followee/list");

    // Convert the UserDto array returned by ClientCommunicator to a User array
    const items: User[] | null =
      response.success && response.items
        ? response.items.map((dto) => User.fromDto(dto) as User)
        : null;

    // Handle errors
    if (response.success) {
      if (items == null) {
        throw new Error("No followees found");
      } else {
        return [items, response.hasMore];
      }
    } else {
      console.error(response);
      throw new Error(response.message || "Unknown error");
    }
  }

  public async getMoreFollowers(
    request: PagedUserItemRequest
  ): Promise<[User[], boolean]> {
    const response = await this.clientCommunicator.doPost< 
      PagedUserItemRequest, 
      PagedUserItemResponse 
    >(request, "/follower/list");

    // Convert the UserDto array returned by ClientCommunicator to a User array
    const items: User[] | null =
      response.success && response.items
        ? response.items.map((dto) => User.fromDto(dto) as User)
        : null;

    // Handle errors
    if (response.success) {
      if (items == null) {
        throw new Error("No followers found");
      } else {
        return [items, response.hasMore];
      }
    } else {
      console.error(response);
      throw new Error(response.message || "Unknown error");
    }
  }

  public async getMoreFeedItems(
    request: PagedStatusItemRequest
  ): Promise<[Status[], boolean]> {
    const response = await this.clientCommunicator.doPost< 
      PagedStatusItemRequest, 
      PagedStatusItemResponse 
    >(request, "/feed/list");

    // Convert the StatusDto array returned by ClientCommunicator to a Status array
    const items: Status[] | null =
      response.success && response.items
        ? response.items.map((dto) => Status.fromDto(dto) as Status)
        : null;

    // Handle errors
    if (response.success) {
      if (items == null) {
        throw new Error("No feed items found");
      } else {
        return [items, response.hasMore];
      }
    } else {
      console.error(response);
      throw new Error(response.message || "Unknown error");
    }
  }

  public async getMoreStoryItems(
    request: PagedStatusItemRequest
  ): Promise<[Status[], boolean]> {
    const response = await this.clientCommunicator.doPost< 
      PagedStatusItemRequest, 
      PagedStatusItemResponse 
    >(request, "/story/list");

    // Convert the StatusDto array returned by ClientCommunicator to a Status array
    const items: Status[] | null =
      response.success && response.items
        ? response.items.map((dto) => Status.fromDto(dto) as Status)
        : null;

    // Handle errors
    if (response.success) {
      if (items == null) {
        throw new Error("No story items found");
      } else {
        return [items, response.hasMore];
      }
    } else {
      console.error(response);
      throw new Error(response.message || "Unknown error");
    }
  }


  public async postStatus(
    request: PostStatusRequest
  ) {
    const response = await this.clientCommunicator.doPost< 
      PostStatusRequest, 
      PostStatusResponse 
    >(request, "/post");

    if (!response.success) {
      console.error(response);
      throw new Error(response.message || "Unknown error");
    }
  }

  public async getIsFollowerStatus(
    request: GetIsFollowerStatusRequest
  ): Promise<boolean> {
    const response = await this.clientCommunicator.doPost< 
      GetIsFollowerStatusRequest, 
      GetIsFollowerStatusResponse 
    >(request, "/following/status");

    // Handle errors
    if (response.success) {
      if (response.followStatus == null) {
        throw new Error("Could not determine status");
      } else {
        return response.followStatus;
      }
    } else {
      console.error(response);
      throw new Error(response.message || "Unknown error");
    }
  }

  public async getFolloweeCount(
    request: FollowCountRequest
  ): Promise<number> {
    const response = await this.clientCommunicator.doPost< 
      FollowCountRequest, 
      FollowCountResponse 
    >(request, "/followees/count");

    // Handle errors
    if (response.success) {
      if (response.count == null) {
        throw new Error("Could not load number of followees");
      } else {
        return response.count;
      }
    } else {
      console.error(response);
      throw new Error(response.message || "Unknown error");
    }
  }

  public async getFollowerCount(
    request: FollowCountRequest
  ): Promise<number> {
    const response = await this.clientCommunicator.doPost< 
      FollowCountRequest, 
      FollowCountResponse 
    >(request, "/followers/count");

    // Handle errors
    if (response.success) {
      if (response.count == null) {
        throw new Error("Could not load number of followers");
      } else {
        return response.count;
      }
    } else {
      console.error(response);
      throw new Error(response.message || "Unknown error");
    }
  }

  public async Follow(
    request: FollowStateRequest
  ): Promise<[number, number]> {
    const response = await this.clientCommunicator.doPost< 
      FollowStateRequest, 
      FollowStateResponse 
    >(request, "/follow");

    // Handle errors
    if (response.success) {
      if (response.followeeCount == null || response.followerCount == null) {
        throw new Error("Could not follow user");
      } else {
        return [response.followerCount, response.followeeCount];
      }
    } else {
      console.error(response);
      throw new Error(response.message || "Unknown error");
    }
  }

  public async Unfollow(
    request: FollowStateRequest
  ): Promise<[number, number]> {
    const response = await this.clientCommunicator.doPost< 
      FollowStateRequest, 
      FollowStateResponse 
    >(request, "/unfollow");

    // Handle errors
    if (response.success) {
      if (response.followeeCount == null || response.followerCount == null) {
        throw new Error("Could not unfollow user");
      } else {
        return [response.followerCount, response.followeeCount];
      }
    } else {
      console.error(response);
      throw new Error(response.message || "Unknown error");
    }
  }

  public async Login(
    request: LoginRequest
  ): Promise<[User, AuthToken]> {
    const response = await this.clientCommunicator.doPost< 
      LoginRequest, 
      LoginRegisterResponse 
    >(request, "/login");

    // Handle errors
    if (response.success) {
      if (response.user == null || response.authToken == null) {
        throw new Error("Could not login");
      } else {
        return [User.fromDto(response.user) as User, AuthToken.fromDto(response.authToken) as AuthToken];
      }
    } else {
      console.error(response);
      throw new Error(response.message || "Unknown error");
    }
  }

  public async Register(
    request: RegisterRequest
  ): Promise<[User, AuthToken]> {
    const response = await this.clientCommunicator.doPost< 
    RegisterRequest, 
      LoginRegisterResponse 
    >(request, "/register");

    // Handle errors
    if (response.success) {
      if (response.user == null || response.authToken == null) {
        throw new Error("Could not register");
      } else {
        return [User.fromDto(response.user) as User, AuthToken.fromDto(response.authToken) as AuthToken];
      }
    } else {
      console.error(response);
      throw new Error(response.message || "Unknown error");
    }
  }

  public async Logout(
    request: TweeterRequest
  ) {
    const response = await this.clientCommunicator.doPost< 
      TweeterRequest, 
      TweeterResponse 
    >(request, "/logout");

    if (!response.success) {
      console.error(response);
      throw new Error(response.message || "Unknown error");
    }
  }

  public async GetUser(
    request: TweeterUserAliasRequest
  ): Promise<User> {
    const response = await this.clientCommunicator.doPost< 
    TweeterUserAliasRequest, 
      GetUserResponse 
    >(request, "/getuser");

    // Handle errors
    if (response.success) {
      if (response.user == null) {
        throw new Error("Could not get user");
      } else {
        return User.fromDto(response.user) as User;
      }
    } else {
      console.error(response);
      throw new Error(response.message || "Unknown error");
    }
  }
}
