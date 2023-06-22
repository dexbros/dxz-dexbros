import React from 'react';
import { CgSpinner } from "react-icons/cg";
import "./ButtonLoader.css";

const ButtonLoader = () => {
  return (
    <div className='btn_icons_loader'>
      <CgSpinner className='loader_icon' />
    </div>
  )
}

export default ButtonLoader