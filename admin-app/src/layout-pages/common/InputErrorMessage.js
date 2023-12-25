import { ErrorMessage } from "@hookform/error-message";
import PropTypes from "prop-types";

export default function InputErrorMessage({ errors, name }) {
  return (
    <ErrorMessage
      errors={errors}
      name={name}
      render={({ message }) => (
        <span className="text-danger d-flex align-items-center mt-2">
          <i className="bx bx-info-circle me-2"></i>
          {message}
        </span>
      )}
    />
  );
}

InputErrorMessage.propTypes = {
  name: PropTypes.string,
  errors: PropTypes.object,
};
