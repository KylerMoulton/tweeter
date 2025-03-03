import { NavHookView } from "../../presenters/Presenter";
import { UserNavigationPresenter } from "../../presenters/UserNavigationPresenter";
import useToastListener from "../toaster/ToastListenerHook";
import useUserInfo from "./userInfoHook";


interface UseUserNavigation {
  navigateToUser: (event: React.MouseEvent) => Promise<void>;
}

const useUserNavigation = (): UseUserNavigation => {
  const { displayErrorMessage } = useToastListener();
  const { setDisplayedUser, currentUser, authToken } =
    useUserInfo();

  const listener: NavHookView = {
    setDisplayedUser,
    displayErrorMessage,
  }

  const presenter = new UserNavigationPresenter(listener)
  
  const navigateToUser = async (event: React.MouseEvent): Promise<void> => {
    presenter.navigateToUser(event, authToken, currentUser)
  };

  return { navigateToUser };
};

export default useUserNavigation;
