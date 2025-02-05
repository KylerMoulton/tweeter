import { useContext } from "react";
import { UserInfoContext } from "./UserInfoProvider";

const useUser = () => useContext(UserInfoContext);

export default useUser;
