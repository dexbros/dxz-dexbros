/** @format */

import React from "react";

const EventSkeletonLoading = () => {
  return (
    <div>
      <div className='skeleton_event_section'>
        {/* Header */}
        <div className='event_loading_header'>
          <div className='skeleton_header_box'>
            <div className='skeleton_event_image skeleton_color'></div>
            <div className='skeleton_nameloader skeleton_color'></div>
          </div>
        </div>

        {/* Body */}
        <div className='skeleton_event_body'>
          <div className='skeleton_event_inner_body skeleton_color'></div>
        </div>
      </div>

      <div className='skeleton_event_section'>
        {/* Header */}
        <div className='event_loading_header'>
          <div className='skeleton_header_box'>
            <div className='skeleton_event_image skeleton_color'></div>
            <div className='skeleton_nameloader skeleton_color'></div>
          </div>
        </div>

        {/* Body */}
        <div className='skeleton_event_body'>
          <div className='skeleton_event_inner_body skeleton_color'></div>
        </div>
      </div>
    </div>
  );
};

export default EventSkeletonLoading;
