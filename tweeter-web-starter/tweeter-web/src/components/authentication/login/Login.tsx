import "./Login.css";
import "bootstrap/dist/css/bootstrap.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthenticationFormLayout from "../AuthenticationFormLayout";
import useToastListener from "../../toaster/ToastListenerHook";
import AliasPasswordFields from "../AliasPasswordFields";
import useUserInfo from "../../userInfo/userInfoHook";
import { LoginPresenter } from "../../../presenters/LoginPresenter";
import { AuthenticationView } from "../../../presenters/AuthenticationPresenter";

interface Props {
  originalUrl?: string;
  presenterGenerator: (view: AuthenticationView) => LoginPresenter;
}

const Login = (props: Props) => {
  const [alias, setAlias] = useState("");
  const [password, setPassword] = useState("");  
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { updateUserInfo } = useUserInfo();
  const { displayErrorMessage, displayInfoMessage, clearLastInfoMessage } = useToastListener();

  const listener: AuthenticationView = {
    setIsLoading,
    updateUserInfo,
    navigate,
    displayErrorMessage,
    displayInfoMessage,
    clearLastInfoMessage
  }

  const [presenter] = useState(props.presenterGenerator(listener));

  const checkSubmitButtonStatus = (): boolean => {
    return presenter.checkSubmitButtonStatus(alias, password)
  };

  const loginOnEnter = (event: React.KeyboardEvent<HTMLElement>) => {
    presenter.loginOnEnter(event, alias, password, rememberMe, props.originalUrl)
  };

  const doLogin = async () => {
    presenter.doLogin(alias, password, rememberMe, props.originalUrl);
  };

  const inputFieldGenerator = () => {
    return (
      <AliasPasswordFields
      setAlias={setAlias}
      setPassword={setPassword}
      keyDownFunction={loginOnEnter}
    />
    );
  };

  const switchAuthenticationMethodGenerator = () => {
    return (
      <div className="mb-3">
        Not registered? <Link to="/register">Register</Link>
      </div>
    );
  };

  return (
    <AuthenticationFormLayout
      headingText="Please Sign In"
      submitButtonLabel="Sign in"
      oAuthHeading="Sign in with:"
      inputFieldGenerator={inputFieldGenerator}
      switchAuthenticationMethodGenerator={switchAuthenticationMethodGenerator}
      setRememberMe={setRememberMe}
      submitButtonDisabled={checkSubmitButtonStatus}
      isLoading={isLoading}
      submit={doLogin}
    />
  );
};

export default Login;
