import Index from "./pages/User/Index/Index";
import Login from "./pages/User/Login/Login";
import Register from "./pages/User/Register/Register";
import ForgetPassword from "./pages/User/ForgetPassword/ForgetPassword";
import ResetPassword from "./pages/User/ResetPassword/ResetPassword";
import UserPanelLayout from "./pages/UserPanel/UserPanelLayout/UserPanelLayout";
import UserLoginPrivate from "./Components/Privates/UserLoginPrivate";
// import UserBanPrivate from "./Components/Privates/UserBanPrivate";
import UserPanelIndex from "./pages/UserPanel/UserPanelIndex/UserPanelIndex";
import UserPanelSendLinkForVerifyEmail from "./pages/UserPanel/UserPanelSendLinkForVerifyEmail/UserPanelSendLinkForVerifyEmail";
import UserPanelVerifyEmail from "./pages/UserPanel/UserPanelVerifyEmail/UserPanelVerifyEmail";
import UserPanelEditAccount from "./pages/UserPanel/UserPanelEditAccount/UserPanelEditAccount";
import UserPanelChangePassword from "./pages/UserPanel/UserPanelChangePassword/UserPanelChangePassword";
import UserPanelUpdateAvatar from "./pages/UserPanel/UserPanelUpdateAvatar/UserPanelUpdateAvatar";
import UserPanelUploadResume from "./pages/UserPanel/UserPanelUploadResume/UserPanelUploadResume";


const routes = [
  { path: "/", element: <Index /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/forget-password", element: <ForgetPassword /> },
  { path: "/reset-password/:token", element: <ResetPassword /> },

  { path: "/my-account/*",
    element: (
      <UserLoginPrivate>
        {/* <UserBanPrivate> */}
          <UserPanelLayout />
        {/* </UserBanPrivate> */}
      </UserLoginPrivate>
    ),
    children: [
      {path: "", element: <UserPanelIndex />},
      {path: "send-link-for-verify-email", element: <UserPanelSendLinkForVerifyEmail />},
      {path: "verify-email/:token", element: <UserPanelVerifyEmail />},
      {path: "edit-account", element: <UserPanelEditAccount />},
      {path: "change-password", element: <UserPanelChangePassword />},
      {path: "update-avatar", element: <UserPanelUpdateAvatar />},
      {path: "upload-resume", element: <UserPanelUploadResume />},
    ],
   },

];

export default routes;
