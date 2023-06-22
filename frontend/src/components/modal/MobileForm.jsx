import React from 'react';
import { AiOutlineClose } from "react-icons/ai";

const ModalComp = ({ onClose, title, body, footer }) => {
  const closeModal = () => {
    onClose(false);
  }
  return (
    <div className='__modal_overlay'>
      <div className='sm_modal'>
        <div className='__modal_header'>
          <span className='modal_header_text'>{title}</span>
          <button className="_modal_delete_close_btn">
            <AiOutlineClose className="_modal_close_btn" onClick={closeModal} />
          </button>
        </div>
        {/* Modal Body */}
        <div className='__mobile_modal_body'>
          {body}
        </div>
        {/* Modal Footer */}
          <div className='__group_modal_footer'>
            {footer}
          </div>
      </div>
    </div>
  )
}

export default ModalComp;


