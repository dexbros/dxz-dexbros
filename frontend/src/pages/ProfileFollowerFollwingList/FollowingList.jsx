/** @format */

import * as React from "react";
import { useParams, Link, Outlet, NavLink } from "react-router-dom";
import { connect } from "react-redux";
import { setPageType } from "../../redux/page/page.actions";
import { userLogin } from "../../redux/user/user.actions";
import { newPosts, setNewPinnedPost } from "../../redux/post/post.actions";
import MainLayout from "../../layouts/main-layout.component";
import { useSocket, socket } from "../../socket/socket";
import TestUser from "../../components/user/TestUser";
import "./ProfileList.css";
import SkeletonList from "../../components/SkeletonLoading/SkeletonList";

const FollowingList = ({
  user,
  token,
  login,
  posts,
  newPosts,
  pinnedPost,
  setPinnedPost,
  setPageType,
}) => {
  const [users, setUsers] = React.useState([]);
  const [profileData, setProfileData] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const { handleUn } = useParams();

  React.useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  // *** Fetch user's following list
  React.useEffect(() => {
    var axios = require("axios");
    var config = {
      method: "get",
      url: `${process.env.REACT_APP_URL_LINK}api/users/${handleUn}/following-list`,
      headers: {
        Authorization: "Bearer " + token,
      },
    };
    axios(config)
      .then(function (response) {
        console.log(response);
        setUsers(response.data.list);
        setProfileData(response.data.user);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, [handleUn]);
  return (
    <div className='user_followers_container'>
      {isLoading ? (
        <SkeletonList />
      ) : (
        <>
          {(users || []).length > 0 ? (
            <>
              {users.map((data) => (
                <TestUser
                  key={data.handleUn}
                  userData={data}
                  profileData={profileData}
                />
              ))}
            </>
          ) : (
            <div className='empty_user_list'>No user found</div>
          )}
        </>
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

export default connect(mapStateToProps, mapDispatchToProps)(FollowingList);
