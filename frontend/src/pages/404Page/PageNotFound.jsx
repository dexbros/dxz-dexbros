/** @format */

import React from "react";
import { useNavigate } from "react-router-dom";
import "./pageStyle.css";
const PageNotFound = () => {
  const navigate = useNavigate();
  return (
    <div className='page_not_found_container'>
      <div className='not_found_box'>
        <p className='error_header'>404</p>
        <p className='error_sub_text'>Opps! page not found</p>
        <button className='error_button' onClick={() => navigate(-1)}>
          Go back
        </button>
      </div>
    </div>
  );
};

export default PageNotFound;
