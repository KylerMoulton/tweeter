import { AuthToken, User } from "tweeter-shared";
import useUserInfo from "../../../src/components/userInfo/userInfoHook";
import { anything, instance, mock, verify, when } from "@typestrong/ts-mockito";
import { PostStatusPresenter, PostStatusView } from "../../../src/presenters/PostStatusPresenter";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import React from "react";
import userEvent from "@testing-library/user-event";
import PostStatus from "../../../src/components/postStatus/PostStatus";

jest.mock("../../../src/components/userInfo/userInfoHook", () => ({
  ...jest.requireActual("../../../src/components/userInfo/userInfoHook"),
  __esModule: true,
  default: jest.fn(),
}));

describe("PostStatus Component", () => {
  let mockUserInstance: User;
  let mockAuthTokenInstance: AuthToken;
  let mockPresenter: PostStatusPresenter;
  let mockPresenterInstance: PostStatusPresenter;
  let mockPresenterGenerator: (view: PostStatusView) => PostStatusPresenter;

  beforeEach(() => {
    mockPresenter = mock<PostStatusPresenter>();
    mockPresenterInstance = instance(mockPresenter)
    mockPresenterGenerator = jest.fn().mockReturnValue(mockPresenterInstance);
    when(mockPresenter.submitPost(anything(), anything(), anything(), anything())).thenReturn();
  });

  beforeAll(() => {
    mockUserInstance = new User("test", "user", "testuser", "/");
    mockAuthTokenInstance = new AuthToken("authtoken", 0);
  
    (useUserInfo as jest.Mock).mockReturnValue({
      currentUser: mockUserInstance,
      authToken: mockAuthTokenInstance,
    });
  
  });

  it("starts with Post Status and Clear buttons disabled", () => {
    const { postStatusButton, clearButton } = renderPostStatusAndGetElements(mockPresenterGenerator);
    expect(postStatusButton).toBeDisabled();
    expect(clearButton).toBeDisabled();
  });

  it("enables both buttons when the text field has text", async () => {
    const { postStatusButton, clearButton, statusField, user } = renderPostStatusAndGetElements(mockPresenterGenerator);
    await user.type(statusField, "Hello world");

    expect(postStatusButton).toBeEnabled();
    expect(clearButton).toBeEnabled();
  });

  it("disables both buttons when the text field is cleared", async () => {
    const { postStatusButton, clearButton, statusField, user } = renderPostStatusAndGetElements(mockPresenterGenerator);
    await user.type(statusField, "Hello world");
    await user.clear(statusField);

    expect(postStatusButton).toBeDisabled();
    expect(clearButton).toBeDisabled();
  });

  it("calls presenter's postStatus method with correct parameters when Post Status button is pressed", async () => {
    const { postStatusButton, statusField, user } = renderPostStatusAndGetElements(mockPresenterGenerator);
    const postText = "Hello world";

    await user.type(statusField, postText);
    await user.click(postStatusButton);
    verify(mockPresenter.submitPost(anything(), postText, mockUserInstance, mockAuthTokenInstance)).once();
  });

  const renderPostStatus = (presenterGenerator: (view: PostStatusView) => PostStatusPresenter) => {
    return render(
      <MemoryRouter>
        <PostStatus presenterGenerator={presenterGenerator} />
      </MemoryRouter>
    );
  };

  const renderPostStatusAndGetElements = (presenterGenerator: (view: PostStatusView) => PostStatusPresenter) => {
    const user = userEvent.setup();
    renderPostStatus(presenterGenerator);
    const postStatusButton = screen.getByRole("button", { name: /Post Status/i });
    const clearButton = screen.getByRole("button", { name: /Clear/i });
    const statusField = screen.getByLabelText("statusField");
    return { postStatusButton, clearButton, statusField, user };
  };
});
