import React from 'react';
import { AiOutlineClose } from "react-icons/ai";

const Burners = ({setIsFlip, user, token}) => {
  return (
    <div className='bage_section'>
      {/* Header */}
      <div className='bage_page_header'>
        <span className='badge_page_header_title'>Burners</span>
        <button className="badge_page_close_btn" onClick={() => setIsFlip("")}>
          <AiOutlineClose />
        </button>
      </div>
    </div>
  )
}

export default Burners