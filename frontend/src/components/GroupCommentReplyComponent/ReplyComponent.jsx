import React from 'react'
import { Link } from 'react-router-dom';
import { FiMoreHorizontal } from "react-icons/fi";
import { connect } from "react-redux";
import { userLogin, addToLike, removeToLike, addToSpam, removeToSpam, removeToShares, addToShares, addToDislikes, removeToDislikes } from "../../redux/user/user.actions";
import {setNewPinnedPost} from "../../redux/post/post.actions"
import { Menu, MenuItem, MenuButton, SubMenu } from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";
import MyModal from "../modal/MyModal";
import { AiFillLike, AiOutlineLike, AiOutlineDislike, AiFillDislike } from "react-icons/ai";
import { BsFillPinAngleFill, BsEmojiLaughing } from "react-icons/bs";
import EmojiPicker from "../EmojiPicker/EmojiPicker";
import "./ReplyComponent.css";



const ReplyComponent = ({ postId, commentId, replyData, token, user, reports, setPinnedPost, postUserId, addToLikeArray, likeList, removeToLike, addToSpam, removeToSpam, spamList, removeToShares, addToShares, sharesList, addToDislikes, removeToDislikes, dislikesList }) => {
  const [openHideModal, setOpenHideModal] = React.useState(false);
  const [openDeleteModal, setOpenDeleteModal] = React.useState(false);
  const [openPinnedModal, setOpenPinnedModal] = React.useState(false);
  const [openEditModal, setOpenEditModal] = React.useState(false);
  const [replyId, setReplyId] = React.useState("");
  const [replyText, setReplyText] = React.useState(replyData.reply);
  const [count, setCount] = React.useState(0);
  const [openEmoji, setOpenEmoji] = React.useState(false);

  // *** Handle HIDE modal
  const handleHideModal = (id) => {
    setReplyId(id);
    setOpenHideModal(true);
  }
  // *** Handle reply HIDE
  const hideCommentReplyHandler = (replyId) => {
    var axios = require('axios');
    var data = JSON.stringify({
      "postId": postId,
      "commentId": commentId
    });

    var config = {
      method: 'put',
      url: `${process.env.REACT_APP_URL_LINK}api/group/post/comment/reply/hide/${replyId}`,
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      data: data
    };

    axios(config)
      .then(function (response) {
        console.log((response.data));
        setOpenHideModal(false);
        setPinnedPost(response.data.postData);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  // *** Ḥandle reply PINNED modal
  const handlePinnedModal = (id) => {
    setOpenPinnedModal(true);
    setReplyId(id);
  }
  // *** Handle reply PINNED 
  const handlePinnedCommentReply = (replyId) => {
    var axios = require('axios');
    var data = JSON.stringify({
      "postId": postId,
      "commentId": commentId
    });

    var config = {
      method: 'put',
      url: `${process.env.REACT_APP_URL_LINK}api/group/post/comment/reply/pinned/${replyId}`,
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      data: data
    };
    axios(config)
      .then(function (response) {
        console.log(response.data);
        setOpenPinnedModal(false);
        setPinnedPost(response.data.postData)
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  // *** Handle reply DELETE modal
  const handleDeleteModal = (id) => {
    // alert(id)
    setOpenDeleteModal(true);
    setReplyId(id);
  }
  const handleDeleteReplyComment = (id) => {
    var axios = require('axios');
    var data = JSON.stringify({
      "postId": postId,
      "commentId": commentId
    });

    var config = {
      method: 'delete',
      url: `${process.env.REACT_APP_URL_LINK}api/group/post/comment/reply/delete/${replyId}`,
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      data: data
    };

    axios(config)
      .then(function (response) {
        console.log(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  // *** Handle reply comment LIKE button
  const handleReplyLike = (id) => {
    if (dislikesList.includes(id)) {
      // Remove
      console.log("Remove from dislike list")
      removeToDislikes(id);
      addToLikeArray(id)
    } else {
      if (likeList.includes(id)) {
        removeToLike(id)
      } else {
        addToLikeArray(id);
      }
    }
    var axios = require('axios');
    var data = JSON.stringify({
      "postId": postId,
      "commentId": commentId
    });

    var config = {
      method: 'put',
      url: `${process.env.REACT_APP_URL_LINK}api/group/post/comment/reply/like/${id}`,
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      data: data
    };

    axios(config)
      .then(function (response) {
        console.log(response.data);
        setPinnedPost(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  // *** Handle DISLIKE reply comment
  const handleReplyDislike = (id) => {
    if (likeList.includes(id)) {
      // Remove from likes
      removeToLike(id);
      addToDislikes(id);
    } else {
      if (dislikesList.includes(id)) {
        // Remove from dislikes list
        removeToDislikes(id)
      } else {
        // Adding to dislike list
        addToDislikes(id)
      }
    }
    var axios = require('axios');
    var data = JSON.stringify({
      "postId": postId,
      "commentId": commentId
    });

    var config = {
      method: 'put',
      url: `${process.env.REACT_APP_URL_LINK}api/group/post/comment/reply/dislikes/${id}`,
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      data: data
    };

    axios(config)
      .then(function (response) {
        console.log(response.data);
        setPinnedPost(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });

  };

  // *** Handle reply comment EDIT
  const handleEditReply = (id) => {
    setOpenEditModal(true);
    setReplyId(id)
  }

  // *** Updating or EDITING reply comment
  const editReply = () => {
    var axios = require('axios');
    var data = JSON.stringify({
      "postId": postId,
      "commentId": commentId,
      "reply": replyText
    });

    var config = {
      method: 'put',
      url: `${process.env.REACT_APP_URL_LINK}api/group/post/comment/reply/edit/${replyId}`,
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      data: data
    };

    axios(config)
      .then(function (response) {
        setPinnedPost(response.data);
        setCount(0);
        setOpenEditModal(false);
      })
      .catch(function (error) {
        console.log(error);
      });

  };


  // *** Adding emoji to input field
  const addEmoji = (e) => {
    setReplyText(prev => prev + e.native)
  }

  const handleInputChange = (e) => {
    setReplyText(e.target.value.slice(0, 100))
  }
  const checkWordLength = (e) => {
    if (e.charCode === 8) {
      setCount(p => p - 1);
    } else {
      setCount(p => p + 1);
    }
  }
  
  return (
    <React.Fragment>
      {
        replyData.hide.includes(user._id) ?
          <div className='hide_msg_container'>
            You hide this comment reply
            <button className='unhide_button'
              onClick={() => hideCommentReplyHandler(replyData.r_id)}>
              Unhide
            </button>
          </div> :
          <div className='replyContainer'>
            {/* HIDE MODAL */}
            {
              openHideModal &&
              <MyModal
                title={'Hide comment reply'}
                body={replyData ? "Do you want to uninned this comment reply?" : "Do you want to hide this comment reply?"}
                clickHandler={hideCommentReplyHandler}
                setIsClose={setOpenHideModal}
                btnText={'Hide'}
                postId={replyId}
              />
            }

            {/* Reply PINNED modal */}
            {
              openPinnedModal &&
              <MyModal
                title={replyData.pinned ? 'Unpinned comment reply' : 'Pinned comment reply'}
                body={replyData.pinned ? "Do you want to unpinned this comment reply?" : "Do you want to pinned this comment reply?"}
                clickHandler={handlePinnedCommentReply}
                setIsClose={setOpenPinnedModal}
                btnText={replyData.pinned ? <>Unpinned</> : <>Pinned</>}
                postId={replyId}
              />
            }

            {/* Reply DELETE modal */}
            {
              openDeleteModal &&
              <MyModal
                title={'Delete comment reply'}
                body={"Do you want to delete this comment reply?"}
                clickHandler={handleDeleteReplyComment}
                setIsClose={setOpenDeleteModal}
                btnText={"Delete"}
                postId={replyId}
              />
            }

            {/* Reply EDIT modal */}
            {
              openEditModal &&
              <MyModal
                title={'Edit comment reply'}
                clickHandler={editReply}
                body={
                  <div className='reply_input_container'>
                    <label className='input_count'>{count}/100</label>
                    <br />
                    <textarea
                      type="text"
                      className='modal_reply_input'
                      value={replyText}
                      onChange={(e) => handleInputChange(e)}
                      onKeyDown={(e) => checkWordLength(e)}
                      placeholder="Change reply comment"
                    />
                    <div>
                      <button className='reply_emoji_btn' onClick={() => setOpenEmoji(p => !p)}>
                        <BsEmojiLaughing />
                      </button>
                    </div>
                    {
                      openEmoji &&
                      <EmojiPicker onEmojiSelect={e => addEmoji(e)} />
                    }
                  </div>
                }
                setIsClose={setOpenEditModal}
                btnText={"Update"}
                postId={replyId}
              />
            }


            <div className='reply_msg'>Reply to <span className='reply_to_username'>{replyData.o_u_fn} {replyData.o_u_ln}</span></div>

            {/* Pinned comment reply */}
            {
              replyData.pinned && <BsFillPinAngleFill className='reply_pinned_icons' />
            }
            
      
            {/* Reply card header */}
            <div className='reply_card_header'>
              {/* Reply card header user info */}
              <div className='reply_card_user_info'>
                <div>
                  <img src={replyData.r_u_img} className='reply_user_image' />
                  <Link to={`/profile/${replyData.r_u_du}`} className="reply_user_name">{replyData.r_u_fn} {replyData.r_u_ln}</Link>
                  <span className='reply_user_username'>@{replyData.r_u_du}</span>
                </div>
              </div>

              {/* Reply card menu */}
              <Menu
                menuButton={
                  <MenuButton>
                    <FiMoreHorizontal />
                  </MenuButton>
                }>
          
                {/* Delete comment reply */}
                {
                  postUserId === user._id.toString() &&
                  <MenuItem className={'menuitem'} onClick={() => handleDeleteModal(replyData.r_id)}>
                    <span className='dropdown_icon'></span>
                    Delete
                  </MenuItem>
                }

                {/* Edit comment reply */}
                {
                  replyData.r_u_id === user._id.toString() &&
                  <MenuItem className={'menuitem'} onClick={() => handleEditReply(replyData.r_id)}>
                  <span className='dropdown_icon'></span>
                  Edit
                </MenuItem>
                }
                

                {/* Hide comment reply */}
                {
                  postUserId === user._id.toString() &&
                  <MenuItem className={'menuitem'} onClick={() => handleHideModal(replyData.r_id)}>
                    <span className='dropdown_icon'></span>
                    Hide
                  </MenuItem>
                }

                {/* Pinned delete reply */}
                {
                  postUserId === user._id.toString() &&
                  <MenuItem className={'menuitem'} onClick={() => handlePinnedModal(replyData.r_id)}>
                    <span className='dropdown_icon'></span>
                    {
                      replyData.pinned ? <>Unpinned</> : <>Pinned</>
                    }
                  </MenuItem>
                }
              </Menu>
            </div>

            {/* Reply card body */}
            <div className='reply_card_body'>
              <span className='content'>{replyData.reply}</span>
            </div>

            {/* Reply card footer */}
            <div className='reply_card_footer'>

              {/* comment reply LIKE button */}
              <button
                className='reply_like_btn'
                onClick={() => handleReplyLike(replyData.r_id)}
              >
                {
                  likeList.includes(replyData.r_id) ?
                    <AiFillLike className='reply_liked' /> : <AiOutlineLike />
                }
                <span className='reply_like_count'>{replyData.likes || '0'}</span>
              </button>

              {/* comment reply DISLIKE button */}
              <button className='reply_dislike_btn' onClick={() => handleReplyDislike(replyData.r_id)}>
                {
                  dislikesList.includes(replyData.r_id) ?
                    <AiFillDislike className='reply_dislike' /> :
                    <AiOutlineDislike />
                }
                <span className='reply_like_count'>{replyData.dislikes || '0'}</span>
              </button>
            </div>
          </div>
      }
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

export default connect(mapStateToProps, mapDispatchToProps)(ReplyComponent);