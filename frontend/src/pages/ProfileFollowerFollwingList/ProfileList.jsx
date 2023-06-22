/** @format */

import * as React from "react";
import {
  useParams,
  Link,
  Outlet,
  NavLink,
  useLocation,
} from "react-router-dom";
import { connect } from "react-redux";
import { setPageType } from "../../redux/page/page.actions";
import { userLogin } from "../../redux/user/user.actions";
import { newPosts, setNewPinnedPost } from "../../redux/post/post.actions";
import MainLayout from "../../layouts/main-layout.component";
import { useSocket, socket } from "../../socket/socket";
import "./ProfileList.css";

const ProfileList = ({
  user,
  token,
  login,
  posts,
  newPosts,
  pinnedPost,
  setPinnedPost,
  setPageType,
}) => {
  const { handleUn } = useParams();

  React.useLayoutEffect(() => {
    setPageType("profile_follwers");
  }, []);

  return (
    <MainLayout title='Follower-Following'>
      <div>
        <div className='follower_following_container'>
          <li className='link_item '>
            <NavLink
              to={`/user/profile/follower-following/${handleUn}`}
              className={(navData) =>
                !window.location.href.includes("followinglist")
                  ? "link_text active_link_following"
                  : "link_text"
              }>
              Followers
            </NavLink>
          </li>

          <li className='link_item'>
            <NavLink
              to={`/user/profile/follower-following/${handleUn}/followinglist`}
              className={(navData) =>
                window.location.href.includes("followinglist")
                  ? "link_text active_link_following"
                  : "link_text"
              }>
              Following
            </NavLink>
          </li>
        </div>
        <Outlet />
      </div>
    </MainLayout>
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

export default connect(mapStateToProps, mapDispatchToProps)(ProfileList);
