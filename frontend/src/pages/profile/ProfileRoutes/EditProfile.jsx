/** @format */

import React from "react";
import Layout from "../../../layouts/main-layout.component";
import { useParams } from "react-router-dom";
import { connect } from "react-redux";
import { setPageType, setScrollAxis } from "../../../redux/page/page.actions";
import { userLogin, updateUser } from "../../../redux/user/user.actions";
import { newPosts, setNewPinnedPost } from "../../../redux/post/post.actions";
import { useTranslation } from "react-i18next";
import axios from "axios";
import PersonalEdit from "./PersonalEdit";
import ProfileEditSkeleton from "../../../components/SkeletonLoading/ProfileEditSkeleton";
const hobyLists = ["Cricket", "Football", "Crypto", "Photography", "Treading"];

const EditProfile = ({
  user,
  token,
  update,
  setUpdatedUser,
  setPageType,
  setScrollAxis,
  axisValue,
}) => {
  const { handleUn } = useParams();
  const { t } = useTranslation(["common"]);
  const [profile, setProfile] = React.useState(null);
  const [selctTab, setSelectTab] = React.useState("personal");

  const handleScroll = (event) => {
    // console.log('scrollTop: ', event.currentTarget.scrollTop);
    // console.log('offsetHeight: ', event.currentTarget.offsetHeight);
    setScrollAxis(event.currentTarget.scrollTop);
  };

  React.useLayoutEffect(() => {
    setPageType("profile_edit");
  });

  // *** Fetch user details
  React.useEffect(() => {
    var config = {
      method: "get",
      url: `${process.env.REACT_APP_URL_LINK}api/users/full/profile/${handleUn}`,
      headers: {
        Authorization: "Bearer " + token,
      },
    };
    axios(config)
      .then(function (response) {
        setProfile(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, [token, user, handleUn, update]);

  return (
    <Layout goBack={true} title={"Profile information"}>
      {user ? (
        <div>
          {/*  */}
          <div>
            <PersonalEdit profile={profile} />
          </div>
        </div>
      ) : (
        <div className='empty_edit_profile_container'>
          <ProfileEditSkeleton />
        </div>
      )}
    </Layout>
  );
};
const mapStateToProps = (state) => ({
  user: state.user.user,
  token: state.user.token,
  posts: state.post.posts,
  pinnedPost: state.post.pinnedPost,
  update: state.user.updateUser,
  axisValue: state.page.axisValue,
});
const mapDispatchToProps = (dispatch) => ({
  login: (user, token) => dispatch(userLogin(user, token)),
  newPosts: (posts) => dispatch(newPosts(posts)),
  setPinnedPost: (post) => dispatch(setNewPinnedPost(post)),
  setPageType: (pageType) => dispatch(setPageType(pageType)),
  updateUser: (data) => dispatch(updateUser(data)),
  setUpdatedUser: (data) => dispatch(updateUser(data)),
  setScrollAxis: (data) => dispatch(setScrollAxis(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditProfile);
