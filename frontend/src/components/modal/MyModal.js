import React from 'react';
import { AiOutlineClose } from "react-icons/ai";
import "./Modal.css";
import ButtonLoader from '../ButtonLoader/ButtonLoader';

const PostHideModal = ({ title, body, clickHandler, setIsClose, btnText, postId, setPrevImg, disable, modalGifPrev, isLoading, share }) => {
  // console.log(disable)
  const ref = React.useRef();
  
  const closeModal = () => {
    setIsClose(false);
    if (setPrevImg) {
      setPrevImg('')
    }
  }

  React.useEffect(() => { }, [])

  return (
    <div className='__modal_overlay'>
      <div className='__modal'>
        <div className='__modal_header'>
          <span className='modal_header_text'>{title}</span>
          <button className="_modal_delete_close_btn">
            <AiOutlineClose className="_modal_close_btn" onClick={closeModal} />
          </button>
        </div>
        {/* Modal Body */}
        <div className='__group_modal_body'>
          {body}
          {postId}
        </div>
        {/* Modal Footer */}
        {
          !share &&
          <div className='__group_modal_footer'>
            <button className='__group_close' onClick={closeModal}>Close</button>
            <button className={disable ? '__group_pin disable' : '__group_pin'} onClick={() => clickHandler(postId)} disabled={disable}>
              {
                isLoading ?
                  <ButtonLoader /> : <>{btnText}</>
              }
            </button>
          </div>
        }
      </div>
    </div>
  )
};

export default PostHideModal