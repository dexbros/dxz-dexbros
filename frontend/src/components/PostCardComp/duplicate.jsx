import React from 'react';
import { connect } from "react-redux";
import { useSocket } from "../../socket/socket";
import { useTranslation } from "react-i18next";
import { setPageType } from "../../redux/page/page.actions";
import { Menu, MenuItem, MenuButton, SubMenu } from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";
import UserAvatar from "../../Assets/userAvatar.webp";
import { Link } from 'react-router-dom';
// import timeDifference from "../../utils/getCreateTime";
import { FiMoreHorizontal } from 'react-icons/fi';
import { AiOutlineClose, AiOutlineHeart, AiOutlineLike, AiOutlineShareAlt } from "react-icons/ai";
import { BiCommentDetail } from "react-icons/bi";
import { RiSpam2Line, RiSpam2Fill } from "react-icons/ri";
import { ImSpinner2 } from "react-icons/im";
import ModalComp from '../modal/ModalComp';
import { VscPinned } from "react-icons/vsc";
import { BsEmojiAngry, BsEmojiSunglasses, BsFillBookmarkStarFill } from "react-icons/bs";
import {
  setNewPinnedPost,
  updatePost,
  deletePost,
  putPosts,
  newPosts,
  newComments,
  updateComments
} from "../../redux/post/post.actions";
import { userLogin, addToLike, addToPoll, removeToLike, addToSpam, removeToSpam, removeToShares, addToShares, addToDislike, removeToDislike, addEmojiLike, removeEmojiLike, addEmojiDislike, removeEmojiDislike, addEmojiHeart, removeEmojiHeart, addEmojParty, removeEmojiParty, addEmojHaha, removeEmojiHaha } from "../../redux/user/user.actions";
import { addNewComment } from "../../redux/postComment/comment.actions";
import { identifier } from '@babel/types';
import { GrGallery } from "react-icons/gr";
import { BsEmojiLaughing } from "react-icons/bs";
import PostCommentCard from '../PostCommentCard/PostCommentCard';
import EmojiLike from "../EmojiLike/EmojiLike";
import { useNavigate } from 'react-router-dom';
import TestUser from '../user/TestUser';
import { BsFillPinFill, BsFillBookmarkFill, BsFillTrashFill } from "react-icons/bs";
import { AiFillEdit } from "react-icons/ai";
import { SiGoogleanalytics } from "react-icons/si";
import { BiHide } from "react-icons/bi";
import { ReactComponent as PinnIcon } from "../../Assets/Icons/pinned.svg";
import { ReactComponent as ShareIcon } from "../../Assets/Icons/share.svg";
import { ReactComponent as CommentIcon } from "../../Assets/Icons/comment.svg";

const maxLength = 200;

