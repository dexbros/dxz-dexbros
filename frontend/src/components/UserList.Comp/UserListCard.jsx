/** @format */

import React from "react";
import { connect } from "react-redux";
import {
  newPosts,
  updatePost,
  putPostsLast,
} from "../../redux/post/post.actions";
import UserAvatar from "../../Assets/userAvatar.webp";
import { FiUserPlus, FiUserCheck } from "react-icons/fi";
import {
  userLogin,
  addFollower,
  removeFollower,
  updateUser,
  addToHideUser,
  removeToHideUser,
} from "../../redux/user/user.actions";
import { useSocket, socket, isSocketConnected } from "../../socket/socket";

const UserListCard = ({
  data,
  token,
  user,
  following,
  addFollower,
  removeFollower,
}) => {
  useSocket();

  const handleFollow = (userId) => {
    if (following.includes(userId)) {
      removeFollower(userId);
      // setFollowersCount((prev) => prev - 1);
    } else {
      addFollower(userId);
      // setFollowersCount((prev) => prev + 1);
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
        // setFollowersCount((prev) => prev - 1);
      });
  };

  return (
    <div className='user_card_list_card'>
      <div className='suggested_user_info'>
        <img src={data.p_i || UserAvatar} className='suggested_user_avatar' />
        <span className='suggested_user_name'>
          {data.fn} {data.ln}
        </span>
      </div>
      <button
        className={
          following.includes(data.handleUn)
            ? "follwed_btn follow_following_btn"
            : "follow_following_btn"
        }
        onClick={() => handleFollow(data.handleUn)}>
        {following.includes(data.handleUn) ? <FiUserCheck /> : <FiUserPlus />}
      </button>
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
  addFollower: (data) => dispatch(addFollower(data)),
  removeFollower: (data) => dispatch(removeFollower(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(UserListCard);
