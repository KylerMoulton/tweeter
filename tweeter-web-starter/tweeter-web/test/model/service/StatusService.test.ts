import "isomorphic-fetch";
import { StatusService } from "../../../src/model/service/StatusService";
import { ServerFacade } from "../../../src/network/ServerFacade";
import { AuthToken, Status, User } from "tweeter-shared";
import { mock, instance, when, verify, anything } from "@typestrong/ts-mockito";

describe("StatusService Integration Tests", () => {
  let serverFacade: ServerFacade;
  let statusService: StatusService;
  let mockedServerFacade: ServerFacade;
  let mockServerFacade: ServerFacade;
  let authToken: AuthToken;
  let user: User;

  beforeEach(() => {
    serverFacade = new ServerFacade();
    mockedServerFacade = mock(ServerFacade);
    mockServerFacade = instance(mockedServerFacade);
    statusService = new StatusService();
    // (statusService as any).serverFacade = mockServerFacade;
    authToken = new AuthToken("test-token", 5);
    user = new User("john", "doe", "@allen", "url");
    const mockStatuses: Status[] = [
      new Status("First post", user, 6),
      new Status("Second post", user, 7),
    ];
    const hasMore = true;
    // when(mockedServerFacade.getMoreStoryItems(anything())).thenResolve([mockStatuses, hasMore]);
  });

  it("Successfully retrieves a user's story page", async () => {
    const [statuses, morePages] = await statusService.loadMoreStoryItems(authToken, user.alias, 10, null);

    expect(statuses.length).toBeGreaterThanOrEqual(1);
    expect(statuses[0].post).toBeDefined();
    expect(statuses[1].post).toBeDefined();
    expect(morePages).toBe(true);

  });
});
