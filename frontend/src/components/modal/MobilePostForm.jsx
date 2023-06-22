import React from 'react';
import { AiOutlineClose } from "react-icons/ai";

const ModalPost = ({ onClose, title, body, footer }) => {
  const closeModal = () => {
    onClose(false);
  }
  return (
    <div className='__modal_overlay'>
      <div className='__post_modal'>
        <div className='__modal_header'>
          <div className='modal_post_title'>{title}</div>
        </div>
        {/* Modal Body */}
        <div className='__post_modal_body'>
          {body}
        </div>
        {/* Modal Footer */}
          {/* <div className='__post_modal_footer'>
            {footer}
          </div> */}
      </div>
    </div>
  )
}

export default ModalPost;