/** @format */

import React from "react";
import intToString from "../../../utils/PostCount";

const ImpressionCount = () => {
  return (
    <div className='text_analytics_container'>
      <div className='nalytics_count_header'>
        <span className='analytics_header_text'>Impression</span>
        <br />
        <span className='analytics_sub_header'>
          This is post impression analytics
        </span>
      </div>
      <div className='analytics_count'>{intToString(0)}</div>
    </div>
  );
};
export default ImpressionCount;
