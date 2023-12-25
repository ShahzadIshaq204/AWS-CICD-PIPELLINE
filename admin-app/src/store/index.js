import rootReducer from "./reducers";
import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunkMiddleware from "redux-thunk";
import { onDebugMode } from "utils/helpers/environment";

const initialState = {};
const middleware = [thunkMiddleware];

export default function configureStore() {
  return createStore(
    rootReducer,
    initialState,
    onDebugMode()
      ? composeWithDevTools(applyMiddleware(...middleware))
      : applyMiddleware(...middleware)
  );
}
