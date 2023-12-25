import PropTypes from "prop-types";
import React, { useEffect } from "react";
//redux
import { connect, useDispatch } from "react-redux";
import { withRouter } from "react-router-dom";
import { logout } from "../../../store/actions";

const Logout = ({ history, logout }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(logout());
  }, []);

  return <></>;
};

Logout.propTypes = {
  history: PropTypes.object,
  logout: PropTypes.func,
};

export default connect(null, { logout })(withRouter(Logout));
