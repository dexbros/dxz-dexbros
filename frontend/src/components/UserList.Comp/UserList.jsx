/** @format */

import React from "react";
import { connect } from "react-redux";
import {
  newPosts,
  updatePost,
  putPostsLast,
} from "../../redux/post/post.actions";
import { Link } from "react-router-dom";
import UserAvatar from "../../Assets/userAvatar.webp";
import { FiUserPlus, FiUserCheck } from "react-icons/fi";
import { useSocket, socket, isSocketConnected } from "../../socket/socket";

const UserList = ({ userData, token, user, following }) => {
  useSocket();
  // Follow follower
  const handleFollow = (userId) => {
    if (following.includes(userId)) {
      removeFollower(userId);
      setFollowersCount((prev) => prev - 1);
    } else {
      addFollower(userId);
      setFollowersCount((prev) => prev + 1);
    }
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    var requestOptions = {
      method: "PUT",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      `${process.env.REACT_APP_URL_LINK}api/users/follow-following/${userId}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        if (result.notificationData) {
          socket.emit("notification receive", result);
        } else {
          console.log(result);
        }
      })
      .catch((error) => {
        console.log("error", error);
        removeFollower(userId);
        setFollowersCount((prev) => prev - 1);
      });
  };
  return (
    <div className='suggested_user_list_box'>
      <div className='suggested_user_info_section'>
        <img src={userData.p_i || UserAvatar} className='suggest_user_avatar' />
        <p className='suggestedprofile_link_name'>
          {userData.fn} {userData.fn}
        </p>
      </div>
      <button
        className='suggested_flw_btn'
        onClick={() => handleFollow(profile.handleUn)}></button>
    </div>
  );
};

const mapStateToProps = (state) => ({
  user: state.user.user,
  token: state.user.token,
  posts: state.post.posts,
  pinnedPost: state.post.pinnedPost,
  following: state.user.following,
});

const mapDispatchToProps = (dispatch) => ({
  newPosts: (posts) => dispatch(newPosts(posts)),
  putPostsLast: (posts) => dispatch(putPostsLast(posts)),
  updatePost: (post) => dispatch(updatePost(post)),
  setPageType: (type) => dispatch(setPageType(type)),
  login: (user, token) => dispatch(userLogin(user, token)),
});

export default connect(mapStateToProps, mapDispatchToProps)(UserList);
