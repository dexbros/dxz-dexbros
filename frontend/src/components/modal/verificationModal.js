import React from 'react';
import { AiOutlineClose } from "react-icons/ai";

const VerificationModal = ({ onClose, title, body, footer, style, modal_close_btn }) => {
  const closeModal = () => {
    onClose(false);
  }
  return (
    <div className='__modal_overlay'>
      <div className={style}>
        <div className='__modal_header'>
          <div className='modal_header_text'>{title}</div>
          <button className="_modal_delete_close_btn">
            <AiOutlineClose className={modal_close_btn} onClick={closeModal} />
          </button>
        </div>
        {/* Modal Body */}
        <div className='__group_modal_body'>
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

export default VerificationModal