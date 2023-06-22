/** @format */

import React from "react";
import intToString from "../../../utils/PostCount";

const ShareCount = () => {
  return (
    <div className='text_analytics_container'>
      <div className='nalytics_count_header'>
        <span className='analytics_header_text'>Shares</span>
        <br />
        <span className='analytics_sub_header'>
          This is post share analytics
        </span>
      </div>
      <div className='analytics_count'>{intToString(0)}</div>
    </div>
  );
};
export default ShareCount;
