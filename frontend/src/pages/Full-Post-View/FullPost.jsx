/** @format */

import React from "react";
import { connect } from "react-redux";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import MainLayout from "../../layouts/main-layout.component";
import { setPageType } from "../../redux/page/page.actions";
import {
  addBookmark,
  removeBookmark,
  addToHideUser,
  removeToHideUser,
} from "../../redux/user/user.actions";
import { Menu, MenuItem, MenuButton, SubMenu } from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";
import UserAvatar from "../../Assets/userAvatar.webp";
import { FiMoreHorizontal } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import CustomModal from "../../components/modal/CustomModal";
import {
  setNewPinnedPost,
  updatePost,
  deletePost,
  putPosts,
  newPosts,
  newComments,
  updateComments,
} from "../../redux/post/post.actions";
import axios from "axios";
import NormalPostCardFooter from "../../components/FullPostFooter/NormalPostCardFooter";
import NewsPostCardFooter from "../../components/FullPostFooter/NewsPostCardFooter";
import AnnouncementPostCardFooter from "../../components/FullPostFooter/AnnouncementPostCardFooter";
import InformationPostCardFooter from "../../components/FullPostFooter/InformationPostCardFooter";
import timeDifference from "../../utils/getCreateTime";
import { ImSpinner2 } from "react-icons/im";
import { ReactComponent as AllIcon } from "../../Assets/Icons/all.svg";
import {
  addNewComment,
  removeAllComments,
  putCommentLast,
} from "../../redux/comment/comment.actions";
const FullPost = ({
  token,
  user,
  setPageType,
  addBookmark,
  removeBookmark,
  bookmark,
  hide,
  addToHideUser,
  removeToHideUser,
  setComments,
  pinnedPost,
  setPinnedPost,
  comments,
  updatedComment,
  putCommentLast,
}) => {
  const { t } = useTranslation(["common"]);
  const { id } = useParams();
  const navigate = useNavigate();
  const [postData, setPostData] = React.useState(null);
  const [postId, setPostId] = React.useState("");
  const [post, setPost] = React.useState(null);
  const [page, setPage] = React.useState(1);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isPageLoading, setIsPageLoading] = React.useState(false);
  // Post pinned state
  const [openPinnedModal, setOpenPinnedModal] = React.useState(false);
  const [hasPinned, setHasPinned] = React.useState(0);
  const [postDelete, setPostDelete] = React.useState(false);
  const [width, setWidth] = React.useState("");
  const [sortedBy, setSortedBy] = React.useState("new");

  // Post bookmark state
  const [openBookModal, setOpenBookModal] = React.useState(false);
  // Post hide state
  const [openHideModal, setOpenHideModal] = React.useState(false);
  // Post Delete state
  const [openDeleteModal, setOpenDeleteModal] = React.useState(false);

  const [openEditModal, setOpenEditModal] = React.useState(false);
  const [selectPost, setSelectPost] = React.useState(null);
  const [editText, setEditText] = React.useState("");
  const [openShareModal, setOpenShareModal] = React.useState(false);
  const [content, setContent] = React.useState("");
  const [isToxic, setIsToxic] = React.useState(false);
  const [nftModal, setNftModal] = React.useState(false);
  // const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(5);
  const componentRef = React.createRef(null);
  const [myComments, setMyComments] = React.useState([]);

  React.useLayoutEffect(() => {
    setPageType("full_post_view");
  });

  // *** Fetch full post
  // React.useEffect(() => {
  //   axios
  //     .get(
  //       `${process.env.REACT_APP_URL_LINK}api/posts/full/${id}?page=${page}`,
  //       {
  //         headers: { Authorization: "Bearer " + token },
  //       }
  //     )
  //     .then((res) => {
  //       console.log(res.data.bins);
  //       setPostData(res.data.bins);
  //       setHasPinned(res.data.bins.pinned);
  //       setPostDelete(res.data.bins.isDelete);
  //       setContent(res.data.bins.content);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // }, [token, user, id, page, pinnedPost]);

  React.useEffect(() => {
    setIsPageLoading(true);
    setTimeout(() => {
      setIsPageLoading(false);
    }, 1000);
  }, []);

  const handleClick = (value, id, data) => {
    if (value === "pin") {
      setPostId(id);
      setOpenPinnedModal(true);
    } else if (value === "profile") {
      navigate(`/user/profile/${postData.u_dun}`);
    } else if (value === "book") {
      setPostId(id);
      setOpenBookModal(true);
    } else if (value === "hide") {
      setPostId(id);
      setOpenHideModal(true);
    } else if (value === "unhide") {
      setPostId(id);
      setOpenHideModal(true);
    } else if (value === "spam") {
      // handlePostSpamHandler(id)
    } else if (value === "share") {
      if (postData.id === id) {
        setPost(postData);
      }
      setOpenShareModal(true);
      setPostId(id);
    } else if (value === "comment") {
      setPostId(id);
      // setOpenCommentModal(true)
    } else if (value === "delete") {
      setPostId(id);
      setOpenDeleteModal(true);
    } else if (value === "analytics") {
      // alert(id);
      navigate(`/post/analytics/${id}`);
    } else if (value === "edit") {
      setPost(data);
      setOpenEditModal(true);
      setSelectPost(data);
      setEditText(data.content);
      setPostId(data.id);
    } else if (value === "likeList") {
      setOpenLikeList(true);
      setPostId(id);
      fetchUserLike();
    } else if (value === "visit") {
      navigate(`/user/profile/${data.u_dun}`);
    } else if (value === "post_body") {
      // alert(id)
      navigate(`/full/post/view/${id}`);
    } else if (value === "nft") {
      setNftModal(true);
      setPostId(id);
    }
  };

  // *** Pinned post handle
  const pinnedPostHandler = () => {
    setIsLoading(true);
    if (hasPinned === 0) {
      setHasPinned((prev) => prev + 1);
    } else {
      setHasPinned((prev) => prev - 0);
    }
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    var raw = "";

    var requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(
      `${process.env.REACT_APP_URL_LINK}api/posts/pinned/${postId}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        // setPinnedPost(result);
        setPostId("");
        setOpenPinnedModal(false);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log("error", error);
        setPostId("");
        setOpenPinnedModal(false);
      });
  };

  // *** Handle bookmark post
  const handleBookmarkPost = () => {
    setIsLoading(true);
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
    fetch(
      `${process.env.REACT_APP_URL_LINK}api/posts/bookmark/${postId}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        setPinnedPost(result);
        console.log(result);
        setOpenBookModal(false);
        setPostId("");
        setIsLoading(false);
      })
      .catch((error) => {
        setOpenBookModal(false);
        setPostId("");
        console.log(error);
      });
  };

  // *** Handle hide post
  const handleHidePost = () => {
    setIsLoading(true);
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    var requestOptions = {
      method: "PUT",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      `${process.env.REACT_APP_URL_LINK}api/posts/hide/${postId}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        setPinnedPost(result);
        setOpenHideModal(false);
        setIsLoading(false);
      })
      .catch((error) => console.log("error", error));
  };

  // *** Delete Post
  const handleDeletePost = () => {
    setPostDelete(true);
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
    fetch(
      `${process.env.REACT_APP_URL_LINK}api/posts/delete/${postId}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        setPinnedPost(result.postData);
        setOpenDeleteModal(false);
        // setPostDelete(true);
        setPostId("");
        // toast.success(result.msg)
      })
      .catch((error) => {
        console.log("error", error);
        // setPostDelete(false);
      });
  };

  // *** Edit post
  const handleEditPost = () => {
    var axios = require("axios");
    var data = JSON.stringify({
      editText: editText,
    });

    var config = {
      method: "put",
      url: `${process.env.REACT_APP_URL_LINK}api/posts/edit/${postId}`,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
        setPostId("");
        setEditText("");
        setOpenEditModal(false);
        setPinnedPost(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  React.useEffect(() => {
    setWidth(window.innerWidth);
  }, [width]);

  const onClose = () => {
    setPinnedPost(null);
    setOpenPinnedModal(false);
    setOpenBookModal(false);
    setOpenHideModal(false);
    setOpenEditModal(false);
    setOpenDeleteModal(false);
    setOpenShareModal(false);
    setNftModal(false);
  };

  // *** Post share handler
  const handleRepostWithQuoteHandler = () => {
    var axios = require("axios");
    var data = JSON.stringify({
      content: content,
    });

    var config = {
      method: "post",
      url: `${process.env.REACT_APP_URL_LINK}api/posts/repost/status/${postId}`,
      headers: {
        Authorization: "Berar " + token,
        "Content-Type": "application/json",
      },
      data: data,
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

  const handleChange = (e) => {
    setContent(e.target.value.slice(0, 100));
  };

  // *** Create post image for nft
  const createNft = () => {
    // exportComponentAsJPEG(componentRef);
    navigate(`/post/nft/${postId}`);
  };

  // *** Fetch comments
  const fetchComments = async () => {
    // if (likeCount === 0) {
    //   addEmojiLike(postId);
    //   setLikeCount((prev) => prev + 1);
    // }

    if (page === 1) {
      console.log("Page 1 comment");
      const res = await Promise.all([
        axios.get(
          `${process.env.REACT_APP_URL_LINK}api/posts/my_comment/${id}?sortedBy=${sortedBy}&page=${page}&limit=${limit}`,
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        ),
        axios.get(
          `${process.env.REACT_APP_URL_LINK}api/posts/comment/${id}?sortedBy=${sortedBy}&page=${page}&limit=${limit}`,
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        ),
      ]);

      const data = res.map((res) => res.data);
      console.log(data);
      setMyComments(data[0]);
      setComments(data[1]);
      // setFetchPostCount(data[1].length);
    } else {
      var myHeaders = new Headers();
      myHeaders.append("Authorization", "Bearer " + token);
      var requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };
      fetch(
        `${process.env.REACT_APP_URL_LINK}api/posts/comment/${id}?sortedBy=${sortedBy}&page=${page}&limit=${limit}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          console.log(result);
          // setFetchPostCount(result.length);
          if (result.length > 0) {
            putCommentLast(result);
          } else {
            console.log("*** NOT ***");
          }
        })
        .catch((error) => console.log("error", error));
    }
  };

  React.useEffect(() => {
    fetchComments();
  }, [postId, page, updatedComment, sortedBy]);

  return (
    <MainLayout title='Full post'>
      <>
        {isPageLoading ? (
          <>Loading...</>
        ) : (
          <>
            {postData ? (
              <>
                {!postDelete && (
                  <div className='social_full_post'>
                    {nftModal && (
                      <CustomModal
                        onClose={onClose}
                        title={"Create nft"}
                        body={t("Do you want to create nft for this post?")}
                        footer={
                          <div>
                            <button className='update_btn' onClick={createNft}>
                              {isLoading ? (
                                <ImSpinner2 className='spinner' />
                              ) : (
                                <>{t("Make nft")}</>
                              )}
                            </button>
                          </div>
                        }
                      />
                    )}
                    {/* Post pinned modal */}
                    {openPinnedModal && (
                      <CustomModal
                        onClose={onClose}
                        title={
                          hasPinned > 0 ? (
                            <>{t("Unpinned post")}</>
                          ) : (
                            <>{t("Pinned post")}</>
                          )
                        }
                        body={
                          hasPinned > 0 ? (
                            <>{t("Do you want to unpinned this post?")}</>
                          ) : (
                            <>{t("Do you want to pinned this post?")}</>
                          )
                        }
                        footer={
                          <div>
                            <button
                              className='update_btn'
                              onClick={pinnedPostHandler}>
                              {isLoading ? (
                                <ImSpinner2 className='spinner' />
                              ) : (
                                <>
                                  {hasPinned > 0 ? (
                                    <>{t("Unpin")}</>
                                  ) : (
                                    <>{t("Pin")}</>
                                  )}
                                </>
                              )}
                            </button>
                          </div>
                        }
                      />
                    )}
                    {/* Post bookmark modal */}
                    {openBookModal && (
                      <CustomModal
                        onClose={onClose}
                        title={
                          postData.book.includes(user.handleUn) ? (
                            <>{t("Remove post")}</>
                          ) : (
                            <>{t("Bookmark post")}</>
                          )
                        }
                        body={
                          postData.book.includes(user.handleUn) ? (
                            <>{t("Do you want to remove this post")}</>
                          ) : (
                            <>{t("Do you want to Save this post")}</>
                          )
                        }
                        footer={
                          <div className='modal_footer_section'>
                            <button
                              className='update_btn'
                              onClick={handleBookmarkPost}>
                              {isLoading ? (
                                <ImSpinner2 className='spinner' />
                              ) : (
                                <>
                                  {postData.book.includes(user.handleUn) ? (
                                    <>{t("Remove")}</>
                                  ) : (
                                    <>{t("Bookmark")}</>
                                  )}
                                </>
                              )}
                            </button>
                          </div>
                        }
                      />
                    )}
                    {/* Post hide modal */}
                    {openHideModal && (
                      <CustomModal
                        onClose={onClose}
                        title={
                          postData.hide.includes(user.handleUn) ? (
                            <>{t("Unhide post")}</>
                          ) : (
                            <>{t("Hide post")}</>
                          )
                        }
                        body={
                          postData.hide.includes(user.handleUn) ? (
                            <>{t("Do you want to unhide this post")}</>
                          ) : (
                            <>{t("Do you want to hide this post")}</>
                          )
                        }
                        footer={
                          <div className='modal_footer_section'>
                            <button
                              className='update_btn'
                              onClick={handleHidePost}>
                              {isLoading ? (
                                <ImSpinner2 className='spinner' />
                              ) : (
                                <>
                                  {postData.hide.includes(user.handleUn) ? (
                                    <>{t("Unhide")}</>
                                  ) : (
                                    <>{t("Hide")}</>
                                  )}
                                </>
                              )}
                            </button>
                          </div>
                        }
                      />
                    )}
                    {/* Post Edit modal */}
                    {openEditModal && (
                      <CustomModal
                        onClose={onClose}
                        title='Edit post'
                        body={
                          <div className='edit_modal_section'>
                            <textarea
                              className='textarea_modal'
                              placeholder='Enter quote'
                              value={editText}
                              onChange={(e) =>
                                setEditText(e.target.value.slice(0, 100))
                              }></textarea>
                          </div>
                        }
                        footer={
                          <div className='modal_footer_section'>
                            <button
                              className='post_modal_btn'
                              onClick={handleEditPost}>
                              {isLoading ? (
                                <ImSpinner2 className='spinner' />
                              ) : (
                                <>{t("Edit")}</>
                              )}
                            </button>
                          </div>
                        }
                      />
                    )}

                    {/* Post delete modal */}
                    {openDeleteModal && (
                      <CustomModal
                        onClose={onClose}
                        title={<>{t("Delete post")}</>}
                        body={<>{t("Do you want to delete this post")}</>}
                        footer={
                          <div className='modal_footer_section'>
                            <button
                              className='update_btn delete_btn'
                              onClick={handleDeletePost}>
                              {isLoading ? (
                                <ImSpinner2 className='spinner' />
                              ) : (
                                <>{t("Delete")}</>
                              )}
                            </button>
                          </div>
                        }
                      />
                    )}

                    {/* Share modal */}
                    {openShareModal && (
                      <CustomModal
                        title='Repost'
                        onClose={onClose}
                        body={
                          <div className='modal_body_section'>
                            <textarea
                              type='text'
                              placeholder={t("share_placeholder")}
                              className='modal_textarea'
                              value={content}
                              onChange={(e) => handleChange(e)}></textarea>
                            <div className='social_media_post_card'>
                              <div className='social_media_post_card_header'>
                                <img
                                  src={post.u_img ? post.u_img : UserAvatar}
                                  className='posted_user_avatar'
                                  id='profile'
                                />
                                {/* Post creator personal info */}
                                <div className='post_creator_info'>
                                  <>
                                    {/* creator name */}
                                    <span className='creator_name' id='profile'>
                                      {postData.u_fn} {post.u_ln}
                                    </span>
                                    {/* creator username */}
                                    <span className='creator_username'>
                                      @{post.u_dun}
                                    </span>
                                  </>
                                  <div className='post_basic_info'>
                                    {/* post privacy section */}
                                    <span className='post_privacy'>
                                      {postData.privacy === "Public" ? (
                                        <AllIcon className='post_icon' />
                                      ) : (
                                        <>
                                          {postData.privacy === "follower" ? (
                                            <span class='icon-followers'></span>
                                          ) : (
                                            <span class='icon-only_me'></span>
                                          )}
                                        </>
                                      )}
                                    </span>

                                    {/* post paid promotion */}
                                    <span className='post_paid_section'>
                                      {postData.isPaid === "true" && (
                                        <span className='paid_promotion'>
                                          Paid promotion with
                                          <Link
                                            to={`/group/${postData.blockId}`}
                                            className='cmpny_name'>
                                            {postData.cName}
                                          </Link>
                                        </span>
                                      )}
                                    </span>
                                  </div>
                                  {/* post feelings */}
                                  <div className='post_feelings'>
                                    {postData.feelingIcon}
                                    <span className='post_feelings_text'>
                                      {postData.feeling}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className='post_card_body' id='post_body'>
                                <span className='main_body_text' id='post_body'>
                                  {post.content.split(" ").map((val, index) => (
                                    <span
                                      id='post_body'
                                      key={index}
                                      className={
                                        val.includes("#") ? "trend_tag" : ""
                                      }>
                                      {val}{" "}
                                    </span>
                                  ))}
                                </span>
                                <br />
                                {post.image && (
                                  <img
                                    src={post.image}
                                    className='post_card__body_image'
                                    id='post_body'
                                  />
                                )}
                                {post.gif && (
                                  <img
                                    src={post.gif}
                                    className='post_card__body_image'
                                    id='post_body'
                                  />
                                )}
                              </div>
                            </div>
                          </div>
                        }
                        footer={
                          <div className='modal_footer'>
                            <button
                              className='update_btn'
                              onClick={handleRepostWithQuoteHandler}>
                              Share
                            </button>
                          </div>
                        }
                      />
                    )}

                    {/* Pinned post icon */}
                    {hasPinned > 0 && (
                      <div>
                        <span class='icon-pinned_one'></span>
                      </div>
                    )}

                    {/* Bookmark post */}
                    {postData.book.includes(user.handleUn) && (
                      <span class='icon-bookmark_one'></span>
                    )}

                    {/* Share container */}
                    {postData.is_share && (
                      <div className='share_container'>
                        <div className='social_post_main_header'>
                          <div className='social_media_post_card_header'>
                            <img
                              src={
                                postData.share.u_img
                                  ? postData.share.u_img
                                  : UserAvatar
                              }
                              className='posted_user_avatar'
                              id='profile'
                            />
                            {/* Post creator personal info */}
                            <div className='post_creator_info'>
                              <>
                                {/* creator name */}
                                <span className='creator_name' id='profile'>
                                  {width <= 506 &&
                                  postData.share.u_fn.length > 9 ? (
                                    <>
                                      {postData.share.u_fn.slice(0, 9) + ".."}
                                    </>
                                  ) : (
                                    <>{postData.share.u_fn}</>
                                  )}{" "}
                                  {width <= 506 &&
                                  postData.share.u_ln.length > 5 ? (
                                    <>
                                      {postData.share.u_ln.slice(0, 5) + "..."}
                                    </>
                                  ) : (
                                    <>{postData.share.u_ln}</>
                                  )}
                                </span>
                                {/* creator username */}
                                <span className='creator_username'>
                                  @
                                  {width <= 506 &&
                                  postData.share.u_dun.length > 11 &&
                                  postData.share.u_dun.length > 5 ? (
                                    <>
                                      {postData.share.u_dun.slice(0, 11) +
                                        "..."}
                                    </>
                                  ) : (
                                    <>{postData.share.u_dun}</>
                                  )}
                                </span>
                              </>
                            </div>
                          </div>
                          <Menu
                            menuButton={
                              <MenuButton className={"social_post_menu_button"}>
                                <span class='icon-more'></span>
                              </MenuButton>
                            }>
                            {/* Hide post menu button */}
                            {
                              <MenuItem
                                id='hide'
                                className={"social_post_menu_item"}>
                                <>{t("Hide")}</>
                              </MenuItem>
                            }

                            {postData.share.u_dun === user.handleUn && (
                              <MenuItem
                                id='delete'
                                className={"social_post_menu_item"}>
                                {t("Delete")}
                              </MenuItem>
                            )}
                          </Menu>
                        </div>
                        <div className='post_card_body' id='post_body'>
                          <span className='main_body_text' id='post_body'>
                            {postData.share.content
                              .split(" ")
                              .map((val, index) => (
                                <span
                                  id='post_body'
                                  key={index}
                                  className={
                                    val.includes("#") ? "trend_tag" : ""
                                  }>
                                  {val}{" "}
                                </span>
                              ))}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Header */}
                    <div className='social_post_main_header'>
                      <div className='social_media_post_card_header'>
                        <img
                          src={postData.u_img ? postData.u_img : UserAvatar}
                          className='posted_user_avatar'
                          id='profile'
                        />

                        {/* Post creator personal info */}
                        <div className='post_creator_info'>
                          <>
                            {/* creator name */}
                            <span className='creator_name' id='profile'>
                              {width <= 506 && postData.u_fn.length > 9 ? (
                                <>{postData.u_fn.slice(0, 9) + ".."}</>
                              ) : (
                                <>{postData.u_fn}</>
                              )}{" "}
                              {width <= 506 && postData.u_ln.length > 5 ? (
                                <>{postData.u_ln.slice(0, 5) + "..."}</>
                              ) : (
                                <>{postData.u_ln}</>
                              )}
                            </span>
                            {/* creator username */}
                            <span className='creator_username'>
                              @
                              {width <= 506 &&
                              postData.u_dun.length > 11 &&
                              postData.u_dun.length > 5 ? (
                                <>{postData.u_dun.slice(0, 11) + "..."}</>
                              ) : (
                                <>{postData.u_dun}</>
                              )}
                            </span>
                            {/* Post create time */}
                            <span className='creator_time'>
                              {timeDifference(
                                new Date().getTime(),
                                Number(postData.c_t)
                              )}
                            </span>
                          </>
                        </div>
                      </div>
                      {!postData.is_share && (
                        <Menu
                          menuButton={
                            <MenuButton className={"social_post_menu_button"}>
                              <span class='icon-more'></span>
                            </MenuButton>
                          }>
                          {/* Pinned post menu button */}
                          {postData.u_dun === user.handleUn && (
                            <MenuItem
                              id='pin'
                              className={"social_post_menu_item"}>
                              {hasPinned > 0 ? (
                                <>{t("Unpin")}</>
                              ) : (
                                <>{t("Pin")}</>
                              )}
                            </MenuItem>
                          )}
                          {/* Bookmark post menu button */}
                          {
                            <MenuItem
                              id='book'
                              className={"social_post_menu_item"}>
                              {postData.book.includes(user.handleUn) ? (
                                <>{t("Remove")}</>
                              ) : (
                                <>{t("Save")}</>
                              )}
                            </MenuItem>
                          }
                          {/* Hide post menu button */}
                          {
                            <MenuItem
                              id='hide'
                              className={"social_post_menu_item"}>
                              <>{t("Hide")}</>
                            </MenuItem>
                          }
                          {/* Post analytics menu */}
                          {postData.u_dun === user.handleUn && (
                            <MenuItem
                              id='analytics'
                              className={"social_post_menu_item"}>
                              {t("Analytics")}
                            </MenuItem>
                          )}

                          {postData.u_dun === user.handleUn && (
                            <MenuItem
                              id='edit'
                              className={"social_post_menu_item"}>
                              {t("Edit")}
                            </MenuItem>
                          )}

                          {postData.u_dun === user.handleUn && (
                            <MenuItem
                              id='nft'
                              className={"social_post_menu_item"}>
                              {t("Make nft")}
                            </MenuItem>
                          )}

                          <MenuItem
                            id='share'
                            className={"social_post_menu_item"}>
                            <>{t("Share")}</>
                          </MenuItem>

                          {postData.u_dun === user.handleUn && (
                            <MenuItem
                              id='delete'
                              className={"social_post_menu_item"}>
                              {t("Delete")}
                            </MenuItem>
                          )}
                        </Menu>
                      )}
                    </div>

                    {/* Post card body */}
                    {postData.isDisable ? (
                      <div className='post_card_body post_disable_body'>
                        <div className='loader_stick'></div>
                        <div className='loader_stick'></div>
                      </div>
                    ) : (
                      <div className={"post_card_body"} id='post_body'>
                        <span className='main_body_text' id='post_body'>
                          {postData.content.split(" ").map((val, index) => (
                            <span
                              id='post_body'
                              key={index}
                              className={val.includes("#") ? "trend_tag" : ""}>
                              {val.includes("@") ? (
                                <Link
                                  to={`/user/profile/${checkMention(val)}`}
                                  className='mentions'>
                                  {" "}
                                  @{checkMention(val)}
                                </Link>
                              ) : (
                                <>
                                  {val.includes("$") ? (
                                    <Link
                                      to={`/user/profile/${checkCryptoMention(
                                        val
                                      )}`}
                                      className='crypto_mentions'>
                                      {" "}
                                      ${checkCryptoMention(val)}
                                    </Link>
                                  ) : (
                                    <>{val} </>
                                  )}
                                </>
                              )}
                            </span>
                          ))}
                        </span>
                        <br />
                        {postData.image && (
                          <img
                            src={`${process.env.REACT_APP_PUBLIC_URL}${postData.image}`}
                            className='post_card__body_image'
                            id='post_body'
                          />
                        )}
                        {postData.gif && (
                          <img
                            src={postData.gif}
                            className='post_card__body_image'
                            id='post_body'
                          />
                        )}
                        {postData.video && (
                          // <img   id="post_body" />
                          <video
                            controls
                            autoPlay
                            className='post_card__body_image'>
                            <source src={postData.video} />
                          </video>
                        )}
                      </div>
                    )}

                    <div className='social_full_post_footer'>
                      {/* Footer */}
                      <>
                        {/* Post card footer */}
                        {postData.postOf === "np" ? (
                          <NormalPostCardFooter
                            postData={postData}
                            setPage={setPage}
                            myComments={myComments}
                          />
                        ) : (
                          <>
                            {postData.postOf === "news" ? (
                              <NewsPostCardFooter postData={postData} />
                            ) : (
                              <>
                                {postData.postOf === "anc" ? (
                                  <AnnouncementPostCardFooter
                                    postData={postData}
                                    setPage={setPage}
                                  />
                                ) : (
                                  <InformationPostCardFooter
                                    postData={postData}
                                    setPage={setPage}
                                  />
                                )}
                              </>
                            )}
                          </>
                        )}
                      </>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className='empty_full_post'>No post available</div>
            )}
          </>
        )}
      </>
    </MainLayout>
  );
};

const mapStateToProps = (state) => ({
  user: state.user.user,
  token: state.user.token,
  bookmark: state.user.bookmark,
  hide: state.user.hide,
  comments: state.comment.comments,
  pinnedPost: state.post.pinnedPost,
  comments: state.comment.comments,
  updatedComment: state.comment.updateComment,
});

const mapDispatchToProps = (dispatch) => ({
  setPageType: (type) => dispatch(setPageType(type)),
  setPinnedPost: (post) => dispatch(setNewPinnedPost(post)),
  addBookmark: (data) => dispatch(addBookmark(data)),
  removeBookmark: (data) => dispatch(removeBookmark(data)),
  addToHideUser: (data) => dispatch(addToHideUser(data)),
  removeToHideUser: (data) => dispatch(removeToHideUser(data)),

  setComments: (data) => dispatch(addNewComment(data)),
  removeAllComments: (data) => dispatch(removeAllComments(data)),
  removeAllReply: (data) => dispatch(removeAllReply(data)),
  putCommentLast: (data) => dispatch(putCommentLast(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(FullPost);
