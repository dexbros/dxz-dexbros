import React from 'react';
import "./Modal.css";

const ProfileModal = ({ body, footer, className, title }) => {

  return (
    <div className='__modal_overlay'>
      <div className='__modal profile_modal'>
        {/* Modal header */}
        <div className={"header_modal"}>
          <div className={className}></div>
          <div className='modal_title_text'>{title}</div>
        </div>

        {/* Modal Body */}
        <div className='__group_modal_body'>
          {body}
        </div>
        {/* Modal Footer */}
        {/* <div className='__group_modal_footer'>
          {footer}
        </div> */}
      </div>
    </div>
  )
};

export default ProfileModal