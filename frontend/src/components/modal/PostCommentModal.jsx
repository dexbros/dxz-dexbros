import React from 'react';
import { AiOutlineClose } from "react-icons/ai";

const PostCommentModal = ({title, body, footer, onClose}) => {
  return (
    <div className='modal_overlay'>
      <div className='modal_section'>
        {/* Modal title section */}
        <div className='modal_title_section'>
          <span className='modal_title_text'>{title}</span>
          <button className="__modal_close_button" onClick={onClose}><AiOutlineClose /></button>
        </div>

        {/* Modal Body section */}
        <div className='modal_body_section'>{body}</div>

        {/* Modal Footer section */}
        <div className='modal_footer_section'>{footer}</div>
      </div>
    </div>
  )
}

export default PostCommentModal