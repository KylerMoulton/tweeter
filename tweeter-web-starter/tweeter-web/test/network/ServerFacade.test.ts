import "isomorphic-fetch";
import { ServerFacade } from "../../src/network/ServerFacade"; 
import { RegisterRequest, FollowCountRequest, PagedUserItemRequest, AuthToken, User } from "tweeter-shared";

describe("ServerFacade Integration Tests", () => {
  let serverFacade: ServerFacade;
  
  let testUser = new User("John", "Doe", "@johndoe", "https://example.com/profile.jpg")
  let testUserImageBytes = new Uint8Array()

  beforeAll(() => {
    serverFacade = new ServerFacade();
  });

  test("Register a new user", async () => {
    const request: RegisterRequest = {
      firstName: "John",
      lastName: "Doe",
      alias: "@allen",
      password: "password123",
      userImageBytes: "bytes",
      imageFileExtension: ".jpg"
    };

    const [user, authToken] = await serverFacade.Register(request);

    expect(user).toBeInstanceOf(User);
    expect(user.alias).toBe("@allen");
    expect(authToken).toBeInstanceOf(AuthToken);
    expect(authToken.token).toBeDefined();
  });

  test("Get followee count", async () => {
    const request: FollowCountRequest = { token: "testToken", user: testUser };

    const followeeCount = await serverFacade.getFolloweeCount(request);

    expect(typeof followeeCount).toBe("number");
    expect(followeeCount).toBeGreaterThanOrEqual(0);
  });

  test("Get followers list", async () => {
    const request: PagedUserItemRequest = {
      token: "testToken",
      userAlias: "@johndoe",
      pageSize: 10,
      lastItem: null,
    };

    const [followers, hasMore] = await serverFacade.getMoreFollowers(request);

    expect(Array.isArray(followers)).toBe(true);
    followers.forEach((user) => expect(user).toBeInstanceOf(User));
    expect(typeof hasMore).toBe("boolean");
  });
});
