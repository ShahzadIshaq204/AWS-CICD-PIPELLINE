import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import ValidationMailStatus from "./components/ValidationMailStatus";

export default function MailSend() {
  const history = useHistory();
  const location = useLocation();
  const email = location.state?.email;
  const user = useSelector(state => state.Login.user);
  useEffect(() => {
    if (user || !email) history.push("/login");
  }, []);

  return (
    <>
      <ValidationMailStatus status="send" email={email} />
    </>
  );
}
