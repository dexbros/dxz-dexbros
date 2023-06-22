import React,{useState, useEffect} from 'react';
import {AiOutlineCamera} from "react-icons/ai"
import { Link } from 'react-router-dom';
// import Image from "../../Assets/image.png";
import { IoMdCloseCircle } from "react-icons/io";
import { ToastContainer, toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';
// var members = [];
import "./GroupCreate.css"

const GroupCreate = ({ token, user, setCollapse, groupConfig }) => {
  const [searchUser, setSearchUser] = useState('');
  const [show, setShow] = useState(false);
  const [users, setUsers] = useState([]);
  const [isDisable, setIsDisable] = useState(true);
  // Group name state...
  const [name, setName] = useState('');
  // Group details state
  const [details, setDetails] = useState('');
  const [status, setStatus] = useState('Public');
  const [selectUsers, setSelectUser] = useState([]);
  const [gmembers, setGMemebers] = useState([])
  // const [cover_img, setCover_img] = useState("");
  // const [profile_img, setProfile_img] = useState('');
  const [responseMsg, setResponseMsg] = useState('');
  
  const [nameCount, setNameCount] = useState(0);
  const [detailsCount, setDetailsCount] = useState(0);

  var nameLimit = 15;
  var bioLimit = 40;

  useEffect(() => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    fetch(`${process.env.REACT_APP_URL_LINK}api/users?search=${searchUser}`, requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(result);
        setUsers(result)
      })
      .catch(error => console.log('error', error));
  }, [searchUser]);

  useEffect(() => {
    if (searchUser.trim()) {
      setShow(true);
    } else {
      setShow(false);
    }
  }, [searchUser]);

  // Check before creating group
  useEffect(() => {
    if (!name.trim() || !details.trim()) {
      setIsDisable(true);
    } else {
      // Group details should be in between 5 to 40 words
      setIsDisable(false);
      console.log(members)
    }
  }, [selectUsers, name, details]);
  

  const addUserHandler = (user) => {
    // console.log(user);
    // if (!members.includes(user._id)) {
    //   setSelectUser([user, ...selectUsers]);
    //   // members.push(user._id);
    //   setMemebers([...members, user._id])
    //   console.log(members)
    // }
  };

  const createGroup = () => {
    console.log(gmembers)
    var axios = require('axios');
      var data = JSON.stringify({
        "name": name,
        "details": details,
        "members": gmembers,
        "status": status
      });

      var config = {
        method: 'post',
        url: `${process.env.REACT_APP_URL_LINK}api/group`,
        headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json'
        },
        data: data
      };

      axios(config)
        .then(function (response) {
          console.log(response);
        })
        .catch(function (error) {
          toast.error(error.response.data.msg);
        });
  };

  const unSelectUser = (userId) => {
    setSelectUser(selectUsers.filter(user => user._id !== userId));
    setMemebers(members.filter(id => id !== userId));
  }

  const handleDetails = (value) => {
    setDetails(value);
  }

  const handleNameChange = (e) => {
    setName(e.target.value.slice(0, nameLimit));
    if (nameCount < 15) {
      setNameCount(prev => prev + 1);
    }
  }

  const handleBioChange = (e) => {
    handleDetails(e.target.value.slice(0, bioLimit));
    if (detailsCount < bioLimit) {
      setDetailsCount(prev => prev + 1);
    }
  }


  return (
    <>
      <div className='__group_create_page'>

        {/* Group forms */}
        <div className='__group_forms'>
          <div className='input_box'>
            <label className='input_label'>
              <span>{nameCount}/</span>
              <span>{nameLimit}</span>
            </label>
            <br />
            <input type="text" placeholder='Provide group name' className='__group_page_input' value={name} onChange={e => handleNameChange(e)} />
          </div>

          <div className='input_box'>
            <label className='input_label'>
              <span>{detailsCount}/</span>
              <span>{bioLimit}</span>
            </label>
            <br />
          <textarea className='__group_page_textarea' placeholder='Provide group details' value={details} onChange={e => handleBioChange(e)}></textarea>
          </div>

          <div>
            <label className='radio_btn_label'>Group Status:</label>
            <label className='radio_btn' >
              <input type="radio" value="Public" name="status" checked={status === 'Public'} onChange={(e) => setStatus(e.target.value)} /> Public
            </label>
            <label className='radio_btn'>
              <input type="radio" value="Private" name="status" checked={status === 'Private'} onChange={(e) => setStatus(e.target.value)} /> Private
            </label>

            <div className='display_msg'>
              <li>By default we will select Public as group status</li>
              <li>In Public group anyone can view, comment and share group posts</li>
              <li>In Private group only group members can view, comment and share group posts</li>
            </div>
          </div>

          <div className='group_members_container'>
            {
              (selectUsers || []).length > 0 &&
              <div className='tag_container'>
                {
                  selectUsers.map(selectUser => (
                    <div className='tags' key={selectUser._id}>
                      <li className='tag'>
                        <span className='tag-title'>
                          {selectUser.displayFirstName ? selectUser.displayFirstName : selectUser.firstName} {" "} {selectUser.displayLastName ? selectUser.displayLastName : selectUser.lastName}
                        </span>
                        <button className='tag_close_icon' onClick={() => unSelectUser(selectUser._id)}>
                          <IoMdCloseCircle />
                        </button>
                      </li>
                    </div>
                  ))
                }
              </div>
            }
            <input type="search" className='user_search_input' value={searchUser} onChange={(e) => setSearchUser(e.target.value)} placeholder="Search user by their username" />
            {
              show && <div className='added_user_container'>
                {
                  users.map(user => (
                    <div className='user_card' key={user._id}>
                      <div className='user_card_info'>
                        <img
                          src={
                            user.profilePic
                              ? user.profilePic
                              : ""
                          }
                          className='profile_avatar'
                        />
                        <Link to={`/profile/${user._id}`} className="user_name">
                          {user.displayFirstName &&
                            user.displayLastName ? (
                            <>
                              {user.displayFirstName +
                                " " +
                                user.displayLastName}
                            </>
                          ) : (
                            <>
                              {user.firstName +
                                " " +
                                user.lastName}
                            </>
                          )}
                        </Link>
                      </div>
                      <button className={members.includes(user._id) ? 'group_add_btn disable' : 'group_add_btn'} onClick={() => addUserHandler(user)} disabled={members.includes(user._id)}>Add</button>
                    </div>
                  ))
                }
              </div>
            }
            <div className='display_msg'>
              <li>At least 2 members are required to start a group.</li>
            </div>
          </div>

          <div className='create'>
            <button className={isDisable ? 'create_btn create_btn_disable' : 'create_btn'} disabled={isDisable} onClick={createGroup}>Create</button>
          </div>
        </div>
        <ToastContainer />
      </div>
    </>
  )
};

export default GroupCreate