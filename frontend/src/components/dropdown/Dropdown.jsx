import React from 'react';
import { IoCaretUpSharp } from "react-icons/io5";
import { AiFillCaretDown } from "react-icons/ai";
import "./Dropdown.css"
import { useState } from 'react';

const Dropdown = ({select, setSelect}) => {
  const [show, setShow] = useState(false);
  


  return (
    <div className='custom_dropdown' onClick={() => setShow(prev => !prev)}>
      <div className='custom_dropdown_btn'>Choose One <AiFillCaretDown /></div>

      {/* DropDown items */}
      {
        show &&
        <div className='custom_dropdown_content'>
          <div className='cuastom_dropdown_item' value={'English'} onClick={(e) => setSelect(e.target.textContent)}>English</div>
          <div className='cuastom_dropdown_item' value="Bengali" onClick={(e) => setSelect(e.target.textContent)}>Bengali</div>
        </div>
      }
    </div>
  )
};

export default Dropdown