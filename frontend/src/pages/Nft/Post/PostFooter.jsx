import React from 'react';
import { AiOutlineHeart, AiOutlineComment, AiOutlineShareAlt } from "react-icons/ai";

const PostFooter = ({ post, isFooterVisible }) => {
  return (
    <React.Fragment>
      <div className={isFooterVisible ? 'nft_full_post_footer' : 'nft_full_post_footer full_post_footer_blur'}>
        <button disabled={true} className="main_post_footer_btn">
          <AiOutlineHeart className="post_like_icon" />{" "}<span className='count_nium'>{post.l_c}</span>
        </button>

        <button disabled={true} className="main_post_footer_btn">
          <AiOutlineComment className='comment_icon' />{" "}<span className='count_nium'>{post.c_c || 0}</span>
        </button>
              
        <button disabled={true} className="main_post_footer_btn">
          <AiOutlineShareAlt className='share_icon' />{" "}<span className='count_nium'>{post.s_c || 0}</span>
        </button>
      </div>
    </React.Fragment>
  )
};

export default PostFooter