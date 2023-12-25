import { post, get } from "../../../utils/helpers/api_helper";
import {
  AUTH_LOADING,
  LOGIN_FAIL,
  LOGIN_SUCCESS,
  LOGOUT,
  AUTH_ERROR,
  USER_LOADED,
} from "./actionTypes";

export const login =
  (data, setSubmitting, showAlertMsg, errorMsg) => async dispatch => {
    dispatch({
      type: AUTH_LOADING,
    });

    try {
      const response = await post("login", data);
      localStorage.setItem("token", response?.token);

      // load user data
      dispatch(getUserData({ setSubmitting, token: response?.token }));
    } catch (err) {
      let authErrorMsg = errorMsg;
      if (err?.response?.status == 400 && err?.response?.data?.message)
        authErrorMsg = err?.response?.data?.message;

      showAlertMsg("danger", authErrorMsg);
      setSubmitting(false);
      dispatch({
        type: LOGIN_FAIL,
        payload: err?.response?.data,
      });
    }
  };

/* fetching authenticated user information */
export const getUserData =
  (loginState = null) =>
  async dispatch => {
    if (!loginState) dispatch({ type: AUTH_LOADING });

    try {
      const response = await get("profile");
      if (response?.data) {
        if (!loginState) {
          dispatch({
            type: USER_LOADED,
            payload: response?.data,
          });
        } else {
          // login case
          loginState.setSubmitting(false);
          dispatch({
            type: LOGIN_SUCCESS,
            payload: { user: response?.data, token: loginState.token },
          });
        }
      } else {
        dispatch({
          type: AUTH_ERROR,
          payload: response,
        });
      }
    } catch (err) {
      // login case
      if (loginState) loginState.setSubmitting(false);

      dispatch({
        type: AUTH_ERROR,
        payload: err?.response?.data,
      });
    }
  };

export const logout = () => dispatch => {
  // todo call api logout
  localStorage.removeItem("token");
  dispatch({
    type: AUTH_LOADING,
  });

  setTimeout(() => {
    dispatch({
      type: LOGOUT,
    });
  }, 2500);
};
