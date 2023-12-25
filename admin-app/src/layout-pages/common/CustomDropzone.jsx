import React, { useMemo, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Alert } from "reactstrap";
import { ClipLoader } from "react-spinners";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";

function Thumb(props) {
  const [thumb, setThumb] = useState(null);
  const [loading, setLoading] = useState(false);
  const { file } = props;

  useEffect(() => {
    if (file) {
      setLoading(true);

      let reader = new FileReader();

      reader.onloadend = () => {
        setThumb(reader.result);
        setLoading(false);
      };

      reader.readAsDataURL(file);
    }
  }, [file]);

  if (!file) {
    return null;
  }

  if (loading) {
    return (
      <div className="d-flex align-items-center flex-column p-3">
        <ClipLoader color={"#3c44b1"} loading={true} size={13} />
      </div>
    );
  }

  return (
    <img
      src={thumb}
      alt={file.name}
      className="mt-1"
      style={{
        border: "1px solid #ddd",
        borderRadius: "4px",
        padding: "5px",
        color: "#615dfa",
        backgroundColor: "#ffffff",
      }}
      height={props?.thumbSize || 180}
      width={props?.thumbSize || 180}
    />
  );
}

Thumb.propTypes = {
  file: PropTypes.any,
  thumbSize: PropTypes.any,
};

function InvalidFileAlert({ content, t }) {
  return (
    <div className="m-3">
      <Alert color="danger">
        <h4 className="alert-heading">
          {t("page.common.customDropzone.fileFormat")}{" "}
        </h4>
        <ul>{content}</ul>
      </Alert>
    </div>
  );
}

InvalidFileAlert.propTypes = {
  content: PropTypes.string,
  t: PropTypes.any,
};

function CustomDropzone(props) {
  const baseStyle = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
    borderWidth: 2,
    borderRadius: 2,
    borderColor: "#eeeeee",
    borderStyle: "dashed",
    backgroundColor: "#eff4fb",
    color: "#bdbdbd",
    outline: "none",
    transition: "border .24s ease-in-out",
  };

  const activeStyle = {
    borderColor: "#2196f3",
  };

  const acceptStyle = {
    borderColor: "#00e676",
  };

  const rejectStyle = {
    borderColor: "#ff1744",
  };

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
    acceptedFiles,
    fileRejections,
  } = useDropzone({
    accept: props.accept || "image/*",
    multiple: props.multiple || false,
    maxSize: props?.maxSize || 2000000,
    maxFiles: props?.maxFiles || 5,
    onDrop: acceptedFiles => {
      // on drop we add to the existing files
      // values.files.concat(acceptedFiles)
      if (props.multiple) {
        if (acceptedFiles.length !== 0) {
          props.setFieldValue(props.valueName, acceptedFiles);
        } else {
          props.setFieldValue(props.valueName, "");
        }
      } else {
        if (acceptedFiles.length !== 0) {
          props.setFieldValue(props.valueName, acceptedFiles[0]);
        } else {
          props.setFieldValue(props.valueName, "");
        }
      }
    },
  });

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isDragActive ? activeStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isDragActive, isDragReject, isDragAccept]
  );

  const acceptedFileItems = useMemo(() => {
    if (isDragReject) {
      return props.t("page.common.customDropzone.fileFormat");
    }

    if (acceptedFiles.length === 0) {
      return <p>{props?.placeholder}</p>;
    }

    return acceptedFiles.map((file, i) => (
      <Thumb key={i} file={file} thumbSize={props?.thumbSize} />
    ));
  }, [isDragActive, isDragReject, isDragAccept, acceptedFiles]);

  const fileRejectionItems = useMemo(() => {
    return fileRejections.map(({ file, errors }) => (
      <li key={file.path}>
        {/* todo add it in traduction ! */}
        {`${file.path} - ${file.size} bytes ( ${errors
          .map(e => e.message)
          .join(" , ")} )`}
      </li>
    ));
  }, [fileRejections]);

  return (
    <>
      <div>
        <div className="container" {...getRootProps({ style })}>
          <input {...getInputProps()} />
          <div className="dz-message needsclick py-0 pb-2">
            <div className="mb-2">
              <i className="display-4 text-muted bx bxs-cloud-upload" />
            </div>
            <h6> {props.t("page.common.customDropzone.dragFiles")} </h6>
          </div>
          <div>{acceptedFileItems}</div>
        </div>
      </div>

      {fileRejections.length !== 0 && (
        <div className="m-3">
          <InvalidFileAlert content={fileRejectionItems} t={props.t} />
        </div>
      )}
    </>
  );
}

CustomDropzone.propTypes = {
  thumbSize: PropTypes.any,
  placeholder: PropTypes.string,
  accept: PropTypes.any,
  multiple: PropTypes.bool,
  maxSize: PropTypes.any,
  maxFiles: PropTypes.number,
  setFieldValue: PropTypes.any,
  valueName: PropTypes.any,
  t: PropTypes.any,
};

export default withTranslation()(CustomDropzone);
