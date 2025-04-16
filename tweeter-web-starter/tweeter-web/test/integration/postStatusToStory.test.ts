import { UserService } from "../../src/model/service/UserService";
import { StatusService } from "../../src/model/service/StatusService";
import { PostStatusPresenter, PostStatusView } from "../../src/presenters/PostStatusPresenter";
import { AuthToken, Status, User } from "tweeter-shared";
import "isomorphic-fetch";

class TestView implements PostStatusView {
  private infoMessage = "";
  private errorMessage = "";
  private postText = "";
  private loading = false;

  setPost(post: string): void {
    this.postText = post;
  }

  getPostText(): string {
    return this.postText;
  }

  setIsLoading(value: boolean): void {
    this.loading = value;
  }

  clearLastInfoMessage(): void {}

  displayInfoMessage(message: string, duration: number): void {
    this.infoMessage = message;
  }

  displayErrorMessage(message: string): void {
    this.errorMessage = message;
  }

  getInfoMessage(): string {
    return this.infoMessage;
  }

  getErrorMessage(): string {
    return this.errorMessage;
  }

  isLoading(): boolean {
    return this.loading;
  }
}

describe("PostStatus Integration Test", () => {
  const alias = "test";
  const password = "test";
  const statusText = "Integration Test Status!";
  let user: User;
  let token: AuthToken;

  const view = new TestView();
  const presenter = new PostStatusPresenter(view);
  const statusService = new StatusService();
  const userService = new UserService();

  it("logs in, posts a status via presenter, and finds it in story", async () => {
    [user, token] = await userService.login(alias, password);

    await presenter.submitPost({ preventDefault: () => {} } as React.MouseEvent, statusText, user, token);

    expect(view.getInfoMessage()).toBe("Status posted!");
    expect(view.getPostText()).toBe("");

    const [story] = await statusService.loadMoreStoryItems(token, alias, 10, null);
    expect(story.length).toBeGreaterThan(0);
    expect(story[0].post).toBe(statusText);
    expect(story[0].user.alias).toBe(alias);
    expect(story[0].segments[0].text).toBe(statusText);
  }, 15000);
});
