import "./App.css";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Login from "./components/authentication/login/Login";
import Register from "./components/authentication/register/Register";
import MainLayout from "./components/mainLayout/MainLayout";
import Toaster from "./components/toaster/Toaster";
import useUserInfo from "./components/userInfo/userInfoHook";
import { FolloweePresenter } from "./presenters/FolloweePresenter";
import { FollowerPresenter } from "./presenters/FollowerPresenter";
import { StoryPresenter } from "./presenters/StoryPresenter";
import { FeedPresenter } from "./presenters/FeedPresenter";
import { LoginPresenter } from "./presenters/LoginPresenter";
import { RegisterPresenter, RegisterView } from "./presenters/RegisterPresenter";
import { AuthenticationView } from "./presenters/AuthenticationPresenter";
import ItemScroller from "./components/mainLayout/ItemScroller";
import { Status, User } from "tweeter-shared";
import StatusItem from "./components/statusItem/StatusItem";
import UserItem from "./components/userItem/UserItem";
import { StatusService } from "./model/service/StatusService";
import { FollowService } from "./model/service/FollowService";

const App = () => {
  const { currentUser, authToken } = useUserInfo();

  const isAuthenticated = (): boolean => {
    return !!currentUser && !!authToken;
  };

  return (
    <div>
      <Toaster position="top-right" />
      <BrowserRouter>
        {isAuthenticated() ? (
          <AuthenticatedRoutes />
        ) : (
          <UnauthenticatedRoutes />
        )}
      </BrowserRouter>
    </div>
  );
};

const AuthenticatedRoutes = () => {

  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Navigate to="/feed" />} />
        <Route 
          path="feed" 
          element={
            <ItemScroller<Status, StatusService>
              key={1}
              presenterGenerator={(view) => new FeedPresenter(view)}
              itemRenderer={(item) => <StatusItem value={item} />}
            />
          } 
        />
        <Route 
          path="story" 
          element={
            <ItemScroller<Status, StatusService>
              key={2}
              presenterGenerator={(view) => new StoryPresenter(view)}
              itemRenderer={(item) => <StatusItem value={item} />}
            />
          } 
        />
        <Route
          path="followees"
          element={
            <ItemScroller<User, FollowService>
              key={3}
              presenterGenerator={(view) => new FolloweePresenter(view)}
              itemRenderer={(item) => <UserItem value={item} />}
            />
          }
        />
        <Route
          path="followers"
          element={
            <ItemScroller<User, FollowService>
              key={4}
              presenterGenerator={(view) => new FollowerPresenter(view)}
              itemRenderer={(item) => <UserItem value={item} />}
            />
          }
        />
        <Route path="logout" element={<Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/feed" />} />
      </Route>
    </Routes>
  );
};

const UnauthenticatedRoutes = () => {
  const location = useLocation();

  return (
    <Routes>
      <Route path="/login" element={<Login presenterGenerator={(view: AuthenticationView) => new LoginPresenter(view)}/>} />
      <Route path="/register" element={<Register presenterGenerator={(view: RegisterView) => new RegisterPresenter(view)}/>} />
      <Route path="*" element={<Login originalUrl={location.pathname} presenterGenerator={(view: AuthenticationView) => new LoginPresenter(view)}/>} />
    </Routes>
  );
};

export default App;
