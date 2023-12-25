import React from "react";
import { BarLoader } from "react-spinners";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

function HocApiData({
  loading,
  error,
  msgError = null,
  isEmpty,
  children,
  refetch = null,
  loadingLite = null,
}) {
  const { t } = useTranslation();

  if (loading) return <ApiCallLoading loadingLite={loadingLite} />;

  if (error)
    return (
      <div>
        <h5 className="text-danger">
          {msgError || t("page.common.hocApiData.error")}
        </h5>
        {refetch && (
          <button className="btn btn-danger" onClick={refetch}>
            {t("page.common.btn.refetch")}
          </button>
        )}
      </div>
    );

  if (isEmpty)
    return (
      <h5 className="text-primary my-4">
        {t("page.common.hocApiData.emptyData")}
      </h5>
    );

  return <>{children}</>;
}

HocApiData.propTypes = {
  loading: PropTypes.bool,
  error: PropTypes.bool,
  msgError: PropTypes.string,
  isEmpty: PropTypes.bool,
  children: PropTypes.node.isRequired,
  refetch: PropTypes.any,
  loadingLite: PropTypes.bool,
};

export default HocApiData;

function ApiCallLoading({ loadingLite }) {
  const { t } = useTranslation();
  return (
    <>
      {!loadingLite ? (
        <div className="bg-white m-3">
          <div className="d-flex align-items-center flex-column vh-30 justify-content-center text-center py-3">
            <div className="d-flex align-items-center flex-column px-4">
              <BarLoader width={"350"} color={"#556ee6"} loading={true} />
            </div>
            <div className="text-muted font-size-xl text-center pt-3">
              <span className="font-size-lg d-block text-dark">
                {t("page.common.spinner.dataLoading")}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white m-3">
          <div className="d-flex align-items-center flex-column p-3">
            <BarLoader width={"350"} color={"#556ee6"} loading={true} />
          </div>
          <div className="text-muted font-size-xl text-center pt-2">
            <span className="font-size-lg d-block text-dark">
              {t("page.common.spinner.dataLoading")}
            </span>
          </div>
        </div>
      )}
    </>
  );
}
ApiCallLoading.propTypes = {
  loadingLite: PropTypes.bool,
};
