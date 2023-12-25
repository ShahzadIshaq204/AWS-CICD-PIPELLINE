import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";

export default function Auth() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector(state => state.Login);
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get("token");

  useEffect(() => {
    try {
      const loggedUser = JSON.parse(window.atob(decodeURIComponent(token)));
      dispatch({ type: "AUTH_SUCCESS", payload: { user: loggedUser } });
      console.log(loggedUser);
    } catch (e) {
      console.log("invalid token unathorized...");
    }
  }, []);

  if (isAuthenticated) return <Redirect exact to={"/sessions"} />;

  return <div>loading...</div>;
}
