import PropTypes from "prop-types";
import { layoutDirections } from "utils/constants/layout";
import React from "react";
import { useSelector } from "react-redux";

const DefaultTheme = React.lazy(() => import("./DefaultTheme"));
const RtlTheme = React.lazy(() => import("./RtlTheme"));

const ThemeDirectionSwitcher = ({ children }) => {
  const chosenDirection = useSelector(state => state.Layout.layoutDirection);
  return (
    <>
      <React.Suspense fallback={""}>
        {chosenDirection === layoutDirections.DEFAULT && <DefaultTheme />}
        {chosenDirection === layoutDirections.RTL && <RtlTheme />}
        {children}
      </React.Suspense>
    </>
  );
};

ThemeDirectionSwitcher.propTypes = {
  children: PropTypes.node,
};

export default ThemeDirectionSwitcher;
