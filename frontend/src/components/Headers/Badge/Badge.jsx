import * as React from 'react';
import { Link } from "react-router-dom";
import { BiArrowBack } from "react-icons/bi";
import { FiMoreVertical } from "react-icons/fi";
import { Menu, MenuItem, MenuButton, SubMenu } from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";
// import "./Block.css";
import { useNavigate } from 'react-router-dom';


const BadgeHeader = ({ title }) => {
  const navigate = useNavigate()
  const goBack = () => {
    navigate(-1)
   }
  return (
    <div className='block_main_header'>
      <div className='block_header_box'>
        <button className='back_btn' onClick={goBack}><BiArrowBack /></button> 
        <span className='header_title'>{title}</span>
      </div>
    </div>
  )
};

export default BadgeHeader;