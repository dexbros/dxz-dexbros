import React from 'react';
import { connect } from "react-redux";
import { setPageType } from "../../redux/page/page.actions";
import { userLogin, updateUser, addToHideUser, removeToHideUser } from "../../redux/user/user.actions";
import { newPosts, setNewPinnedPost } from "../../redux/post/post.actions";
import { useTranslation } from "react-i18next";
import UserAvatar from "../../Assets/userAvatar.webp";

const HideUserList = ({userData, setUpdatedUser, user, token}) => {
  const { t } = useTranslation(["common"]);

  // *** Handle hide user profile
  const handleUpdateHideUser = (handleUn) => {
    var axios = require('axios');
    var config = {
      method: 'put',
      url: `${process.env.REACT_APP_URL_LINK}api/users/hide-user/${handleUn}`,
      headers: {
        'Authorization': 'Bearer ' + token
      }
    };

    axios(config)
      .then(function (response) {
        console.log((response.data));
        setUpdatedUser(response.data.user)
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <div className='hide_users_lists'>
      <div className='user_section'>
        <img src={userData.p_ic ? userData.p_i : UserAvatar} className="user_avatar" /> 
        <span className='user_list_card_name'>{userData.fn} {userData.ln}</span>
        <span className='user_list_card_username'>@{userData.handleUn}</span>
      </div>

      <button className='btn_unhide' onClick={(() => handleUpdateHideUser(userData.handleUn))}>{t("Unhide")}</button>
    </div>
  )
}

const mapStateToProps = (state) => ({
  user: state.user.user,
  token: state.user.token,
  posts: state.post.posts,
  pinnedPost: state.post.pinnedPost,
  update: state.user.updateUser
});
const mapDispatchToProps = (dispatch) => ({
  login: (user, token) => dispatch(userLogin(user, token)),
  updateUser: (data) => dispatch(updateUser(data)),
  setUpdatedUser: (data) => dispatch(updateUser(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(HideUserList);