import React from 'react'
import MainLayoutComponent from '../../layouts/main-layout.component';
import "./Skeleton.css"

const SkeletonLoaderProfile = () => {
  return (
    <MainLayoutComponent goBack={true} title={`Profile`}>
      <div className='skeleton_profile_container'>
        <div className='skeleton_profile_image_section'>
          <div className='skeleton_cover_image skeleton_color'>
            <div className='skeleton_profile_image skeleton_color'></div>
          </div>
        </div>

        <div className='skeleton_profile_info_container'>
            <div className='skeleton_text skeleton_color'></div>
            <div className='skeleton_text skeleton_color'></div>
            <div className='skeleton_text skeleton_color'></div>
            <div className='skeleton_text skeleton_color'></div>
            <div className='skeleton_text skeleton_color'></div>
        </div>

        <div className='skeleton_nested_routes'>
          <div className='skeleton_route_one skeleton_color'></div>
          <div className='skeleton_route_one skeleton_color'></div>
        </div>

        <div className='skeleton_profile_posts'>
          <div className='skeleton_post_one skeleton_color'></div>
          <div className='skeleton_post_one skeleton_color'></div>
          <div className='skeleton_post_one skeleton_color'></div>
        </div>
      </div>
    </MainLayoutComponent>
  )
}

export default SkeletonLoaderProfile