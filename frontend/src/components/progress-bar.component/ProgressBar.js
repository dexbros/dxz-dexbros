import React, { useState } from 'react';
import "./ProgressBar.css";
import Tooltip from "../Tooltip/Tooltip"

const ProgressBar = ({ total_vote, vote, title }) => {
  const [width, setWidth] = useState(0)
  var percentage = Math.round((vote / total_vote) * 100);
  return (
    <div className='progressbar' >
        <div style={{ backgroundColor: "#2ed573", borderRadius: "5px", padding: "5px", width: `${percentage}%` }}>
          <Tooltip content={`No of votes: ${vote}`} direction="bottom">
            <span className='progress_bar_title'>{title}</span>
            <span className='progress_bar_percentage'>{`${percentage}%`}</span>
          </Tooltip>
        </div>
    </div>
  )
};

export default ProgressBar