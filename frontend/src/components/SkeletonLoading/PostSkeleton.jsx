/** @format */

import React from "react";

const PostSkeleton = () => {
  return (
    <div className='skeleton_post_container'>
      <div className='skeleton_post_card'>
        {/* Header */}
        <div className='skeleton_post_header'>
          {/* image */}
          <div className='skeleton_post_image skeleton_color'></div>
          <div className='skeleton_post_user_info'>
            <div className='skeleton_post_name skeleton_color'></div>
            <div className='skeleton_post_username skeleton_color'></div>
          </div>
        </div>

        {/* Body */}
        <div className='skeleton_post_body skeleton_color'></div>

        {/* Footer */}
        <div className='skeleton_post_footer'>
          <div className='skeleton_footer_post_btn skeleton_color'></div>
          <div className='skeleton_footer_post_btn skeleton_color'></div>
          <div className='skeleton_footer_post_btn skeleton_color'></div>
          <div className='skeleton_footer_post_btn skeleton_color'></div>
        </div>
      </div>

      <div className='skeleton_post_card'>
        {/* Header */}
        <div className='skeleton_post_header'>
          {/* image */}
          <div className='skeleton_post_image skeleton_color'></div>
          <div className='skeleton_post_user_info'>
            <div className='skeleton_post_name skeleton_color'></div>
            <div className='skeleton_post_username skeleton_color'></div>
          </div>
        </div>

        {/* Body */}
        <div className='skeleton_post_body skeleton_color'></div>

        {/* Footer */}
        <div className='skeleton_post_footer'>
          <div className='skeleton_footer_post_btn skeleton_color'></div>
          <div className='skeleton_footer_post_btn skeleton_color'></div>
          <div className='skeleton_footer_post_btn skeleton_color'></div>
          <div className='skeleton_footer_post_btn skeleton_color'></div>
        </div>
      </div>

      <div className='skeleton_post_card'>
        {/* Header */}
        <div className='skeleton_post_header'>
          {/* image */}
          <div className='skeleton_post_image skeleton_color'></div>
          <div className='skeleton_post_user_info'>
            <div className='skeleton_post_name skeleton_color'></div>
            <div className='skeleton_post_username skeleton_color'></div>
          </div>
        </div>

        {/* Body */}
        <div className='skeleton_post_body skeleton_color'></div>

        {/* Footer */}
        <div className='skeleton_post_footer'>
          <div className='skeleton_footer_post_btn skeleton_color'></div>
          <div className='skeleton_footer_post_btn skeleton_color'></div>
          <div className='skeleton_footer_post_btn skeleton_color'></div>
          <div className='skeleton_footer_post_btn skeleton_color'></div>
        </div>
      </div>
    </div>
  );
};

export default PostSkeleton;
