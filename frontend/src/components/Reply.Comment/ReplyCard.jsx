import React from 'react';
import { connect } from "react-redux";
import { t } from 'i18next';
import { addGroupPost, updateGroupPost, deleteGroupPost, addPostComment, updatePostComment, deletePostComment } from "../../redux/Group/group.actions";
import { AiOutlineLike, AiFillLike, AiFillDislike, AiOutlineDislike } from "react-icons/ai";
import { RiSpam2Line, RiSpam2Fill } from "react-icons/ri";
import { Menu, MenuItem, MenuButton, SubMenu } from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";
import { GrMore } from 'react-icons/gr';
import MyModal from "../modal/MyModal";
import { userLogin, addToLike, addToPoll, removeToLike, addToSpam, removeToSpam, removeToShares, addToShares, addToDislike, removeToDislike, addEmojiLike, removeEmojiLike, addEmojiDislike, removeEmojiDislike, addEmojiHeart, removeEmojiHeart, addEmojParty, removeEmojiParty, addEmojHaha, removeEmojiHaha } from "../../redux/user/user.actions";

const ReplyCard = ({ cmntId, replyData, token, user, likeList, dislikesList, spamList, addToSpam, removeToSpam, removeToLike, addToLikeArray, removeToDislike, addToDislikes }) => {
  // console.log(replyData)
  const [openHideModal, setOpenHideModal] = React.useState(false);
  const [openDeleteModal, setOpenDeleteModal] = React.useState(false)
  const [replyId, setReplyId] = React.useState("");

  // *** Handle Hide modal
  const handleHideModal = (id) => {
    console.log(id)
    setOpenHideModal(true);
    setReplyId(id);
  };
  // *** Handle hide reply
  const handleHideReply = (replyId) => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      "commentId": cmntId
    });

    var requestOptions = {
      method: 'PUT',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch(`${process.env.REACT_APP_URL_LINK}api/group/post/comment/reply/hide/${replyId}`, requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(result)
        setOpenHideModal(false)
      })
      .catch(error => console.log('error', error));
  };

  // *** Handle Delete modal
  const handleDeleteModal = (id) => {
    setOpenDeleteModal(true);
    setReplyId(id);
  }
  const deleteReply = () => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      "commentId": cmntId
    });

    var requestOptions = {
      method: 'PUT',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch(`${process.env.REACT_APP_URL_LINK}api/group/post/comment/reply/delete/${replyId}`, requestOptions)
      .then(response => response.text())
      .then(result => {
        console.log(result);
        setOpenDeleteModal(false);
      })
      .catch(error => console.log('error', error));
  };


  const likeReply = (id) => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      "commentId": cmntId
    });

    var requestOptions = {
      method: 'PUT',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch(`${process.env.REACT_APP_URL_LINK}api/group/post/comment/reply/like/${id}`, requestOptions)
      .then(response => response.json())
      .then(result => console.log(result))
      .catch(error => console.log('error', error));
  };

  const dislikeReply = (id) => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      "commentId": cmntId
    });

    var requestOptions = {
      method: 'PUT',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch(`${process.env.REACT_APP_URL_LINK}api/group/post/comment/reply/dislike/${id}`, requestOptions)
      .then(response => response.json())
      .then(result => console.log(result))
      .catch(error => console.log('error', error));
  }

  const spamReply = (id) => {
    if (spamList.includes(id)) {
      removeToSpam(id);
    } else {
      addToSpam(id)
    }
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      "commentId": cmntId
    });

    var requestOptions = {
      method: 'PUT',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch(`${process.env.REACT_APP_URL_LINK}api/group/post/comment/reply/spam/${id}`, requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(result)
      })
      .catch(error => console.log('error', error));
  };


  return (
    <React.Fragment>
      {
        !replyData.delete &&
        <div className='reply_card'>
          {/* Reply Hide modal */}
          {
            openHideModal &&
            <MyModal
              title={"Hide reply"}
              body="Do you want to hide this reply?"
              btnText={"Hide"}
              setIsClose={setOpenHideModal}
              postId={replyId}
              clickHandler={handleHideReply}
            />
          }

          {/* Reply Delete modal */}
          {
            openDeleteModal &&
            <MyModal
              title={"Delete reply"}
              body="Do you want to delete this reply?"
              btnText={"Delete"}
              setIsClose={setOpenDeleteModal}
              postId={replyId}
              clickHandler={deleteReply}
            />
          }

          {
            replyData.hides.includes(user.handleUn) ?
              <div>You can unhide this reply comment <button className='unhide_btn' onClick={() => handleHideReply(replyData.id)}>{t("unhide")}</button></div> :
              <div>
                {/* Reply card_header */}
                <div className='reply_card_header'>
                  <div className='reply_user_box'>
                    <img src={replyData.c_u_img} className="reply_card_user_avata" />
                    <span className='reply_user_name'>{replyData.c_u_fn} {" "} {replyData.c_u_ln} </span>
                    <span className='reply_user_username'>{replyData.c_u_du} </span>
                  </div>
                  <Menu
                    menuButton={
                      <MenuButton className={"social_post_menu"}>
                        <GrMore />
                      </MenuButton>
                    }>
                    {/* 1. Hide reply */}
                    <MenuItem className={"social_post_menuItem"} onClick={() => handleHideModal(replyData.id)}>
                      <>{t("hide")}</>
                    </MenuItem>
          
                    <MenuItem
                      className={"social_post_menuItem delete"}
                      onClick={() => handleDeleteModal(replyData.id)}
                    >
                      {t("delete")}
                    </MenuItem>
                  </Menu>
                </div>

                {/* Reply card body */}
                <div className='reply_body'>{replyData.content}</div>

                {/* Reply card body */}
                <div className='reply_card_footer'>
                  <button className='reply_footer_btn _like' onClick={() => likeReply(replyData.id)}>
                      {
                        likeList.includes(replyData.id) ?
                          <AiFillLike /> : <AiOutlineLike />
                    }
                    {replyData.l_c}
                  </button>

                  <button className='reply_footer_btn _like' onClick={() => dislikeReply(replyData.id)}>
                    {
                      dislikesList.includes(replyData.id) ?
                      <AiFillDislike /> :<AiOutlineDislike />
                    }
                    {replyData.d_c}
                  </button>

                  <button className='reply_footer_btn _like' onClick={() => spamReply(replyData.id)}>
                    {
                      spamList.includes(replyData.id) ?
                    <RiSpam2Fill />: 
                    <RiSpam2Line />
                    }
                    {replyData.s_c}
                  </button>
                </div>
              </div>
          }
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
  updatePost: state.group.updatePost
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
  removeToDislikes: (post) => dispatch(removeToDislikes(post)),
  updateGroupPost: (data) => dispatch(updateGroupPost(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(ReplyCard);