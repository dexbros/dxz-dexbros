import React from 'react';
import { AiOutlineClose } from "react-icons/ai";
import "./CommentModal.css";
import ButtonLoader from '../ButtonLoader/ButtonLoader';

const CommentModal = ({ title, setIsClose, footer, body, closeModal }) => {
  // console.log(commentData)

  return (
    <div className='comment_modal_overlay'>
      <div className='comment_modal'>
        <div className='comment_modal_header'>
          <span className='modal_header_text'>{title}</span>
          <button className="_modal_delete_close_btn">
            <AiOutlineClose className="_modal_close_btn" onClick={closeModal} />
          </button>
        </div>
        {/* Modal Body */}

        <div className='group_comments_modal_body'>
          {body}
        </div>

        {/* Modal Footer */}
        <div className='group_comment_modal_footer'>
          {footer}
          {/* <GroupPostCommentForm /> */}
        </div>
      </div>
    </div>
  )
};


export default CommentModal