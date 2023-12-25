import PropTypes from "prop-types";
import Pagination from "rc-pagination";
import { Col, Row } from "reactstrap";
import enLocale from "./enLocale";

RcPagination.propTypes = {
  total: PropTypes.number,
  onChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  perPage: PropTypes.number.isRequired,
};

export default function RcPagination({ total, onChange, page, perPage }) {
  return (
    <Row>
      <Col lg="12">
        <div className="d-flex justify-content-center mb-4 mt-2">
          <Pagination
            total={total}
            onChange={onChange}
            current={page}
            pageSize={perPage}
            hideOnSinglePage
            locale={enLocale}
            className="pagination"
          />
        </div>
      </Col>
    </Row>
  );
}
