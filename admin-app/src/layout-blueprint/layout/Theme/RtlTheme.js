import React from "react";
import "../../../assets/scss/theme-rtl.scss";
import { log } from "utils/helpers/environment";

const RtlTheme = () => {
  return <React.Fragment>{log("rtl")}</React.Fragment>;
};
export default RtlTheme;
