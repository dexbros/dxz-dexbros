import React from 'react';
import { AiOutlineClose } from "react-icons/ai";
import "./Modal.css";
import ButtonLoader from '../ButtonLoader/ButtonLoader';

const SmallScreenForm = ({ title, body, clickHandler, setIsClose, btnText, postId, setPrevImg, disable, modalGifPrev, isLoading, share }) => {
  // console.log(disable)
  const ref = React.useRef();
  
  const closeModal = () => {
    setIsClose(false);
    if (setPrevImg) {
      setPrevImg('')
    }
  }

  // React.useEffect(() => { }, [])

  return (
    <div className='__modal_overlay'>
      <div className='sm_modal'>
        <div className='__modal_header'>{title}
          {/* <span className='modal_header_text'>{title}</span> */}
          {/* <button className="_modal_delete_close_btn">
            <AiOutlineClose className="_modal_close_btn" onClick={closeModal} />
          </button> */}
        </div>
        {/* Modal Body */}
        <div className='sm_group_modal_body'>
          {body}
        </div>
        {/* Modal Footer */}
        {/* <div className='modal_footer'>Footer</div> */}
      </div>
    </div>
  )
};

export default SmallScreenForm