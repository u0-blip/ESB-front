import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const Modal = props => {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const html = document.querySelector('html') || document.documentElement;
    if (!html) {
      setShowModal(props.showModal);
      return;
    }
    if (props.showModal) {
      html.classList.add('is-clipped');
    } else {
      html.classList.remove('is-clipped');
    }
    setShowModal(props.showModal);
  }, [props.showModal]);

  return (
    <div
      className={`ModalComponent modal${showModal ? ' is-active' : ''}`}
    >
      <div onClick={props.handleClose} className="modal-background"></div>
      <div className="modal-content has-background-white">
        {showModal ? props.render() : ''}
      </div>
      <button
        onClick={props.handleClose}
        className="modal-close is-large"
        aria-label="close"
      ></button>
    </div>
  );
};

Modal.propTypes = {
  handleClose: PropTypes.func,
  showModal: PropTypes.bool
};

export default Modal;
