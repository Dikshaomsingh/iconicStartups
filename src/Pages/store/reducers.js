import { combineReducers } from "redux";
// Authentication
import Login from "./auth/login/reducer";
import Account from "./auth/register/reducer";
import ForgetPassword from "./auth/forgetpwd/reducer";
import Profile from "./auth/profile/reducer";


const rootReducer = combineReducers({
    Login,
    Account,
    ForgetPassword,
    Profile
  });
  
  export default rootReducer;
  