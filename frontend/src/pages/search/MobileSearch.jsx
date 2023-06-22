import React from 'react';
import MainLayout from "../../layouts/main-layout.component";
import { useNavigate } from 'react-router';
import {BiArrowBack} from "react-icons/bi"

const MobileSearch = () => {
  const navigate = useNavigate();

  const backPage = () => {
    navigate(-1)
  }
  return (
    <div className='mobile_search_page'>
      {/* Search Header */}

      <div className='search_header_container'>
        <button className='search_back_btn' onClick={backPage}><BiArrowBack /></button>
        <input type="search" placeholder='Search' />
      </div>
    </div>
  )
}

export default MobileSearch