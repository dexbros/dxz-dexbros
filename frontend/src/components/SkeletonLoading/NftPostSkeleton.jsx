/** @format */

import React from "react";

const NftPostSkeleton = () => {
  return (
    <div className='nft_skeleton_container'>
      {/* Header */}

      <div className='nft_skeleton_header'>
        <div className='nft_post_user_pic_skeleton skeleton_color'></div>
        <div className='nft_post_user_name_skeleton skeleton_color'></div>
        <div className='nft_post_user_username_skeleton skeleton_color'></div>
      </div>

      {/* Body */}
      <div className='nft_post_body_skeleton'>
        <div className='nft_post_body_skeleton_line skeleton_color'></div>
        <div className='nft_post_body_skeleton_line skeleton_color'></div>
        <div className='nft_post_body_skeleton_line skeleton_color'></div>
      </div>

      {/* Footer */}
      <div className='nft_post_footer_sekeleton'>
        <div className='skeleton_footer_button skeleton_color'></div>
        <div className='skeleton_footer_button skeleton_color'></div>
        <div className='skeleton_footer_button skeleton_color'></div>
        <div className='skeleton_footer_button skeleton_color'></div>
      </div>
    </div>
  );
};

export default NftPostSkeleton;

// skeleton_color
