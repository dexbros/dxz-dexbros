import React from 'react'
import ReactDOM from "react-dom";
import { AiOutlineClose } from "react-icons/ai";

const CustomSmallModal = ({ onClose, title, body, footer}) => {
  return ReactDOM.createPortal(
    <div className='custom_modal_container nestedModal'>
      <div className='custom_modal_overlay'></div>
      <div className='custom_modal custom_comment_modal'>
        <div className='custom_modal_title'>
          <span className="modal_title_text">{title}</span>
          <button className="close_modal_button" onClick={onClose}><AiOutlineClose /></button>
        </div>
        <div className='custom_modal_body'>{body}</div>
        <div className='custom_modal_footer'>{footer}</div>
      </div>
    </div>,
    document.getElementById("comment-modal-hook")
  )
}

export default CustomSmallModal