import { AuthToken } from "tweeter-shared";
import { NavBarPresenter, NavbarView } from "../../src/presenters/NavbarPresenter";
import { mock, instance, verify, spy, when, anything } from "@typestrong/ts-mockito";
import { UserService } from "../../src/model/service/UserService";

describe("NavbarPresenter", () => {
  let mockNavbarView: NavbarView;
  let navbarPresenter: NavBarPresenter;
  let mockUserService: UserService;

  const authToken = new AuthToken("abc123", Date.now());

  beforeEach(() => {
    mockNavbarView = mock<NavbarView>();
    const mockNavbarViewInstance = instance(mockNavbarView);
    const navbarPresenterSpy = spy(new NavBarPresenter(mockNavbarViewInstance))
    navbarPresenter = instance(navbarPresenterSpy);
    mockUserService = mock<UserService>();
    const mockUserServiceInstance = instance(mockUserService);
    when(navbarPresenterSpy.userService).thenReturn(mockUserServiceInstance);
  })

  it("tells the view to display a logging out message", async () => {
    await navbarPresenter.logOut(authToken);
    verify(mockNavbarView.displayInfoMessage("Logging Out...", 0)).once();
  });

  it("calls logout on the user service with the correct auth token", async () => {
    await navbarPresenter.logOut(authToken);
    verify(mockUserService.logout(authToken)).once();
  })

  it("tells the view to clear the last info message and clear the user info when successful", async () => {
    await navbarPresenter.logOut(authToken);
    verify(mockNavbarView.clearLastInfoMessage()).once();
    verify(mockNavbarView.clearUserInfo()).once();
    verify(mockNavbarView.displayErrorMessage(anything())).never();
  })

  it("tells the view to display an error message and does not tell it to clear the last info message or clear the user info when unsuccessful", async () => {
    const error = new Error("An Error occured");
    when(mockUserService.logout(authToken)).thenThrow(error);
    await navbarPresenter.logOut(authToken);
    verify(mockNavbarView.displayErrorMessage("Failed to log user out because of exception: An Error occured")).once();
    verify(mockNavbarView.clearLastInfoMessage()).never();
    verify(mockNavbarView.clearUserInfo()).never();
  })
});