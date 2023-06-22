import React from 'react';
import { BiArrowBack } from "react-icons/bi";
import { useNavigate } from 'react-router';

const ProfileHeader = ({ title }) => {
  const navigate = useNavigate();

  const backBtn = () => {
    navigate(-1)
  }
  return (
    <div className='custom_header_container'>
      <button className='custom_header_back_button' onClick={backBtn}>
        <BiArrowBack />
      </button>
      <span className='custom_header_title'>{title}</span>
    </div>
  )
}

export default ProfileHeader