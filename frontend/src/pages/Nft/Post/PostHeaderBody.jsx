import React from 'react';
import UserAvatar from "../../../Assets/userAvatar.webp";

const PostHeaderBody = ({post}) => {
  return (
    <React.Fragment>
      <div className='full_post_header' id="print">
        <div className='full_post_user_info'>
          <img
            id="visit"
            src={post.u_img ? post.u_img : UserAvatar} className="user_avatar_profile"
          />
          <span id="visit" className='posted_user_name'>
            {post.u_fn} {" "} {post.u_ln}
          </span>
          <span className='posted_user_username'>@{post.u_dun}</span>
        </div>
      </div>

      <div className='full_post_body' id="print">
              <span className='main_body_text' id="post_body">
                {
                  post.content.split(" ").map((val, index) => (
                    <span id="post_body" key={index} className={val.includes('#') ? "trend_tag" : ""}>{val}{" "}</span>
                  ))
                }
              </span><br />
              {
                post.image &&
                <img src={post.image} className="post_card__body_image" id="post_body" />
              }
              {
                post.gif &&
                <img src={post.gif} className="post_card__body_image" id="post_body" />
              }
      </div>
    </React.Fragment>
  )
};

export default PostHeaderBody