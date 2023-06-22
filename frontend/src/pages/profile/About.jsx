/** @format */

import React from "react";
import { useParams } from "react-router-dom";
import { connect } from "react-redux";
import { setPageType } from "../../redux/page/page.actions";
import { userLogin, updateUser } from "../../redux/user/user.actions";
import { newPosts, setNewPinnedPost } from "../../redux/post/post.actions";
import { useTranslation } from "react-i18next";
import axios from "axios";

const About = ({ user, token, update, setUpdatedUser, setPageType }) => {
  const { handleUn } = useParams();
  const { t } = useTranslation(["common"]);
  const [profile, setProfile] = React.useState(null);

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
        console.log(response.data);
        setProfile(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, [token, user, handleUn, update]);

  return (
    <React.Fragment>
      {profile && (
        <div className='__profile_edit_setion profile_about'>
          {/* Basic account information */}
          <div className='edit_box'>
            <span className='edit_header_title'>
              {t("Basic account information")}
            </span>
          </div>
          <div className='account_basci_info'>
            {/* User first name */}
            <div className='sub_box'>
              <span className='sub_box_header'>{t("First name")}</span>
              <span className='sub_box_title'>{profile.fn}</span>
            </div>
            {/* User last name */}
            <div className='sub_box'>
              <span className='sub_box_header'>{t("Last name")}</span>
              <span className='sub_box_title'>{profile.ln}</span>
            </div>
            {/* User handle username */}
            <div className='sub_box'>
              <span className='sub_box_header'>{t("Handle username")}</span>
              <span className='sub_box_title'>{profile.handleUn}</span>
            </div>
            {/* User login username */}
            <div className='sub_box'>
              <span className='sub_box_header'>{t("Login username")}</span>
              <span className='sub_box_title'>{profile.log_un}</span>
            </div>
            {/* User Email */}
            <div className='sub_box'>
              <span className='sub_box_header'>{t("User Email")}</span>
              <span className='sub_box_title'>{profile.email}</span>
            </div>
            {/* User login username */}
            <div className='sub_box'>
              <span className='sub_box_header'>{t("User phone")}</span>
              <span className='sub_box_title'>{profile.phone}</span>
            </div>
          </div>

          {/* Profile user about */}
          <div className='edit_box'>
            <span className='edit_header_title'>{t("About")}</span>
          </div>
          <div className='account_basci_info'>
            {/* User profile bio */}
            <div className='sub_box'>
              <span className='sub_box_header'>{t("Bio")}</span>
              <span className='sub_box_title'>{profile.bio}</span>
            </div>
            {/* User Gender */}
            <div className='sub_box'>
              <span className='sub_box_header'>{t("Gender")}</span>
              <span className='sub_box_title'>{profile.gender}</span>
            </div>
            {/* User country */}
            <div className='sub_box'>
              <span className='sub_box_header'>{t("Country")}</span>
              <span className='sub_box_title'>{profile.country}</span>
            </div>
            {/* User Gender */}
            <div className='sub_box'>
              <span className='sub_box_header'>{t("City")}</span>
              <span className='sub_box_title'>{profile.city}</span>
            </div>
          </div>

          {/* Favourite crypto currency */}
          <div className='edit_box'>
            <span className='edit_header_title'>
              {t("Basic account information")}
            </span>
          </div>
          <div className='account_basci_info'>
            {(profile.favCoin || []).length > 0 ? (
              <div className='tag_section'>
                {profile.favCoin.map((value, index) => (
                  <span className='interest_tag' key={index}>
                    {value}
                  </span>
                ))}
              </div>
            ) : (
              <div>{t("No interest has been set")}</div>
            )}
          </div>

          {/* Interestes */}
          <div className='edit_box'>
            <span className='edit_header_title'>{t("Interests")}</span>
          </div>
          <div className='account_basci_info'>
            {(profile.interest || []).length > 0 ? (
              <div className='tag_section'>
                {profile.interest.map((value, index) => (
                  <span className='interest_tag' key={index}>
                    {value}
                  </span>
                ))}
              </div>
            ) : (
              <div>{t("No interest has been set")}</div>
            )}
          </div>

          {/* User Website */}
          <div className='edit_box'>
            <span className='edit_header_title'>{t("Website")}</span>
          </div>
          <div className='account_basci_info'>
            <div className='sub_box'>
              <span className='sub_box_header'>{t("Website link")}</span>
              <a href={profile.website} className='sub_box_title link'>
                {profile.website}
              </a>
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

const mapStateToProps = (state) => ({
  user: state.user.user,
  token: state.user.token,
  posts: state.post.posts,
  pinnedPost: state.post.pinnedPost,
  update: state.user.updateUser,
});
const mapDispatchToProps = (dispatch) => ({
  login: (user, token) => dispatch(userLogin(user, token)),
  newPosts: (posts) => dispatch(newPosts(posts)),
  setPinnedPost: (post) => dispatch(setNewPinnedPost(post)),
  setPageType: (pageType) => dispatch(setPageType(pageType)),
  updateUser: (data) => dispatch(updateUser(data)),
  setUpdatedUser: (data) => dispatch(updateUser(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(About);
