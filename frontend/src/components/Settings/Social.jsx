import React from 'react';
import { useState } from 'react';
import { GrEdit } from "react-icons/gr";
import { connect } from 'react-redux';
import { userLogin, userLogout } from "../../redux/user/user.actions";
import { setPageType } from "../../redux/page/page.actions";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from 'react';
import "../../pages/Settings/Settings.css"
import Dropdown from '../dropdown/Dropdown';
import UserList from "../../components/Block.Hide.User/User"


const Social = ({
  user,
  token,
  login, setPageType, logout
}) => {
  const [editPrivacy, setEditPrivacy] = useState(false);
  const [privacy, setPrivacy] = useState(user.privacy || "All");
  const [editPassword, setEditPassword] = useState(false);
  const [disable, setDisable] = useState(true);
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState("");
  const [rePassword, setRePassword] = useState('');
  const [mode, setMode] = useState("");
  const [select, setSelect] = useState('English');
  const [blockedUser, setBlockedUser] = useState([]);
  const [hideUser, setHideUser] = useState([]);
  const [openBlockUser, setOpenBlockUser] = useState(false);
  const [openHideUser, setOpenHideUser] = useState(false);


  useEffect(() => {
    if (!password.trim() || !newPassword.trim() || !rePassword.trim() || newPassword !== rePassword) {
      setDisable(true);
    } else {
      setDisable(false)
    }
  }, [password, newPassword, rePassword]);

  // useEffect(() => {
  //   var axios = require('axios');

  //   var config = {
  //     method: 'get',
  //     url: 'http://localhost:5000/api/users/details/' + user._id,
  //     headers: {
  //       'Authorization': 'Bearer ' + token
  //     }
  //   };

  //   axios(config)
  //     .then(function (response) {
  //       console.log(response.data);
  //       setBlockedUser(response.data.block);
  //       setHideUser(response.data.hide);
  //     })
  //     .catch(function (error) {
  //       console.log(error);
  //     });

  // }, [token, user]);

  useEffect(() => {
    var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };

    fetch(`${process.env.REACT_APP_URL_LINK}profile/fetch/${user.handleUn}`, requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(result);
        setBlockedUser(result.block);
        setHideUser(result.hide);
      })
      .catch(error => console.log('error', error));
  }, [token, user, user.handleUn]);


  const handleRadioBtn = (e) => {
    setPrivacy(e.target.value)
  }

  const changePrivacy = () => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      "privacy": privacy
    });

    var requestOptions = {
      method: 'PUT',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch(`${process.env.REACT_APP_URL_LINK}api/users/update/privacy`, requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(result);
        toast.success(result.msg);
        login(result.user, result.token);
        setEditPrivacy(false);
      })
      .catch(error => console.log('error', error));
  };

  const changePassword = () => {
    var axios = require('axios');
    var data = JSON.stringify({
      "password": password,
      "newPassword": newPassword
    });

    var config = {
      method: 'post',
      url: `${process.env.REACT_APP_URL_LINK}api/users/update/password`,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      data: data
    };

    axios(config)
      .then(function (response) {
        // console.log(JSON.stringify(response.data));
        // console.log(response.status);
        logout();

      })
      .catch(function (error) {
        console.log(error.response.status)
        toast.error(error.response.data.msg);
      });

  };

  const handleNightMode = (e) => {
    setMode(e.target.value)
    localStorage.setItem('mode', e.target.value)
  }

  const handleDayMode = (e) => {
    setMode(e.target.value)
    localStorage.setItem('mode',e.target.value)
  }

  const userUnblock = (id) => {
     var axios = require('axios');

    var config = {
      method: 'put',
      url: `${process.env.REACT_APP_URL_LINK}api/users/block/${id}`,
      headers: {
        'Authorization': 'Bearer ' + token
      }
    };

    axios(config)
      .then(function (response) {
        // console.log(JSON.stringify(response.data));
        console.log(response);
        if (response.status === 200) {
          toast.success(response.data.msg);
          setOpenBlockUser(false);
          login(response.data.loggedUser, result.data.token)
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  const userUnHide = (id) => {
    var axios = require('axios');

    var config = {
      method: 'put',
      url: 'http://localhost:5000/api/users/hide/' + id,
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };

    axios(config)
      .then(function (response) {
        // console.log(JSON.stringify(response.data));
        // console.log(response.data.loggedUser.hide);
        if (response.status === 200) {
          toast.success(response.data.msg);
          setOpenHideUser(false);
          login(response.data.loggedUser, token)
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  
  return (
    <div className='social_settings_page'>
      
      {/* PRIVACY SETTINGS */}
      <div className='settings_box'>
        {/* HEADER */}
        <div className='settings_box_header'>
          <>
            <span className='settings_box_header_text'>Privacy Settings</span><br />
            {/* <span className='settings_box_subheader_text'>User can change his/her privacy settings</span> */}
          </>
          {
            !editPrivacy &&
            <button onClick={() => setEditPrivacy(true)}>
              <GrEdit />
            </button>
          }
        </div>

        {
          !editPrivacy ?
            <div className='visible_page'>
              <span className='visible_page_header'>Privacy settings for profile: </span>
              <span className='visible_page_subheader'>Your selected visible for { }</span>
            </div> :
            <div className='edit_page'>
              Privacy settings for profile:<br />
              
              <div className='radio_container' onChange={e => handleRadioBtn(e)}>
                <input type="radio" className='_radio_input' value="All" name="privacy" onChange={(e) => setPrivacy(e.target.value)} checked={privacy === 'All'} />All{"   "}<br />

                <input type="radio" className='_radio_input' value="followers" name="privacy" onChange={(e) => setPrivacy(e.target.value)} checked={privacy === 'followers'} />Only followers{"   "}<br />

                <input type="radio" className='_radio_input' value="None" name="privacy" onChange={(e) => setPrivacy(e.target.value)} checked={privacy === "None"} />Only me{"   "}
              </div>

              <ul className='popup'>
                <li className='popup_msg'>You can select privacy settings according to your need</li>
              </ul>

              <div className='btn_container'>
                <button className='save_btn' onClick={() => changePrivacy()}>Save</button>
                <button className='cancel_btn' onClick={() => setEditPrivacy(prev => !prev)}>Cancel</button>
              </div>
            </div>
        }
      </div>

      {/* PASSWORD SETTINGS */}
      <div className='settings_box'>
        <div className='settings_box_header'>
          <>
            <span className='settings_box_header_text'>Password Settings</span><br />
          </>
          {
            !editPassword &&
            <button onClick={() => setEditPassword(true)}>
              <GrEdit />
            </button>
          }
        </div>

        {
          editPassword ?
            <div className='form_container'>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder='Enter old password' className='input_field' />
              <br />
              <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder='Enter new password' className='input_field' />
              <br />
              <input type="password" placeholder='Re enter new password' className='input_field' value={rePassword} onChange={e => setRePassword(e.target.value)} />

              <div className='btn_container'>
                <button className={disable ? "save_btn disable" : 'save_btn'} disable={disable} onClick={() => changePassword()} >Save</button>
                <button className='cancel_btn' onClick={() => setEditPassword(prev => !prev)}>Cancel</button>
              </div>
            </div> :
            <div>
              You can change your password from here
            </div>
        }
      </div>


      {/* THEME SETTINGS */}
      <div className='settings_box'>
        <div className='settings_box_header'>
          <>
            <span className='settings_box_header_text'>Change Mode</span><br />
          </>
        </div>
        <div  className='edit_page'>
          Select mode: <br />
          <input type="radio" className='_radio_input' value="night" name="mode" onChange={(e) => handleNightMode(e)} checked={localStorage.getItem('mode') === "night"}  />Night{"   "}
          <input type="radio" className='_radio_input' value="day" name="mode"  checked={localStorage.getItem('mode') === "day"} onChange={(e) => handleDayMode(e)} />Day{"   "}<br />
        </div>
      </div>


      {/* Language Settings */}
      <div className='settings_box'>
        <div className='settings_box_header'>
          <>
            <span className='settings_box_header_text'>Change Language</span><br />
          </>
        </div>
        <Dropdown select={select} setSelect={setSelect} />
        <div className='language_box'>
          <span className='message'>You selected {select } as your language</span>
        </div>
      </div>

      {/* Block User List */}
      <div className='settings_box'>
        <div className='settings_box_header'>
          <>
            <span className='settings_box_header_text'>Block users list</span><br />
          </>
          {
            !editPassword &&
            <button onClick={() => setOpenBlockUser(p => !p)}>
              <GrEdit />
            </button>
          }
        </div>
        {/* {
          openBlockUser ?
          <>
            {
              (blockedUser || []).length > 0 &&
              <>
              {
                  blockedUser.map(user => (
                    <UserList userData={user} key={user._id} btn_text={"Unblock"} handleClick={userUnblock} />
                ))
              }
              </>
            }
          </> :
          <>
          <span>You have total {blockedUser.length} no of blocked users</span>
          </>
        } */}
      </div>

      {/* Block User List */}
      <div className='settings_box'>
        <div className='settings_box_header'>
          <>
            <span className='settings_box_header_text'>Hide users list</span><br />
          </>
          {
            !editPassword &&
            <button onClick={() => setOpenHideUser(p => !p)}>
              <GrEdit />
            </button>
          }
        </div>

        {
          openHideUser ?
          <>
            {
              (hideUser || []).length > 0 &&
              <>
              {
                  hideUser.map(user => (
                    <UserList userData={user} key={user._id} btn_text={"Unhide"} handleClick={userUnHide} />
                ))
              }
              </>
            }
          </> :
          <>
          <span>Hide users</span>
          </>
        }
      </div>
      <ToastContainer />
    </div>
  )
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
  logout: () => dispatch(userLogout())
});

export default connect(mapStateToProps, mapDispatchToProps)(Social);