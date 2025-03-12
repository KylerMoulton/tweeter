import { AuthToken, User } from "tweeter-shared";
import { PostStatusPresenter, PostStatusView } from "../../src/presenters/PostStatusPresenter";
import { mock, instance, verify, spy, when, anything, capture } from "@typestrong/ts-mockito";
import { StatusService } from "../../src/model/service/StatusService";

describe("PostStatusPresenter", () => {
  let mockPostStatusView: PostStatusView;
  let postStatusPresenter: PostStatusPresenter;
  let mockStatusService: StatusService;

  const authToken = new AuthToken("abc123", Date.now());
  const user = new User('test', 'user', 'testuser', 'imageurl')
  const event = {preventDefault: jest.fn(),} as unknown as React.MouseEvent;
  const post = "Post"

  beforeEach(() => {
    mockPostStatusView = mock<PostStatusView>();
    const mockPostStatusViewInstance = instance(mockPostStatusView);
    const PostStatusPresenterSpy = spy(new PostStatusPresenter(mockPostStatusViewInstance))
    postStatusPresenter = instance(PostStatusPresenterSpy);
    mockStatusService = mock<StatusService>();
    const mockUserServiceInstance = instance(mockStatusService);
    when(PostStatusPresenterSpy.statusService).thenReturn(mockUserServiceInstance);
  })

  it("tells the view to display a posting status message", async () => {
    await postStatusPresenter.submitPost(event, post, user, authToken);
    verify(mockPostStatusView.displayInfoMessage("Posting status...", 0)).once();
  });

  it("calls postStatus on the post status service with the correct status and auth token", async () => {
    await postStatusPresenter.submitPost(event, post, user, authToken);
    let [,lastStatus] = capture(mockStatusService.postStatus).last();
    verify(mockStatusService.postStatus(authToken, anything())).once();
    expect(lastStatus.post).toBe(post);
    expect(lastStatus.user.firstName).toBe(user.firstName);
    expect(lastStatus.user.lastName).toBe(user.lastName);
    expect(lastStatus.user.alias).toBe(user.alias);
    expect(lastStatus.user.imageUrl).toBe(user.imageUrl);
  });
  
  it("tells the view to clear the last info message, clear the post, and display a status posted message when successful", async () => {
    await postStatusPresenter.submitPost(event, post, user, authToken);
    verify(mockPostStatusView.clearLastInfoMessage()).once();
    verify(mockPostStatusView.setPost("")).once();
    verify(mockPostStatusView.displayInfoMessage("Status posted!", 2000)).once();
    verify(mockPostStatusView.displayErrorMessage(anything())).never();
  });
  
  it("tells the view to display an error message and clear the last info message and does not tell it to clear the post or display a status posted message when unsuccessful", async () => {
    const error = new Error("An Error occured");
    when(mockStatusService.postStatus(authToken, anything())).thenThrow(error);
    await postStatusPresenter.submitPost(event, post, user, authToken);
    verify(mockPostStatusView.displayErrorMessage("Failed to post the status because of exception: An Error occured")).once();
    verify(mockPostStatusView.clearLastInfoMessage()).once();
    verify(mockPostStatusView.setPost("")).never();
    verify(mockPostStatusView.displayInfoMessage("Status posted!",2000)).never();
  })
});
