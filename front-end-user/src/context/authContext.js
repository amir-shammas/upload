import { createContext } from "react";

const AuthContext = createContext({
  isLoggedIn: false,
  token: null,
  userInfos: null,
  setUserInfos: () => {},
  login: () => {},
  logout: () => {},
});

export default AuthContext;
