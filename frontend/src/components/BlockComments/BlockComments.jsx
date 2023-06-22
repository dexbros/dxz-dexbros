/** @format */

import React from "react";
import { connect } from "react-redux";
import { setPageType } from "../../redux/page/page.actions";
import { addToSpam } from "../../redux/user/user.actions";
import {
  setBlockCast,
  newMessages,
  setPinnedMessage,
  setRemovePinnedMessage,
  removeMessage,addLikeComment,addHeartComment,addIdeaComment
} from "../../redux/block/block.action";
import { setNewPinnedPost } from "../../redux/post/post.actions";
import timeDifference from "../../utils/getCreateTime";
import { Menu, MenuItem, MenuButton, SubMenu } from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";
import { GrMore } from "react-icons/gr";
import MyModal from "../modal/MyModal";
// import "./BlockMessage.css";
import { AiFillHeart, AiFillLike, AiFillDislike } from "react-icons/ai";
import { BsFillEmojiLaughingFill, BsPinAngleFill } from "react-icons/bs";
import { MdEmojiObjects } from "react-icons/md";
import { useParams } from "react-router";
import { useSocket, socket, isSocketConnected } from "../../socket/socket";
import { RiSpamLine } from "react-icons/ri";
// import { LinkedinShareButton } from "react-share";
import "./BlockComments.css"

