import React from "react";
import PropTypes from "prop-types";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { useTranslation } from "react-i18next";

const CustomModal = props => {
  const { t } = useTranslation();
  const {
    isOpen,
    toggle,
    title,
    content,
    fullscreen = false,
    size = "md",
    closeText = t("page.common.customModal.closeBtn"),
    closeBtnColor = "danger",
    showFooter = true,
  } = props;
  return (
    <Modal
      isOpen={isOpen}
      role="dialog"
      autoFocus={true}
      centered={true}
      className={fullscreen ? "modal-fullscreen" : "customModal"}
      tabIndex="-1"
      toggle={toggle}
      size={size}
    >
      <div className="modal-content">
        <ModalHeader toggle={toggle}>{title}</ModalHeader>
        <ModalBody>{content}</ModalBody>
        {showFooter && (
          <ModalFooter>
            <Button type="button" color={closeBtnColor} onClick={toggle}>
              {closeText}
            </Button>
          </ModalFooter>
        )}
      </div>
    </Modal>
  );
};

CustomModal.propTypes = {
  toggle: PropTypes.func,
  isOpen: PropTypes.bool,
  fullscreen: PropTypes.bool,
  title: PropTypes.string,
  size: PropTypes.string,
  content: PropTypes.object,
  closeText: PropTypes.string,
  showFooter: PropTypes.bool,
  closeBtnColor: PropTypes.string,
};

export default CustomModal;
