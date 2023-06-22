/** @format */

import React from "react";
import ReactDOM from "react-dom";
import { AiOutlineClose } from "react-icons/ai";

const CustomPostFormModal = ({ onClose, title, body, footer }) => {
  return ReactDOM.createPortal(
    <div className='custom_modal_container'>
      <div className='custom_modal_overlay'></div>
      <div className='small_screen_custom_custom_modal'>
        <div className='modal_title'>{title}</div>
        <div className='custom_modal_body'>{body}</div>
        <div className='custom_modal_footer'>{footer}</div>
      </div>
    </div>,
    document.getElementById("modal-hook")
  );
};

export default CustomPostFormModal;