const PostCard = ({ postData, user, token, setPinnedPost, addToSpam, removeToSpam, spamList, addEmojiLike, addEmojiHeart, addEmojHaha, addEmojParty, addEmojiDislike, removeEmojiLike, removeEmojiHeart, removeEmojiHaha, removeEmojiDislike, removeEmojiParty, emoji_likes, emoji_dislikes, emoji_party, emoji_haha, emoji_heart, addNewComment, selectComment }) => {
  const navigate = useNavigate();
  const { t } = useTranslation(["common"]);
  const [postId, setPostId] = React.useState("");
  const [post, setPost] = React.useState("");
  const [isDisable, setIsDisable] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);
  const [openPinnedModal, setOpenPinnedModal] = React.useState(false);
  const [openBookModal, setOpenBookModal] = React.useState(false);
  const [openHideModal, setOpenHideModal] = React.useState(false);
  const [openShareModal, setOpenShareModal] = React.useState(false);
  const [openCommentModal, setOpenCommentModal] = React.useState(false);
  const [content, setContent] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [isFocus, setIsFocus] = React.useState(false);
  const [image, setImage] = React.useState("");
  const [prevImage, setPrevImage] = React.useState("");
  const [commentsData, setCommentsData] = React.useState([]);
  const [page, setPage] = React.useState(1);
  const [lastResponseData, setLastResponseData] = React.useState(1);
  const [sortedBy, setSortedBy] = React.useState("popular");
  const [prevSortedBy, setprevSortedBy] = React.useState("popular");
  const [openEmojiIcons, setOpenEmojiIcons] = React.useState(false);
  const [openDeleteModal, setOpenDeleteModal] = React.useState(false);
  const [openEditModal, setOpenEditModal] = React.useState(false);
  const [postContent, setPostContent] = React.useState("");
  const [postImage, setPostImage] = React.useState("");
  const [postGif, setPostGif] = React.useState("");
  const [openLikeList, setOpenLikeList] = React.useState(false);
  const [tabValue, setTabValue] = React.useState("likes");
  const [users, setUsers] = React.useState([]);


  const handleClick = (value, id, data) => {
    if (value === 'pin') {
      setPostId(id);
      setOpenPinnedModal(true)
    } else if (value === 'book') {
      setPostId(id);
      setOpenBookModal(true)
    } else if (value === 'hide') {
      setPostId(id);
      setOpenHideModal(true);
    } else if (value === 'unhide') {
      setPostId(id);
      setOpenHideModal(true);
    } else if (value === 'spam') {
      handlePostSpamHandler(id)
    } else if (value === 'share') {
      setPost(data);
      setOpenShareModal(true);
      setPostId(id);
    } else if (value === 'comment') {
      setPostId(id);
      setOpenCommentModal(true)
    } else if (value === 'delete') {
      setPostId(id);
      setOpenDeleteModal(true);
    } else if (value === 'analytics') {
      // alert(id);
      navigate(`/post/analytics/${id}`)
    } else if (value === 'edit') {
      setPost(data);
      setOpenEditModal(true);
      setPostContent(data.content);
      setPostImage(data.image);
      setPostId(id);
      setPostGif(data.gif)
    } else if (value === 'likeList') {
      setOpenLikeList(true);
      setPostId(id);
      fetchUserLike();
    } else if (value === 'visit') {
      navigate(`/user/profile/${data.u_dun}`)
    } else if (value === 'post_body') {
      // alert(id)
      navigate(`/full/post/${id}`);
    }
  }

  // *** Handle pinned post
  const pinnedPostHandler = () => {
    setIsLoading(true)
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    var raw = "";

    var requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch("http://localhost:5000/api/posts/pinned/" + postId, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        setPinnedPost(result.postData);
        setPostId("");
        setOpenPinnedModal(false);
        setIsLoading(false)
      })
      .catch((error) => {
        console.log("error", error);
        setPostId("");
        setOpenPinnedModal(false);
      });
  };

  // *** Handle bookmark post
  const handleBookmarkPost = () => {
    setIsLoading(true)
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      pinned: true,
    });

    var requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    fetch(`http://localhost:5000/api/posts/bookmark/${postId}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setPinnedPost(result.postData);
        console.log(result);
        setOpenBookModal(false);
        setPostId("");
        setIsLoading(false)
      })
      .catch((error) => {
        setOpenBookModal(false);
        setPostId("");
        console.log(error);
      });
  };

  // *** Handle hide post
  const handleHidePost = () => {
    // setIsLoading(true)
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    var requestOptions = {
      method: 'PUT',
      headers: myHeaders,
      redirect: 'follow'
    };

    fetch("http://localhost:5000/api/posts/hide/" + postId, requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(result.post);
        setPinnedPost(result.post);
        setOpenHideModal(false);
        setIsLoading(false)
      })
      .catch(error => console.log('error', error));
  }

  // *** Post spam handler
  const handlePostSpamHandler = (id) => {
    if (spamList.includes(id)) {
      removeToSpam(id);
    } else {
      addToSpam(id)
    }
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    var requestOptions = {
      method: 'PUT',
      headers: myHeaders,
      redirect: 'follow'
    };

    fetch("http://localhost:5000/api/posts/spam/" + id, requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(result);
        setPinnedPost(result)
      })
      .catch(error => console.log('error', error));
  };

  const handleChange = (e) => {
    setContent(e.target.value.slice(0, maxLength))
  }

  // *** Handle share post
  const handleRepostWithQuoteHandler = () => {
    var axios = require('axios');
    var data = JSON.stringify({
      "content": content
    });

    var config = {
      method: 'post',
      url: 'http://localhost:5000/api/posts/repost/status/' + postId,
      headers: {
        'Authorization': 'Berar ' + token,
        'Content-Type': 'application/json'
      },
      data: data
    };

    axios(config)
      .then(function (response) {
        console.log(response);
        setPinnedPost(response);
        setOpenShareModal(false);
      })
      .catch(function (error) {
        console.log(error);
      });

  };

  const handleImageChange = (e) => {
    setPrevImage(URL.createObjectURL(e.target.files[0]));
    setImage(e.target.files[0])
  }

  const closeCmntImage = () => {
    setPrevImage('');
    setImage('')
  }

  const handleMessageChange = (e) => {
    setMessage(e.target.value.slice(0, 100));
  }

  React.useEffect(() => {
    if (!message.trim()) {
      if (!image) {
        setIsDisable(true)
      } else {
        setIsDisable(false)
      }
    } else {
      setIsDisable(false)
    }
  }, [message, image]);

  // *** Handle group post comment
  const postComment = () => {
    setIsLoading(true);
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    var formdata = new FormData();
    formdata.append("image", image);
    formdata.append("comment", message);
    // formdata.append("gif", gif);
    formdata.append("firstName", user.fn);
    formdata.append("lastName", user.ln);
    formdata.append("handleUn", user.handleUn);
    formdata.append("profilePic", user.profilePic);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formdata,
      redirect: "follow",
    };

    fetch("http://localhost:5000/api/posts/comment/" + postId, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        setMessage("");
        setIsLoading(false);
        setPrevImage("");
        setImage("");
        setIsDisable("");
        setIsFocus(false)
        setCommentsData(prev => [result, ...prev])
      })
      .catch((error) => {
        console.log("End...")
        console.log("error", error);
        setMessage("");
        setIsLoading(false);
        setPrevImage("");
        setImage("");
        setIsDisable("")
      });
  };

  // *** Fetch post comment
  const fetchComments = () => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);
    var raw = "";
    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };
    fetch(`http://localhost:5000/api/posts/comment/${postId}?page=${page}&sortedBy=${sortedBy}`, requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(result)
        setLastResponseData(result.length);
        // addNewComment(result);
        if (prevSortedBy !== sortedBy) {
          setCommentsData([]);
          setCommentsData(prev => [...prev, ...result]);
        } else {
          setCommentsData(prev => [...prev, ...result]);
        }
        setprevSortedBy(sortedBy)
        // newComments(result);
      })
      .catch(error => console.log('error', error));
  }
  

  // *** Scroll handler
  const scrollHandler = (e) => {
    let cl = e.currentTarget.clientHeight;
    console.log(e.currentTarget.clientHeight)
    let sy = Math.round(e.currentTarget.scrollTop);
    // console.log(sy)
    let sh = e.currentTarget.scrollHeight;
    console.log(sh, cl, sy)
    if ((cl + sy) + 1 >= sh) {
      setPage((page) => page + 1);
    }
  }
  // console.log(page)

  // *** Calling fetch post comments function
  React.useEffect(() => {
    if (postId) {
      fetchComments(postId, sortedBy)
    }
  }, [page, postId, sortedBy, selectComment]);

  const handleOpenEmojis = (id) => {
    setOpenEmojiIcons(true);
    setPostId(id);
  }

  function useOutsideAlerter(ref) {
    React.useEffect(() => {
      /**
       * Alert if clicked on outside of element
       */
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          setOpenEmojiIcons(false);
        }
      }
      // Bind the event listener
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  }

  const wrapperRef = React.useRef(null);
  useOutsideAlerter(wrapperRef);

  const handleEmojiLike = (value) => {
    if (value === "like") {
      addEmojiLike(postId);
      removeEmojiHeart(postId);
      removeEmojiHaha(postId);
      removeEmojiParty(postId);
      removeEmojiDislike(postId)
    } else if (value === "heart") {
      removeEmojiLike(postId);
      addEmojiHeart(postId);
      removeEmojiHaha(postId);
      removeEmojiParty(postId);
      removeEmojiDislike(postId)
    } else if (value === "haha") {
      removeEmojiLike(postId);
      removeEmojiHeart(postId);
      addEmojHaha(postId);
      removeEmojiParty(postId);
      removeEmojiDislike(postId)
    } else if (value === "party") {
      removeEmojiLike(postId);
      removeEmojiHeart(postId);
      removeEmojiHaha(postId);
      addEmojParty(postId);
      removeEmojiDislike(postId)
    } else if (value === "dislikes") {
      removeEmojiLike(postId);
      removeEmojiHeart(postId);
      removeEmojiHaha(postId);
      removeEmojiParty(postId);
      addEmojiDislike(postId)
    }
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    var requestOptions = {
      method: 'PUT',
      headers: myHeaders,
      redirect: 'follow'
    };

    fetch(`http://localhost:5000/api/posts/${postId}/like?likedBy=${value}`, requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(result);
        setPinnedPost(result)
      })
      .catch(error => console.log('error', error));

  };

  const handleDropDownMenu = (val) => {
    // console.log(val)
    setSortedBy(val);
    //  console.log(val)
    //  fetchComments(postId, sortedBy);
  }

  // *** Delete Post
  const handleDeletePost = () => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      pinned: true,
    });
    var requestOptions = {
      method: "DELETE",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    fetch(`http://localhost:5000/api/posts/delete/${postId}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result)
        setPinnedPost(result.postData);
        setOpenDeleteModal(false);
        setPostId("");
        // toast.success(result.msg)
      })
      .catch((error) => console.log("error", error));
  }

  const editPostHandler = () => {
    setIsLoading(true);
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      "content": postContent,
      "gif": postGif
    });

    var requestOptions = {
      method: 'PUT',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch("http://localhost:5000/api/posts/edit/" + postId, requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(result);
        setPinnedPost(result);
        setPostId("");
        setPostContent("");
        setPostImage("");
        setIsLoading(false);
        setOpenEditModal(false);
      })
      .catch(error => console.log('error', error));
  };

  React.useEffect(() => {
    fetchUserLike()
  }, [tabValue, postId]);

  const fetchUserLike = () => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    fetch(`http://localhost:5000/api/posts/like/users/${postId}?term=${tabValue}&page=1`, requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(result);
        setUsers(result);
      })
      .catch(error => console.log('error', error));
  };

  return (
    <React.Fragment>
      {/* Post edit modal */}
      {
        openEditModal &&
        <ModalComp
          onClose={setOpenEditModal}
          title={<>{t("edit")}</>}
          body={
            <div className='modal_post_edit_container'>
              <div>
                <textarea
                  type="text"
                  className='post_form_textarea'
                  value={postContent}
                  onChange={e => setPostContent(e.target.value.slice(0, 200))}
                ></textarea>
              </div>
              {
                post.image &&
                <>
                  {
                    postImage &&
                    <div className='modal_image_container'>
                      <img src={`https://storage.googleapis.com/dexbros_files/${postImage}`} className="modal_image" />
                      {/* <button className='modal_close_image_btn' onClick={() => setPostImage("")}><AiOutlineClose /></button> */}
                    </div>
                  }
                </>
              }
            </div>
          }
          footer={
            <div className='__modal_footer'>
              <button
                className='__modal_footer_btn'
                onClick={editPostHandler}
              >
                {
                  isLoading ? <ImSpinner2 className="spinner_icon" /> : <>{t("Edit")}</>
                }
                
              </button>
            </div>
          }
        />
      }
      {/* Delete Modal */}
      {
        openDeleteModal &&
        <ModalComp
          onClose={setOpenDeleteModal}
          title={<>{t("delete")}</>}
          body={<>{t("Do you want to delete this post")}</>}
          footer={
            <div className='__modal_footer'>
              <button
                className='__modal_footer_btn'
                onClick={handleDeletePost}
              >
                {
                  isLoading ? <ImSpinner2 className="spinner" /> : <>{t("Delete")}</>
                }
                
              </button>
            </div>
          }
        />
      }
      {/* Pinned Modal */}
      {
        openPinnedModal &&
        <ModalComp
          onClose={setOpenPinnedModal}
          title={postData.pinned == 1 ? <>{t("Pinned")}</> : <>{t("unpinned")}</>}
          body={postData.pinned == 1 ? <>{t("pin_msg")}</> : <>{t("unpin_msg")}</>}
          footer={
            <div className='__modal_footer'>
              <button
                className='__modal_footer_btn'
                onClick={pinnedPostHandler}
              >
                {
                  isLoading ? <ImSpinner2 className="spinner" /> : <>{t("Pinned")}</>
                }
                
              </button>
            </div>
          }
        />
      }

      {/* Book Modal */}
      {
        openBookModal &&
        <ModalComp
          onClose={setOpenBookModal}
          title={<>{t("Bookmark")}</>}
          body={<>{t("book_msg")}</>}
          footer={
            <div className='__modal_footer'>
              <button
                className='__modal_footer_btn'
                onClick={handleBookmarkPost}
              >
                {
                  isLoading ?
                    <ImSpinner2 className="spinner_icon" /> :
                    <>{t("Bookmark")}</>
                }
                
              </button>
            </div>
          }
        />
      }

      {/* Hide Modal */}
      {
        openHideModal &&
        <ModalComp
          onClose={setOpenHideModal}
          title={<>{t("hide")}</>}
          body={<>{t("hide_msg")}</>}
          footer={
            <div className='__modal_footer'>
              <button
                className='__modal_footer_btn'
                onClick={handleHidePost}
              >
                {
                  isLoading ?
                    <ImSpinner2 className="spinner" /> :
                    <>{t("hide")}</>
                }
                
              </button>
            </div>
          }
        />
      }

      {/* Share Modal */}
      {
        openShareModal &&
        <ModalComp
          onClose={setOpenShareModal}
          title={<>{t("share")}</>}
          body={
            <div>
              <textarea
                type="text"
                placeholder={t("share_placeholder")}
                className="modal_textarea"
                value={content}
                onChange={e => handleChange(e)}
              ></textarea>
              <div className='post_modal'>
                <div className='post_modal_header'>
                  <img
                    src={postData.u_img ? postData.u_img : UserAvatar} className="user_avatar_profile" id="post"
                  />
                  <span to={`/user/profile/${postData.u_dun}`} id="profile" className='posted_user_name'>
                    {postData.u_fn} {" "} {postData.u_ln}
                  </span>
                  <span className='posted_user_username' id="post">@{postData.u_dun}</span>
                </div>
                <div className='post_modal_body'>
                  <span className='post_body_text' id="post">{postData.content}</span>
                  {
                    postData.image &&
                    <img src={`https://storage.googleapis.com/dexbros_files/${postData.image}`} className="post_body_image" id="post" />
                  }
                  {
                    postData.gif &&
                    <img src={postData.gif} className="post_body_image" id="post" />
                  }
                </div>
              </div>
            </div>
          }
          footer={
            <div className='__modal_footer'>
              <button className='__modal_footer_btn' onClick={handleRepostWithQuoteHandler}>
                {
                  isLoading ? <ImSpinner2 className='spinner_icon' /> :
                    <span>{t("share")}</span>
                }
              </button>
            </div>
          }
        />
      }

      {/* Comment Modal */}
      {
        openCommentModal &&
        <ModalComp
          onClose={setOpenCommentModal}
          title={
            <Menu
              menuButton={
                <MenuButton className={"post_menu_button"}>
                  {t('Sort comment')}
                </MenuButton>
              }>
              <MenuItem
                value={"popular"}
                onClick={(e) => handleDropDownMenu(e.value)}
                className={"post_card_menuitem"}
              >Mode Popular</MenuItem>
              <MenuItem
                value={"new"}
                onClick={(e) => handleDropDownMenu(e.value)}
                className={"post_card_menuitem"}
              >Newest Comment</MenuItem>
              <MenuItem
                value={"old"}
                onClick={(e) => handleDropDownMenu(e.value)}
                className={"post_card_menuitem"}
              >Oldest comment</MenuItem>
            </Menu>
          }
          body={<div className='modal_comment_body'>
            {
              (commentsData || []).length > 0 ?
                <div className='post_comment_card_container' onScroll={e => scrollHandler(e)}>
                  {
                    commentsData.map(comment => (
                      <PostCommentCard key={comment.id} commentData={comment} postId={postId} />
                    ))
                  }
                </div> :
                <div className='empty_comment_container'>{t("empty_cmnt")}</div>
            }
          </div>}
          footer={
            <div className='__modal_comment_footer'>
              {/* Preview Image */}
              {
                prevImage &&
                <div className='__cmnt_prevImage'>
                  <img src={prevImage} className="__cmnt_prev_img_section" />
                  <button className='__cmnt_close_btn' onClick={closeCmntImage}><AiOutlineClose /></button>
                </div>
              }

              <div className='post_comment_form'>
                {
                  isFocus ?
                    <div className='comment_input_container'>
                      <input
                        type="text"
                        placeholder={t("cmnt_placeholder")}
                        className="form_input"
                        value={message}
                        onChange={e => handleMessageChange(e)}
                      />
                      <label htmlFor='cmnt_image' className='file_icon send_btn_icons'><GrGallery /></label>
                      <input type="file" className='file_input' id="cmnt_image" onChange={e => handleImageChange(e)} />
                      <button className='send_btn_icons'><BsEmojiLaughing /></button>
                      <button
                        onClick={postComment}
                        className={isDisable ? 'send_btn disable_btn' : 'send_btn'}
                      >
                        {
                          isLoading ?
                            <ImSpinner2 className="spinner" /> :
                            <>{t("send")}</>
                        }
                      </button>
                    </div> :
                    <input type="text" placeholder={t("cmnt_placeholder")} className="form_input" onFocus={() => setIsFocus(true)} />
                }
              </div>
            </div>
          }
        />
      }
      
      {/* Open post like by user modal */}
      {
        openLikeList &&
        <ModalComp
          onClose={setOpenLikeList}
          title={<>{t("Like")}</>}
          body={
            <div className='like_list_modal'>
              {/* Tab */}
              <div className='modal_tab_container'>
                <li
                  onClick={() => setTabValue('likes')}
                  className={tabValue === 'likes' ? 'modal_tab modal_tab_active' : 'modal_tab'}>
                  Like
                </li>
                <li
                  onClick={() => setTabValue('heart')}
                  className={tabValue === 'heart' ? 'modal_tab modal_tab_active' : 'modal_tab'}>
                  Heart
                </li>
                <li
                  onClick={() => setTabValue('haha')}
                  className={tabValue === 'haha' ? 'modal_tab modal_tab_active' : 'modal_tab'}>
                  Funny
                </li>
                <li
                  onClick={() => setTabValue('party')}
                  className={tabValue === 'party' ? 'modal_tab modal_tab_active' : 'modal_tab'}>
                  Party
                </li>
                <li
                  onClick={() => setTabValue('dislike')}
                  className={tabValue === 'dislike' ? 'modal_tab modal_tab_active' : 'modal_tab'}>
                  Dislike
                </li>
              </div>
              {/* User list */}
              <div className='user_list_container'>
                {
                  (users || []).length > 0 ?
                    <>
                      {
                        users.map(user => (
                          <TestUser key={user.record.bins.id} userData={user.record.bins} />
                        ))
                      }
                    </> :
                    <div className='empty_modal_user'>No user found</div>
                }
              </div>
            </div>
          }
          
        />
      }

      

      {
        !postData.isDelete &&
        <div className="posts_container">
          {
            postData.hide.includes(user.handleUn) ?
              <div className='__post_card' id="post">
                You can unhide this post <button id="unhide" onClick={e => handleClick(e.target.id, postData.id)} className='hide_btn'>Unhide</button>
              </div> :
              <div
                className='__post_card' 
                id="post" 
                onClick={e => handleClick(e.target.id, postData.id, postData)}
                style={{border: postData.postOf === 'np' ? '1px solid #22a6b3' : postData.postOf === 'news' ? '1px solid #6ab04c' : '1px solid #130f40'}}
                >
                {
                  postData.is_share ?
                    <div>
                      {/* Share container */}
                      <div className='share_post_conatiener'>
                        {/* Header */}
                        <div className='share_post_header'>
                          {/* User information */}
                          <div className='post_user_info' id="post">
                            <img
                              src={postData.share.u_img ? postData.share.u_img : UserAvatar} className="user_avatar_profile" id="post"
                            />
                            <span to={`/user/profile/${postData.share.u_dun}`} id="profile" className='posted_user_name'>
                              {postData.share.u_fn} {" "} {postData.share.u_ln}
                            </span>
                            <span className='posted_user_username' id="post">@{postData.share.u_dun}</span>
                            
                            {
                              postData.postOf &&
                                <span>{postData.postOf}</span>
                            }
                          </div>

                          <Menu
                            menuButton={
                              <MenuButton className={"post_menu_button"}>
                                <FiMoreHorizontal />
                              </MenuButton>
                            }>
                            {/* Pinned */}
                            {
                              postData.u_dun === user.handleUn &&
                              <MenuItem
                                id="pin"
                                className={"post_card_menuitem"}
                              >
                                <span className='dropdown_icon'>
                                  <BsFillPinFill />
                                </span>
                                {t("Pinned")}
                              </MenuItem>
                            }
                            {/* Bookmark */}
                            <MenuItem
                              id="book"
                              className={"post_card_menuitem"}
                            >
                              <span className='dropdown_icon'>
                                <BsFillBookmarkFill />
                              </span>
                              {t("Bookmark")}
                            </MenuItem>

                            {/* Edit */}
                            {
                              postData.u_dun === user.handleUn &&
                              <MenuItem
                                id="edit"
                                className={"post_card_menuitem"}
                              >
                                <span className='dropdown_icon'><AiFillEdit /></span>
                                {t("Edit")}
                              </MenuItem>
                            }
                          
                            {/* Analytics */}
                            {
                              postData.u_dun === user.handleUn &&
                              <MenuItem
                                id="analytics"
                                className={"post_card_menuitem"}
                              >
                                
                                <span className='dropdown_icon'>
                                  <SiGoogleanalytics />
                                </span>
                                {t("Analytics")}
                              </MenuItem>
                            }
                            {/* Delete */}
                            {
                              postData.u_dun === user.handleUn &&
                              <MenuItem
                                id="delete"
                                className={"post_card_menuitem delete_text"}
                              >
                                <span className='dropdown_icon'><BsFillTrashFill /></span>{t("Delete")}
                              </MenuItem>
                            }
                            {/* Hide */}
                            <MenuItem
                              id="hide"
                              className={"post_card_menuitem "}
                            >
                              <span className='dropdown_icon'>
                                <BiHide />
                              </span>
                              {t("Hide")}
                            </MenuItem>
                          </Menu>
                        </div>

                        {/* Body */}
                        <div className='post_body' id="post">
                          <span className='post_body_text' id="post">{postData.share.content}</span>
                          {
                            postData.share.image &&
                            <img src={`https://storage.googleapis.com/dexbros_files/${postData.share.image}`} className="post_body_image" id="post" />
                          }
                          {
                            postData.share.gif &&
                            <img src={postData.share.gif} className="post_body_image" id="post" />
                          }
                        </div>
                      </div>

                      {/* Original post */}
                      {/* Header */}
                      <div className='__post_header'>
                        {/* User information */}
                        <div className='post_user_info' id="post">
                          <img
                            src={postData.u_img ? postData.u_img : UserAvatar} className="user_avatar_profile" id="post"
                          />
                          <span to={`/user/profile/${postData.u_dun}`} id="profile" className='posted_user_name'>
                            {postData.u_fn} {" "} {postData.u_ln}
                          </span>
                          <span className='posted_user_username' id="post">@{postData.u_dun}</span>
                          {/* <span className='post_date'>
            {timeDifference(new Date(), new Date(postData.c_t))}
          </span> */}
                        </div>
                      </div>

                      {/* Body */}
                      <div className='post_body' id="post">
                        <span className='post_body_text' id="post">{postData.content}</span>
                        {
                          postData.image &&
                          <img src={`https://storage.googleapis.com/dexbros_files/${postData.image}`} className="post_body_image" id="post" />
                        }
                        {
                          postData.gif &&
                          <img src={postData.gif} className="post_body_image" id="post" />
                        }
                      </div>

                      {/* Button fuooter */}
                      <div className='post_footer_buttons'>
                        {
                          openEmojiIcons &&
                          <div className='card_emoji_container' ref={wrapperRef}>
                            <EmojiLike clickHandler={handleEmojiLike} id={postId} />
                          </div>
                    
                        }
                        {/* Like Button */}
                        <button id="like" className='post_footer_btn post_like_btn' onMouseMove={() => handleOpenEmojis(postData.id)}>
                          {
                            emoji_likes.includes(postData.id) ? <AiOutlineLike id="like" className='like_active' /> :
                              <>
                                {
                                  emoji_heart.includes(postData.id) ? <AiOutlineHeart id="like" className='heart_active' /> :
                                    <>
                                      {
                                        emoji_haha.includes(postData.id) ? <BsEmojiLaughing id="like" className='laugh_active' /> :
                                          <>
                                            {
                                              emoji_dislikes.includes(postData.id) ? <BsEmojiAngry id="like" className='angry_active' /> :
                                                <>
                                                  {
                                                    emoji_party.includes(postData.id) ? <BsEmojiSunglasses id="like" className='prty_active' />
                                                      : <AiOutlineLike id="like" className='like_active' />
                                                  }
                                                </>
                                            }
                                          </>
                                      }
                                    </>
                                }
                              </>
                          }
                        </button>
                        
                        {/* Comment button */}
                        <button id="comment" className='post_footer_btn post_comment_btn'><BiCommentDetail id="comment" /></button>
                        
                        {/* Share button */}
                        <button id="share" className='post_footer_btn post_share_btn'>
                          <AiOutlineShareAlt id="share" />
                        </button>
                        
                        {/* Spam button */}
                        <button id="spam" className='post_footer_btn post_spam_btn'>
                          {
                            spamList.includes(postData.id) ?
                              <RiSpam2Fill id="spam" /> :
                              <RiSpam2Line id="spam" />
                          }
                        </button>
                      </div>

                      {/* Link Footer */}
                      <div className='post_footer_blinkuttons'>
                        <button id="likeList" className='post_link_btn'>{t("like")}{" "}{postData.l_c ? postData.l_c : '0'}</button>
                        <button id="comment" className='post_link_btn'>{t("comment")} {" "}{postData.c_c ? postData.c_c : '0'}</button>
                        <button id="share" className='post_link_btn'>{t("share")}{" "}{" "} {postData.share_c ? postData.share_c : '0'}</button>
                        <button className='post_link_btn'>{t("spam")}{" "}{postData.s_c ? postData.s_c : '0'}</button>
                      </div>
                    </div> :
                    <div>
                      {/* Pinned message */}
                      {
                          postData.pinned > 0 &&
                          // <VscPinned className="pinned_icon" />
                          <PinnIcon className="pinned_icon" />
                      }
                      {
                        postData.book.includes(user.handleUn) && <BsFillBookmarkStarFill className="book_icon" />
                      }
                      {/* Header */}
                      <div className='__post_header'>
                        {/* User information */}
                        <div className='post_user_info'>
                          <img
                            id="visit"
                            src={postData.u_img ? postData.u_img : UserAvatar} className="user_avatar_profile"
                          />
                          <span id="visit" className='posted_user_name'>
                            {postData.u_fn} {" "} {postData.u_ln}
                          </span>
                          <span className='posted_user_username'>@{postData.u_dun}</span>
                            <span className='post_type_box'>{
                              postData.postOf === 'np' ? <>Normal Post</> :
                                postData.postOf === "news" ? <>News</> :
                                  postData.postOf === "info" ? <>Informative</> :
                                    <>Announcement</>
                            }</span>
                        </div>

                        <Menu
                          menuButton={
                            <MenuButton className={"post_menu_button"}>
                              <FiMoreHorizontal />
                            </MenuButton>
                          }>
                          {/* Pinned */}
                          {
                            postData.u_dun === user.handleUn &&
                            <MenuItem
                              id="pin"
                              className={"post_card_menuitem"}
                            >
                              <span className='dropdown_icon'>
                                <BsFillPinFill />
                              </span>
                              {t("Pinned")}
                            </MenuItem>
                          }
                          {/* Bookmark */}
                          <MenuItem
                            id="book"
                            className={"post_card_menuitem"}
                          >
                            <span className='dropdown_icon'>
                              <BsFillBookmarkFill />
                            </span>
                            {t("Bookmark")}
                          </MenuItem>

                          {/* Edit */}
                          {
                            postData.u_dun === user.handleUn &&
                            <MenuItem
                              id="edit"
                              className={"post_card_menuitem"}
                            >
                              <span className='dropdown_icon'><AiFillEdit /></span>
                              {t("Edit")}
                            </MenuItem>
                          }
                          
                          {/* Analytics */}
                          {
                            postData.u_dun === user.handleUn &&
                            <MenuItem
                              id="analytics"
                              className={"post_card_menuitem"}
                            >
                                
                              <span className='dropdown_icon'>
                                <SiGoogleanalytics />
                              </span>
                              {t("Analytics")}
                            </MenuItem>
                          }
                          {/* Delete */}
                          {
                            postData.u_dun === user.handleUn &&
                            <MenuItem
                              id="delete"
                              className={"post_card_menuitem delete_text"}
                            >
                              <span className='dropdown_icon'><BsFillTrashFill /></span>{t("Delete")}
                            </MenuItem>
                          }
                          {/* Hide */}
                          <MenuItem
                            id="hide"
                            className={"post_card_menuitem "}
                          >
                            <span className='dropdown_icon'>
                              <BiHide />
                            </span>
                            {t("Hide")}
                          </MenuItem>
                        </Menu>
                      </div>

                      {/* Body */}
                      <div className='post_body' id="post_body">
                        <span className='post_body_text' id="post_body">
                          {
                            postData.content.split(" ").map((val, index) => (
                              <span id="post_body" key={index} className={val.includes('#') ? "trend_tag" : ""}>{val}{" "}</span>
                            ))
                          }
                        </span>
                        {
                          postData.image &&
                          <img src={`https://storage.googleapis.com/dexbros_files/${postData.image}`} className="post_body_image" id="post_body" />
                        }
                        {
                          postData.gif &&
                          <img src={postData.gif} className="post_body_image" id="post_body" />
                        }
                      </div>

                      {/* Button fuooter */}
                      <div className='post_footer_buttons'>
                        {
                          openEmojiIcons &&
                          <div className='card_emoji_container' ref={wrapperRef}>
                            <EmojiLike clickHandler={handleEmojiLike} id={postId} />
                          </div>
                    
                        }
                        {/* Like Button */}
                        <button id="like" className='post_footer_btn post_like_btn' onMouseMove={() => handleOpenEmojis(postData.id)}>
                          {
                            emoji_likes.includes(postData.id) ? <AiOutlineLike id="like" className='like_active' /> :
                              <>
                                {
                                  emoji_heart.includes(postData.id) ? <AiOutlineHeart id="like" className='heart_active' /> :
                                    <>
                                      {
                                        emoji_haha.includes(postData.id) ? <BsEmojiLaughing id="like" className='laugh_active' /> :
                                          <>
                                            {
                                              emoji_dislikes.includes(postData.id) ? <BsEmojiAngry id="like" className='angry_active' /> :
                                                <>
                                                  {
                                                    emoji_party.includes(postData.id) ? <BsEmojiSunglasses id="like" className='prty_active' />
                                                      : <AiOutlineLike id="like" className='like_active' />
                                                  }
                                                </>
                                            }
                                          </>
                                      }
                                    </>
                                }
                              </>
                          }
                        </button>
                        
                        {/* Comment button */}
                          <button id="comment" className='post_footer_btn post_comment_btn'>
                            {/* <BiCommentDetail id="comment" /> */}
                            <CommentIcon id="comment" className='post_card_footer_icon' />
                          </button>
                        
                        {/* Share button */}
                        <button id="share" className='post_footer_btn post_share_btn'>
                          {/* <AiOutlineShareAlt id="share" /> */}
                          <ShareIcon className='post_card_footer_icon' id="share" />
                        </button>
                        
                        {/* Spam button */}
                        <button id="spam" className='post_footer_btn post_spam_btn'>
                          {
                            spamList.includes(postData.id) ?
                              <RiSpam2Fill id="spam" /> :
                              <RiSpam2Line id="spam" />
                          }
                        </button>
                      </div>

                      {/* Link Footer */}
                      <div className='post_footer_blinkuttons'>
                        <button id="likeList" className='post_link_btn'>{t("like")}{" "}{postData.l_c ? postData.l_c : '0'}</button>
                        <button id="comment" className='post_link_btn'>{t("comment")} {" "}{postData.c_c ? postData.c_c : '0'}</button>
                        <button id="share" className='post_link_btn'>{t("share")}{" "}{" "} {postData.share_c ? postData.share_c : '0'}</button>
                        <button className='post_link_btn'>{t("spam")}{" "}{postData.s_c ? postData.s_c : '0'}</button>
                      </div>
                    </div>
                }
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
  posts: state.post.posts,
  pinnedPost: state.post.pinnedPost,
  spamList: state.user.spam,

  emoji_likes: state.user.emoji_likes,
  emoji_heart: state.user.emoji_heart,
  emoji_haha: state.user.emoji_haha,
  emoji_party: state.user.emoji_party,
  emoji_dislikes: state.user.emoji_dislikes,
  selectComment: state.post.selectComment
});

const mapDispatchToProps = (dispatch) => ({
  newPosts: (posts) => dispatch(newPosts(posts)),
  putPostsLast: (posts) => dispatch(putPostsLast(posts)),
  updatePost: (post) => dispatch(updatePost(post)),
  setPageType: (type) => dispatch(setPageType(type)),
  setPinnedPost: (post) => dispatch(setNewPinnedPost(post)),
  addToSpam: (post) => dispatch(addToSpam(post)),
  removeToSpam: (post) => dispatch(removeToSpam(post)),

  addEmojiLike: (data) => dispatch(addEmojiLike(data)),
  removeEmojiLike: (data) => dispatch(removeEmojiLike(data)),
  addEmojiDislike: (data) => dispatch(addEmojiDislike(data)),
  removeEmojiDislike: (data) => dispatch(removeEmojiDislike(data)),
  addEmojiHeart: (data) => dispatch(addEmojiHeart(data)),
  removeEmojiHeart: (data) => dispatch(removeEmojiHeart(data)),
  addEmojParty: (data) => dispatch(addEmojParty(data)),
  removeEmojiParty: (data) => dispatch(removeEmojiParty(data)),
  addEmojHaha: (data) => dispatch(addEmojHaha(data)),
  removeEmojiHaha: (data) => dispatch(removeEmojiHaha(data)),

  addNewComment: (data) => dispatch(addNewComment(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(PostCard);