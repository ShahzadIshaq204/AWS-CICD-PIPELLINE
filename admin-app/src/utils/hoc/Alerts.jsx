import React from "react";
import { toast } from "react-toastify";

export const showAlertMsg = (type, text) => {
  const msg = () => (
    <div className={`d-flex align-items-center align-content-start`}>
      <span className="text-justify">{text}</span>
    </div>
  );

  if (type === "info") {
    toast.info(msg("Info"), {
      containerId: "B",
    });
  } else if (type === "warning") {
    toast.warning(msg("Attention"), {
      containerId: "B",
    });
  } else if (type === "danger") {
    toast.error(msg("Erreur"), {
      containerId: "B",
    });
  } else if (type === "success") {
    toast.success(msg("Success"), {
      containerId: "B",
    });
  }
};
