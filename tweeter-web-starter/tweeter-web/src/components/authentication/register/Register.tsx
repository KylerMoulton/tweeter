import "./Register.css";
import "bootstrap/dist/css/bootstrap.css";
import { ChangeEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthenticationFormLayout from "../AuthenticationFormLayout";
import useToastListener from "../../toaster/ToastListenerHook";
import AliasPasswordFields from "../AliasPasswordFields";
import useUserInfo from "../../userInfo/userInfoHook";
import { RegisterPresenter, RegisterView } from "../../../presenters/RegisterPresenter";

interface Props {
  presenterGenerator: (view: RegisterView) => RegisterPresenter;
}

const Register = (props: Props) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [alias, setAlias] = useState("");
  const [password, setPassword] = useState("");  
  const [imageBytes, setImageBytes] = useState<Uint8Array>(new Uint8Array());
  const [imageUrl, setImageUrl] = useState<string>("");
  const [imageFileExtension, setImageFileExtension] = useState<string>("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { updateUserInfo } = useUserInfo();
  const { displayErrorMessage, displayInfoMessage, clearLastInfoMessage } = useToastListener();

  const listener: RegisterView = {
    setIsLoading,
    updateUserInfo,
    navigate,
    displayErrorMessage,
    displayInfoMessage,
    clearLastInfoMessage,
    setImageBytes,
    setImageUrl,
    setImageFileExtension
  }

  const [presenter] = useState(props.presenterGenerator(listener));

  const checkSubmitButtonStatus = (): boolean => {
    return presenter.checkSubmitButtonStatus(alias, firstName, lastName, password, imageUrl, imageFileExtension)
  };

  const registerOnEnter = (event: React.KeyboardEvent<HTMLElement>) => {
    presenter.registerOnEnter(event, alias, firstName, lastName, password, imageUrl,imageBytes, imageFileExtension, rememberMe);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    presenter.handleFileChange(event);
  };

  const doRegister = async () => {
    presenter.doRegister(alias, firstName, lastName, password,imageBytes, imageFileExtension, rememberMe);
  };

  const inputFieldGenerator = () => {
    return (
      <>
        <div className="form-floating">
          <input
            type="text"
            className="form-control"
            size={50}
            id="firstNameInput"
            placeholder="First Name"
            onKeyDown={registerOnEnter}
            onChange={(event) => setFirstName(event.target.value)}
          />
          <label htmlFor="firstNameInput">First Name</label>
        </div>
        <div className="form-floating">
          <input
            type="text"
            className="form-control"
            size={50}
            id="lastNameInput"
            placeholder="Last Name"
            onKeyDown={registerOnEnter}
            onChange={(event) => setLastName(event.target.value)}
          />
          <label htmlFor="lastNameInput">Last Name</label>
        </div>
        <AliasPasswordFields
          setAlias={setAlias}
          setPassword={setPassword}
          keyDownFunction={registerOnEnter}
        />
        <div className="form-floating mb-3">
          <input
            type="file"
            className="d-inline-block py-5 px-4 form-control bottom"
            id="imageFileInput"
            onKeyDown={registerOnEnter}
            onChange={handleFileChange}
          />
          <label htmlFor="imageFileInput">User Image</label>
          <img src={imageUrl} className="img-thumbnail" alt=""></img>
        </div>
      </>
    );
  };

  const switchAuthenticationMethodGenerator = () => {
    return (
      <div className="mb-3">
        Algready registered? <Link to="/login">Sign in</Link>
      </div>
    );
  };

  return (
    <AuthenticationFormLayout
      headingText="Please Register"
      submitButtonLabel="Register"
      oAuthHeading="Register with:"
      inputFieldGenerator={inputFieldGenerator}
      switchAuthenticationMethodGenerator={switchAuthenticationMethodGenerator}
      setRememberMe={setRememberMe}
      submitButtonDisabled={checkSubmitButtonStatus}
      isLoading={isLoading}
      submit={doRegister}
    />
  );
};

export default Register;
