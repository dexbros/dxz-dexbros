import React from 'react';
import UserAvatar from "../../../Assets/userAvatar.webp";

const PostComment = ({ comment, isCommentVisible }) => {
  return (
    <React.Fragment>
      <div className={isCommentVisible ? 'nft_main_post_comment_card' : 'nft_main_post_comment_card main_post_comment_card_blur'}>
        <div className='full_post_header'>
          <div className='full_post_user_info'>
            <img
              id="visit"
              src={comment.c_u_img ? comment.c_u_img : UserAvatar} className="user_avatar_profile"
            />
            <span id="visit" className='posted_user_name'>
              {comment.c_fn} {" "} {comment.c_ln}
            </span>
            <span className='posted_user_username'>@{comment.c_u_du}</span>
          </div>
        </div>
        <div className='full_post_body'>
          <span className='main_body_text' id="comment_post_body">
            {comment.comment}
          </span><br />
          {/* {
                post.image &&
                <img src={post.image} className="post_card__body_image" id="post_body" />
              }
              {
                post.gif &&
                <img src={post.gif} className="post_card__body_image" id="post_body" />
              } */}
        </div>
      </div>
    </React.Fragment>
  )
};

export default PostComment