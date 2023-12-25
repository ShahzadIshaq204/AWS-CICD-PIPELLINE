import PropTypes from "prop-types";

export default function PageHeading({ children }) {
  return <h2 className="my-4">{children}</h2>;
}

PageHeading.propTypes = {
  children: PropTypes.node,
};