const BlockComments = ({
  token,
  user,
  posts,
  pinnedPost,
  newPosts,
  setPageType,
  updatePost,
  blockCast,
  newMessages,
  comments,
  addMessage,
  pinnedMessage,
  addComments,
  commentData, setRemovePinnedMessage, setPinnedMessage, addToSpam, spamList, setPinnedPost, addLikeComment,addHeartComment,addIdeaComment, like, heart, idea, dislike, funny, addDislikeComment, addFunnyComment
}) => {
  const [openDeleteModal, setOpenDeleteModal] = React.useState(false);
  const [openPinnedModal, setOpenPinnedModal] = React.useState(false);
  const [openAdminModal, setOpenAdminModal] = React.useState(false);
  const [mid, setMid] = React.useState("");
  const [showEmoji, setshowEmoji] = React.useState(false);
  const [username, setUsername] = React.useState("")

  const { id } = useParams();
  useSocket();

  const showEmojiHandle = () => {
    setshowEmoji((p) => !p);
  };

  // *** Handle pinned modal
  const handlePinnedCommentModal = (id) => {
    setOpenPinnedModal(true);
    setMid(id)
  }
  // *** Handle pinned comment
  const handlePinnedComment = () => {
    if (pinnedMessage.includes(mid)) {
      // console.log("Already have")
      setRemovePinnedMessage(mid)
    } else {
      setPinnedMessage(mid);
    }
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    var requestOptions = {
      method: 'PUT',
      headers: myHeaders,
      redirect: 'follow'
    };
    fetch(`${process.env.REACT_APP_URL_LINK}api/blockcast/comment/pinn/${mid}`, requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(result);
        setOpenPinnedModal(false);
      })
      .catch(error => console.log('error', error));
  };

  // *** Handle admin modal
  const handleAdminModal = (id) => {
    setOpenAdminModal(true);
    setUsername(id);
  }
  // *** Handle add to Admin
  const handleAdmin = () => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      "username": username
    });

    var requestOptions = {
      method: 'PUT',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch(`${process.env.REACT_APP_URL_LINK}api/blockcast/admin/${id}`, requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(result);
        setOpenAdminModal(false);
      })
      .catch(error => console.log('error', error));
  };

  // *** Handle spam button
  const spamComment = (id) => {
    addToSpam(id)
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);
    var raw = "";
    var requestOptions = {
      method: 'PUT',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };
    fetch(`${process.env.REACT_APP_URL_LINK}api/blockcast/comment/spam/${id}`, requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(result);
        setPinnedPost(result.comment)
      })
      .catch(error => console.log('error', error));
  };

  // ***Handle like button
  const likeHandle = (id) => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);
    var raw = "";
    var requestOptions = {
      method: 'PUT',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };
    fetch(`${process.env.REACT_APP_URL_LINK}api/blockcast/comment/like/${id}`, requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(result);
        setPinnedPost(result.comment)
      })
      .catch(error => console.log('error', error));
  };

  // *** Handle Comment Like icon
  const handleLikeIcon = (id) => {
    addLikeComment(id);
    likeHandle(id);
  }

  // *** Handle Comment Heart icons
  const handleHeartIcon = (id) => {
    addHeartComment(id);
    likeHandle(id);
  }

  // *** Handle Comment Idea icons
  const handleIdeaIcon = (id) => {
    addIdeaComment(id);
    likeHandle(id);
  } 

  // *** Handle Comment Dislike icons
  const handleDislikeIcon = (id) => {
    addDislikeComment(id);
    likeHandle(id);
  } 

  // *** Handle Comment Funny icons
  const handleFunnyIcon = (id) => {
    addFunnyComment(id);
    likeHandle(id);
  } 

  return (
    <div className={commentData.c_u_dun === blockCast.b_c_dun ?
      'comment_card block_owner_cmnt' : 'comment_card'}>

      {/* PINNED COMMENT MODAL */}
      {openPinnedModal && (
        <MyModal
          title={commentData.pinn ? 'iUnpnned comment' : 'Pinned comment'}
          body={commentData.pinn ? 'Do you want to unpinned this message ?' : 'Do you want to pinned this message ?'}
          setIsClose={setOpenPinnedModal}
          btnText={commentData.pinn ? "Unpinn" : "Pinn"}
          postId={mid}
          clickHandler={handlePinnedComment}
        />
      )}

      {/* ADMIN COMMENT MODAL */}
      {openAdminModal && (
        <MyModal
          title={'Admin'}
          body={"Do you want to add this user as an Admin?"}
          setIsClose={setOpenAdminModal}
          btnText={"Admin"}
          postId={mid}
          clickHandler={handleAdmin}
        />
      )}

      {/* Message card header */}
      <div className='comment_card_header'>
        {commentData.pinn && <BsPinAngleFill className='msg_pin' />}
        {/* Header user info */}
        <div className='msg_user_info'>
          <img src={commentData.c_u_pic} className='msg_card_avatar' />
          <span className='msg_name'>
            {commentData.c_u_fn} {commentData.c_u_ln}
          </span>
          <span className='cmnt_username'>{commentData.c_u_dun}</span>
          <span className='cmt_time'>
            {timeDifference(new Date(), commentData.c_t)}
          </span>
          {
            commentData.c_u_dun === blockCast.b_c_dun &&
            <span className="block_creator">Creator</span>
          }
          {
            blockCast.admins.includes(commentData.c_u_dun) &&
            <span className="block_creator admin">Admin</span>
          }
          {
            commentData.spam.length >= 5 &&
            <>
            {
                commentData.spam.length > commentData.like &&
                <span className="warning_tag">Warning</span>
            }
            </>
          }
        </div>

        <>
          {/* Message dropdown menu */}
          {blockCast.b_c_dun === user.handleUn && (
            <Menu
              menuButton={
                <MenuButton className={"social_post_menu"}>
                  <GrMore />
                </MenuButton>
              }>
              <MenuItem
                className={"menu_item"}
                onClick={() => handlePinnedCommentModal(commentData.c_id)}>
                {commentData.pinn ? <>Unpin</> : <>Pinn</>}
              </MenuItem>
              {/* <MenuItem
                className={"menu_item delete"}
                onClick={() => handleDeleteMessageModal(commentData.c_id)}>
                Delete
              </MenuItem> */}
              <MenuItem
                className={"menu_item"} onClick={() => handleAdminModal(commentData.c_u_dun)}>
                Set as Admin
              </MenuItem>
            </Menu>
          )}
        </>
      </div>

      {/* Message body */}
      <div className={commentData.c_u_dun === blockCast.b_c_dun ? 'comment_card_body owner_cmnt_card_body' : 'comment_card_body'}>
        <span className='cmnt_content'>{commentData.content}</span>
        <br />
        {commentData.image !== "" && (
          <img src={commentData.image} className='cmnt_card_body_image' />
        )}
        {commentData.url !== "" && (
          <a href={commentData.url} className='comment_link'>
            {commentData.url}
          </a>
        )}
      </div>

      <div className="blk_cmnt_btn_container">
        <button
          className="like_commnt_btn"
          onClick={showEmojiHandle}>
          <AiFillHeart />
          {commentData.like}
        </button>

        {
          commentData.c_u_dun !== blockCast.b_c_dun &&
          <button
            className={commentData.spam.includes(user.handleUn) ? "blk_cmnt_spam blk_cmnt_spam_disable" : 'blk_cmnt_spam'}
            onClick={() => spamComment(commentData.c_id)}
            // disabled={spamList.includes(commentData.c_id)}
          ><RiSpamLine />{commentData.spam && <>{commentData.spam.length}</>}
          </button>}
      </div>

      {showEmoji && (
        <div className='emoji_container'>
          <button className='message_emoji_btn' onClick={() => handleLikeIcon(commentData.c_id)}>
            <AiFillLike />
          </button>
          <button className='message_emoji_btn' onClick={() => handleHeartIcon(commentData.c_id)}>
            <AiFillHeart />
          </button>
          <button className='message_emoji_btn' onClick={() => handleIdeaIcon(commentData.c_id)}>
            <MdEmojiObjects />
          </button>
          <button className='message_emoji_btn' onClick={() => handleDislikeIcon(commentData.c_id)}>
            <AiFillDislike />
          </button>
          <button className='message_emoji_btn' onClick={() => handleFunnyIcon(commentData.c_id)}>
            <BsFillEmojiLaughingFill />
          </button>
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  user: state.user.user,
  token: state.user.token,
  posts: state.post.posts,
  pinnedPost: state.post.pinnedPost,
  blockCast: state.blockCast.blockCast,
  comments: state.blockCast.comments,
  pinnedMessage: state.blockCast.pinnedMessage,
  like: state.blockCast.like,
  heart: state.blockCast.heart,
  idea: state.blockCast.idea,
  dislike: state.blockCast.dislike,
  funny: state.blockCast.funny,
});

const mapDispatchToProps = (dispatch) => ({
  newPosts: (posts) => dispatch(newPosts(posts)),
  updatePost: (post) => dispatch(updatePost(post)),
  setPageType: (type) => dispatch(setPageType(type)),
  newMessages: (data) => dispatch(newMessages(data)),
  addMessage: (data) => dispatch(addMessage(data)),
  addComments: (data) => dispatch(addComments(data)),
  setPinnedMessage: (data) => dispatch(setPinnedMessage(data)),
  setRemovePinnedMessage: (data) => dispatch(setRemovePinnedMessage(data)),
  addToSpam: (post) => dispatch(addToSpam(post)),
  setPinnedPost: (post) => dispatch(setNewPinnedPost(post)),
  addLikeComment: (post) => dispatch(addLikeComment(post)),
  addHeartComment: (post) => dispatch(addHeartComment(post)),
  addIdeaComment: (post) => dispatch(addHeartComment(post)),
  addDislikeComment: (post) => dispatch(addHeartComment(post)),
  addFunnyComment: (post) => dispatch(addHeartComment(post)),
});

export default connect(mapStateToProps, mapDispatchToProps)(BlockComments);
