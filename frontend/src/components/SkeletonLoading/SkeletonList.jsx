import React from 'react'
import MainLayoutComponent from '../../layouts/main-layout.component';
import "./Skeleton.css"
const SkeletonList = () => {
  return (
    <div className='skeleton_profile_container'>
      <div className='skeleton_post_one skeleton_color'></div>
      <div className='skeleton_post_one skeleton_color'></div>
      <div className='skeleton_post_one skeleton_color'></div>
      <div className='skeleton_post_one skeleton_color'></div>
      <div className='skeleton_post_one skeleton_color'></div>
      <div className='skeleton_post_one skeleton_color'></div>
      <div className='skeleton_post_one skeleton_color'></div>
      <div className='skeleton_post_one skeleton_color'></div>
      <div className='skeleton_post_one skeleton_color'></div>
      <div className='skeleton_post_one skeleton_color'></div>
    </div>
  )
};

export default SkeletonList