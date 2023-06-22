import React from 'react';
import { Link } from 'react-router-dom';
import { FiMoreHorizontal } from "react-icons/fi";
import { connect } from "react-redux";
import { userLogin, addToLike, removeToLike, addToSpam, removeToSpam, removeToShares, addToShares, addToDislikes, removeToDislikes } from "../../redux/user/user.actions";
import {setNewPinnedPost} from "../../redux/post/post.actions"
import { Menu, MenuItem, MenuButton, SubMenu } from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";
import MyModal from "../modal/MyModal";
import { AiFillLike, AiOutlineLike, AiOutlineDislike, AiFillDislike, AiFillHeart } from "react-icons/ai";
import { BsFillPinAngleFill, BsEmojiLaughing } from "react-icons/bs";
import EmojiPicker from "../EmojiPicker/EmojiPicker";
import { RiSpam2Fill, RiSpam2Line } from "react-icons/ri";
import "./ReplyComp.css"

const ReplyComp = ({ postId, commentId, replyData, token, user, reports, setPinnedPost, postUserId, addToLikeArray, likeList, removeToLike, addToSpam, removeToSpam, spamList, removeToShares, addToShares, sharesList, addToDislikes, removeToDislikes, dislikesList }) => {
  const [replyId, setReplyId] = React.useState("");
  const [openPinnModal, SetOpenPinnModal] = React.useState("");
  const [openHideModal, setOpenHideModal] = React.useState("");
  const [openDeleteModal, setOpenDeleteModal] = React.useState("");
  const [openEditModal, setOpenEditModal] = React.useState("");
  const [content, setContent] = React.useState(replyData.reply);
  const [openEmoji, setOpenEmoji] = React.useState(false);
  // console.log(replyData)

  // *** Handle reply pinned modal
  const handleReplyPinnModal = (id) => {
    setReplyId(id);
    SetOpenPinnModal(true)
  }
  // *** Handle reply pinned
  const handleReplyPinn = () => {
    var axios = require('axios');
    var data = JSON.stringify({
      "commentId": commentId,
      "replyId": replyId
    });

    var config = {
      method: 'put',
      url: `${process.env.REACT_APP_URL_LINK}api/posts/comment/reply/pinn/${postId}`,
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      data: data
    };

    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
        setPinnedPost(response.data.postData);
        SetOpenPinnModal(false);
      })
      .catch(function (error) {
        console.log(error);
      });

  };

  // *** Handle reply hide modal
  const handleHideReplyModal = (id) => {
    setOpenHideModal(true);
    setReplyId(id);
  }
  // *** Handle reply hide
  const handleReplyHide = (replyId) => {
    console.log(commentId)
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      "commentId": commentId
    });

    var requestOptions = {
      method: 'PUT',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch(`${process.env.REACT_APP_URL_LINK}api/posts/comment/reply/hide/${replyId}`, requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(result);
        setOpenHideModal(false);
      })
      .catch(error => console.log('error', error));
  };

  // *** Handle reply like
  const handleReplyLike = (replyId) => {
    if (likeList.includes(replyId)) {
      removeToLike(replyId);
      removeToDislikes(replyId);
    } else {
      removeToDislikes(replyId);
      addToLikeArray(replyId)
    }
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      "commentId": commentId
    });

    var requestOptions = {
      method: 'PUT',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch(`${process.env.REACT_APP_URL_LINK}api/posts/comment/reply/like/${replyId}`, requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(result)
      })
      .catch(error => console.log('error', error));
  };

  // *** Handle reply Dislike
  const handleReplyDislike = (replyId) => {
    if (dislikesList.includes(replyId)) {
      removeToDislikes(replyId);
      removeToLike(replyId)
    } else {
      removeToLike(replyId);
      addToDislikes(replyId)
    }
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      "commentId": commentId
    });

    var requestOptions = {
      method: 'PUT',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch(`${process.env.REACT_APP_URL_LINK}api/posts/comment/reply/dislike/${replyId}`, requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(result)
      })
      .catch(error => console.log('error', error));
  };

  // *** Handle reply spam
  const handleReplySpam = (replyId) => {
    if (spamList.includes(replyId)) {
      removeToSpam(replyId)
    } else {
      addToSpam(replyId)
    }
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      "commentId": commentId
    });

    var requestOptions = {
      method: 'PUT',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch(`${process.env.REACT_APP_URL_LINK}api/posts/comment/reply/spam/${replyId}`, requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(result)
      })
      .catch(error => console.log('error', error));
  };

  // *** Handle reply delete modal
  const handleDeleteModal = (id) => {
    setOpenDeleteModal(true);
    setReplyId(id);
  }
  // *** Handle reply delete
  const handleReplyDelete = (replyId) => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      "commentId": commentId
    });

    var requestOptions = {
      method: 'PUT',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch(`${process.env.REACT_APP_URL_LINK}api/posts/comment/reply/delete/${replyId}`, requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(result);
        setOpenDeleteModal(false);
      })
      .catch(error => console.log('error', error));
  };

 
  return (
    <React.Fragment>
      {/* Hide MODAL */}
      {
        openHideModal &&
        <MyModal
          title={"Hide reply"}
          body={"Do you want to hide this reply?"}
          setIsClose={setOpenHideModal}
          postId={replyId}
          btnText={"Hide"}
          clickHandler={handleReplyHide}
        />
      }
      {/* Delete MODAL */}
      {
        openDeleteModal &&
        <MyModal
          title={"Delete reply"}
          body={"Do you want to delete this reply?"}
          setIsClose={setOpenDeleteModal}
          postId={replyId}
          btnText={"Delete"}
          clickHandler={handleReplyDelete}
        />
      }
      <div>
        {
          !replyData.delete &&
          <div>
            {
              replyData.hides.includes(user.handleUn) ?
                <div className='reply_card'>
                  You can unhide this reply comment by click on this button
                  <button className='reply_btn' onClick={() => handleReplyHide(replyData.id)}>Unhide</button>
                </div> :
                <div className='reply_card'>
                  {/* Reply Header */}
                  <div className='reply_card_header'>
                    <div className='reply_user'>
                      <img src={replyData.c_u_img} className="reply_user_avatar" />
                      <span className='reply_user_name'>{replyData.c_u_fn} {" "}  {replyData.c_u_ln}</span>
                    </div>
                    <Menu
                      menuButton={
                        <MenuButton>
                          <FiMoreHorizontal />
                        </MenuButton>
                      }>
                      {/* Pinned reply */}
                      <MenuItem className={'menuitem'} onClick={() => handleReplyPinnModal(replyData.id)}>Pinned</MenuItem>
            
                      {/* Hide reply */}
                      <MenuItem className={'menuitem'} onClick={() => handleHideReplyModal(replyData.id)}>Hide</MenuItem>

            
                      {/* Delete reply */}
                      {
                        replyData.c_u_du === user.handleUn &&
                        <MenuItem className={'menuitem delete'} onClick={() => handleDeleteModal(replyData.id)}>Delete</MenuItem>
                      }
                    </Menu>
                  </div>

                  {/* Reply Body */}
                  <div className='reply_card_body'>{replyData.content}</div>

                  {/* Reply Footer */}
                  <div className='reply_card_footer'>
                    {/* comment reply LIKE button */}
                    <button
                      className='reply_like_btn' onClick={() => handleReplyLike(replyData.id)}>
                      {
                        likeList.includes(replyData.id) ?
                          <AiFillLike className='reply_liked' /> : <AiOutlineLike />
                      }
                      <span className='reply_like_count'>{replyData.l_c || '0'}</span>
                    </button>
                    
                    {/* comment reply DISLIKE button */}
                      <button
                        className='reply_dislike_btn'
                        onClick={() => handleReplyDislike(replyData.id)}
                      >
                      {
                        dislikesList.includes(replyData.id) ?
                          <AiFillDislike className='reply_dislike' /> :
                          <AiOutlineDislike />
                      }
                      <span className='reply_like_count'>{replyData.d_c || '0'}</span>
                    </button>
                    
                      
                    {/* comment reply DISLIKE button */}
                    <button className='reply_dislike_btn' onClick={() => handleReplySpam(replyData.id)}>
                      {
                        spamList.includes(replyData.id) ?
                          <RiSpam2Fill className='reply_dislike' /> :
                          <RiSpam2Line />
                      }
                      <span className='reply_like_count'>{replyData.s_c || '0'}</span>
                    </button>
                  </div>
                </div>
            }
          </div>
        }
      </div>
    </React.Fragment>
  )
};

const mapStateToProps = (state) => ({
  user: state.user.user,
  token: state.user.token,
  likeList: state.user.likes,
  spamList: state.user.spam,
  sharesList: state.user.shares,
  dislikesList: state.user.dislikes,
});

const mapDispatchToProps = (dispatch) => ({
  login: (user, token) => dispatch(userLogin(user, token)),
  letePost: (post) => dispatch(deletePost(post)),
  setPinnedPost: (post) => dispatch(setNewPinnedPost(post)),
  addToLikeArray: (post) => dispatch(addToLike(post)),
  removeToLike: (post) => dispatch(removeToLike(post)),
  addToSpam: (post) => dispatch(addToSpam(post)),
  removeToSpam: (post) => dispatch(removeToSpam(post)),
  removeToShares: (post) => dispatch(removeToShares(post)),
  addToShares: (post) => dispatch(addToShares(post)),
  addToDislikes: (post) => dispatch(addToDislikes(post)),
  removeToDislikes: (post) => dispatch(removeToDislikes(post))
});

export default connect(mapStateToProps, mapDispatchToProps)(ReplyComp);