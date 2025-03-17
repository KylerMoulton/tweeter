import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent, { UserEvent } from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";

import Login from "../../../../src/components/authentication/login/Login";
import { LoginPresenter } from "../../../../src/presenters/LoginPresenter";
import { AuthenticationView } from "../../../../src/presenters/AuthenticationPresenter";
import { anyString, anything, instance, mock, verify, when } from "@typestrong/ts-mockito";

library.add(fab);

describe("Login Component", () => {
  let mockPresenterGenerator: (view: AuthenticationView) => LoginPresenter;
  let mockPresenter: LoginPresenter;
  let mockPresenterInstance: LoginPresenter;

  beforeEach(() => {
    mockPresenter = mock<LoginPresenter>();
    mockPresenterInstance = instance(mockPresenter);
    mockPresenterGenerator = jest.fn().mockReturnValue(mockPresenterInstance);
    when(mockPresenter.doLogin(anything(), anything(), anything(), anything())).thenReturn();
  });

  it("starts with the sign-in button disabled", () => {
    const { signInButton } = renderLoginAndGetElement("/", mockPresenterGenerator);
    expect(signInButton).toBeDisabled();
  });

  it("enables the sign-in button if both alias and password fields have text", async () => {
    const { signInButton, aliasField, passwordField, user } = renderLoginAndGetElement("/", mockPresenterGenerator);
    await fillCredentials(user, aliasField, passwordField, "a", "b");
    expect(signInButton).toBeEnabled();
  });

  it("disables the sign-in button if either field is cleared", async () => {
    const { signInButton, aliasField, passwordField, user } = renderLoginAndGetElement("/", mockPresenterGenerator);
    await fillCredentials(user, aliasField, passwordField, "a", "b");
    expect(signInButton).toBeEnabled();

    await user.clear(aliasField);
    expect(signInButton).toBeDisabled();

    await user.type(aliasField, "c");
    expect(signInButton).toBeEnabled();

    await user.clear(passwordField);
    expect(signInButton).toBeDisabled();
  });

  it("calls the presenters login method with correct parameters when the sign-in button is pressed", async () => {
    const originalUrl = "http://someurl.com";
    const alias = "@random";
    const password = "secure";
    const { signInButton, aliasField, passwordField, user } = renderLoginAndGetElement(originalUrl, mockPresenterGenerator);
    await fillCredentials(user, aliasField, passwordField, alias, password);
    await user.click(signInButton);

    verify(mockPresenter.doLogin(alias, password, anything(), originalUrl)).once();
  });
});

const renderLogin = (
  originalUrl: string,
  presenterGenerator: (view: AuthenticationView) => LoginPresenter
) => {
  return render(
    <MemoryRouter>
      <Login originalUrl={originalUrl} presenterGenerator={presenterGenerator} />
    </MemoryRouter>
  );
};

const renderLoginAndGetElement = (
  originalUrl: string,
  presenterGenerator: (view: AuthenticationView) => LoginPresenter
) => {
  const user = userEvent.setup();
  renderLogin(originalUrl, presenterGenerator);
  const signInButton = screen.getByRole("button", { name: /Sign in/i });
  const aliasField = screen.getByLabelText("alias");
  const passwordField = screen.getByLabelText("password");
  return { signInButton, aliasField, passwordField, user };
};

const fillCredentials = async (
  user: UserEvent,
  aliasField: HTMLElement,
  passwordField: HTMLElement,
  alias: string,
  password: string
) => {
  await user.type(aliasField, alias);
  await user.type(passwordField, password);
};
