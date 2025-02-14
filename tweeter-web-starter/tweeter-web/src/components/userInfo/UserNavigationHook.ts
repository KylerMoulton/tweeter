import { AuthToken, FakeData, User } from "tweeter-shared";
import useToastListener from "../toaster/ToastListenerHook";
import useUserInfo from "./userInfoHook";

interface UseUserNavigation {
  navigateToUser: (event: React.MouseEvent) => Promise<void>;
}

const useUserNavigation = (): UseUserNavigation => {
  const { displayErrorMessage } = useToastListener();
  const { setDisplayedUser, currentUser, authToken } =
    useUserInfo();
    
  const navigateToUser = async (event: React.MouseEvent): Promise<void> => {
    event.preventDefault();
  
    try {
      const alias = extractAlias(event.target.toString());
      const user = await getUser(authToken!, alias);
  
      if (user) {
        setDisplayedUser(currentUser?.equals(user) ? currentUser : user);
      }
    } catch (error) {
      displayErrorMessage(`Failed to get user because of exception: ${error}`);
    }
  };

  const extractAlias = (value: string): string => {
    const index = value.indexOf("@");
    return value.substring(index);
  };

  const getUser = async (
    authToken: AuthToken,
    alias: string
  ): Promise<User | null> => {
    // TODO: Replace with the result of calling the server
    return FakeData.instance.findUserByAlias(alias);
  };

  return { navigateToUser };
};

export default useUserNavigation;
