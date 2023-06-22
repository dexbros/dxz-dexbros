import React from 'react';
import { BiArrowBack } from "react-icons/bi";
import { useNavigate } from 'react-router';

const PostAnalytics = ({ title }) => {
  const navigate = useNavigate();

  const backBtn = () => {
    navigate(-1)
  }
  return (
    <div className='trending_header'>
      <button className='header_back_btn' onClick={backBtn}>
        <BiArrowBack />
      </button>
      <span className='header_title'>{title}</span>
    </div>
  )
}

export default PostAnalytics