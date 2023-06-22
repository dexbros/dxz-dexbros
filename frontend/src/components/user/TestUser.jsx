/** @format */

import React from "react";
import { useParams, Link, Outlet, useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import UserAvatar from "../../Assets/userAvatar.webp";
import { BiUserPlus, BiUserCheck } from "react-icons/bi";

const TestUser = ({
  userData,
  user,
  token,
  login,
  posts,
  newPosts,
  pinnedPost,
  setPinnedPost,
  setPageType,
  profileData,
}) => {
  const navigate = useNavigate();
  const [isFollowed, setIsFollowed] = React.useState(
    profileData.flw.includes(userData.handleUn)
  );

  return (
    <div className='user_list_card'>
      <div
        className='user_card_user_section'
        onClick={() =>
          navigate(`/user/profile/${userData.record.bins.handleUn}`)
        }>
        <img
          src={userData.record.bins.p_i || UserAvatar}
          alt=''
          srcset=''
          className='user_card_avatar'
        />
        <span className='modal_user_name'>
          {userData.record.bins.fn} {userData.record.bins.ln}
        </span>
        <span className='modal_user_username'>
          @{userData.record.bins.handleUn}
        </span>
      </div>
      {user.handleUn !== userData.record.bins.handleUn && (
        <button className='user_card_button'>
          {!isFollowed ? <BiUserPlus /> : <BiUserCheck />}
        </button>
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  user: state.user.user,
  token: state.user.token,
  posts: state.post.posts,
  pinnedPost: state.post.pinnedPost,
});

const mapDispatchToProps = (dispatch) => ({
  login: (user, token) => dispatch(userLogin(user, token)),
  newPosts: (posts) => dispatch(newPosts(posts)),
  setPinnedPost: (post) => dispatch(setNewPinnedPost(post)),
  setPageType: (pageType) => dispatch(setPageType(pageType)),
});

export default connect(mapStateToProps, null)(TestUser);
