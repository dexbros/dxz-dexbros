import React from 'react';
import { useParams, Link, Outlet, NavLink } from "react-router-dom";
import { connect } from "react-redux";
import { setPageType } from "../../redux/page/page.actions";
import { userLogin } from "../../redux/user/user.actions";
import { newPosts, setNewPinnedPost } from "../../redux/post/post.actions";
import MainLayout from "../../layouts/main-layout.component";
import { useSocket, socket } from "../../socket/socket";
import "./User.css";
import UserAvatar from "../../Assets/userAvatar.webp";

const UserCard = ({
  userData,
  user,
  token,
  login,
  posts,
  newPosts,
  pinnedPost,
  setPinnedPost,
  setPageType
}) => {
  return (
    <div className='user_list_card'>
      <div className='user_card_userInfo'>
        <img src={userData.profilePic ? userData.profilePic : UserAvatar} className="card_user_img" />
        {/* Name */}
        <Link to={`/user/profile/${userData.handleUn}`} className="card_user_name">
          {
            userData.d_fn ? <>{userData.d_fn}</> : <>{ userData.fn}</>
          } {" "}
          {
            userData.d_ln ? <>{userData.d_ln}</> : <>{ userData.ln}</>
          }
        </Link>

        {/* Username */}
        <span className='card_user_username'>@{userData.handleUn}</span>
      </div>
      {/* <div className='buttons'>
        <button className='follow_followed_btn'>
          {
            userData.flwr.includes(user.handleUn) ? <>Followed</> : <>Follow</>
          }
        </button>
      </div> */}
    </div>
  )
}

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

export default connect(mapStateToProps, mapDispatchToProps)(UserCard);