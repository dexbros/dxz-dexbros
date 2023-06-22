import React from 'react'
import ReactDOM from "react-dom";
import { AiOutlineClose } from "react-icons/ai";

const CustomProfileModal = ({ title, body, footer}) => {
  return ReactDOM.createPortal(
    <div className='custom_modal_container'>
      <div className='custom_modal_overlay'></div>
      <div className='custom_modal'>
        <div className='custom_modal_title'>
          <span className="modal_title_text">{title}</span>
        </div>
        <div className='custom_modal_body'>{body}</div>
        <div className='custom_modal_footer'>{footer}</div>
      </div>
    </div>,
    document.getElementById("modal-hook")
  )
}

export default CustomProfileModal