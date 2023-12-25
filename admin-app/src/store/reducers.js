import { combineReducers } from "redux";
// Authentication
import Login from "./auth/login/reducer";

// Front
import Layout from "./layout/reducer";

const rootReducer = combineReducers({
  Layout,
  Login,
});

export default rootReducer;
