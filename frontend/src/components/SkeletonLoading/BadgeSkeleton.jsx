import React from 'react';
import "./Skeleton.css"

const BadgeSkeleton = () => {
  return (
    <div className='badge_secleton_container'>
      <div className='skeleton_header_box'>
        <div className='badge_skeleton_header skeleton_color'></div>
        <div className='badge_skeleton_box skeleton_color'></div>
        <div className='badge_skeleton_box skeleton_color'></div>
        <div className='badge_skeleton_box skeleton_color'></div>
      </div>

      <div className='skeleton_header_box'>
        <div className='badge_skeleton_header skeleton_color'></div>
        <div className='badge_skeleton_box skeleton_color'></div>
        <div className='badge_skeleton_box skeleton_color'></div>
        <div className='badge_skeleton_box skeleton_color'></div>
      </div>

      <div className='badge_skeleton_footer skeleton_color'></div>
      <div className='badge_skeleton_footer skeleton_color'></div>
    </div>
  )
};

export default BadgeSkeleton;

// skeleton_color