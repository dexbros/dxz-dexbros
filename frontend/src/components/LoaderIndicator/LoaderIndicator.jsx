import React from 'react'
import { ReactComponent as CompleteIcon } from "../../Assets/Icons/complete2.svg";

const LoaderIndicator = ({ remaining, complete }) => {
  return (
    <React.Fragment>
      {
        Math.round(complete) !== 100 ?
          <div className="icon_out_box"
            style={{ "background": `linear-gradient(to top, #e7e8ea ${remaining}%, #20bf6b ${complete}%)` }}
          >
            <div className="icon_mid_box">
              <span className='complete_count'>{Math.round(complete)}%</span>
            </div>
          </div> :
          <div>
            <CompleteIcon className='complete_loader_icons' />
          </div>
      }
    </React.Fragment>
  )
};

export default LoaderIndicator;