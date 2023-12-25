import React from "react";
import { Card, CardBody } from "reactstrap";
import PropTypes from "prop-types";

function CustomCard({ title, description, iconClass, color }) {
  return (
    <div>
      <Card className="mini-stats-wid">
        <CardBody>
          <div className="d-flex">
            <div className="flex-grow-1">
              <p className="text-muted fw-medium">{title}</p>
              <h4 className="mb-0">{description}</h4>
            </div>
            <div className="avatar-sm">
              <span
                className={`avatar-title rounded-circle bg-${color} text-white`}
              >
                <i className={"bx " + iconClass + " font-size-24"} />
              </span>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

CustomCard.propTypes = {
  title: PropTypes.string,
  description: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  iconClass: PropTypes.string,
  color: PropTypes.string,
};

export default CustomCard;
