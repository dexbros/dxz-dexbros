/** @format */

import React from "react";
import "./Skeleton.css";

const FullPostLoader = () => {
  return (
    <div className='full_post_loader_conteiner'>
      <div className='skeleton_post skeleton_color'></div>

      <div className='skeleton_post_comment skeleton_color'></div>
      <div className='skeleton_post_comment skeleton_color'></div>
      <div className='skeleton_post_comment skeleton_color'></div>
      <div className='skeleton_post_comment skeleton_color'></div>
    </div>
  );
};

export default FullPostLoader;
