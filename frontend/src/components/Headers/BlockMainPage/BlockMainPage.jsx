import React from 'react';
import { connect } from 'react-redux';
import { BiArrowBack } from "react-icons/bi";
import { useNavigate } from 'react-router';

const BlockMainPage = ({ title }) => {
  const navigate = useNavigate();

  const backBtn = () => {
    navigate(-1)
  }

  return (
    <div className='blockcast_header_section'>
      <div className='header_box'>
        <button className='back_button' onClick={() => backBtn()}>
          <BiArrowBack />
        </button>
        <span className='header_title'>{title}</span>
      </div>
    </div>
  )
};

export default BlockMainPage