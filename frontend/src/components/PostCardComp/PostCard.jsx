/** @format */

import React from "react";
import { useTranslation } from "react-i18next";
import { setPageType } from "../../redux/page/page.actions";
import { Menu, MenuItem, MenuButton, SubMenu } from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";
import UserAvatar from "../../Assets/userAvatar.webp";
import { Link } from "react-router-dom";
import { ImSpinner2 } from "react-icons/im";
import CustomModal from "../modal/CustomModal";
// import {
//   setNewPinnedPost,
//   // updatePost,
//   newPosts,
// } from "../../redux/post/post.actions";
// import {
//   addToSpam,
//   removeToSpam,
//   addEmojiLike,
//   removeEmojiLike,
//   addEmojiDislike,
//   removeEmojiDislike,
//   addEmojiHeart,
//   removeEmojiHeart,
//   addEmojParty,
//   removeEmojiParty,
//   addEmojHaha,
//   removeEmojiHaha,
//   addFollower,
//   removeFollower,
// } from "../../redux/user/user.actions";
import { addNewComment } from "../../redux/postComment/comment.actions";
import { useNavigate } from "react-router-dom";
import { ReactComponent as AllIcon } from "../../Assets/Icons/all.svg";

import NormalPostCardFooter from "./NormalPostCardFooter";
import NewsPostCardFooter from "./NewsPostCardFooter";
import AnnouncementPostCardFooter from "./AnnouncementPostCardFooter";
import InformationPostCardFooter from "./InformationPostCardFooter";
import timeDifference from "../../utils/getCreateTime";
import { checkMention, checkCryptoMention } from "../../utils/checkMensionUser";
import { BiArrowBack } from "react-icons/bi";
import { MdLocationOn } from "react-icons/md";
import CustomPostFormModal from "../modal/CustomPostForm";
import { useSocket, socket, isSocketConnected } from "../../socket/socket";
import axios from "axios";
import FullPostComp from "../FullPostComp/FullPostComp";
import { BsFillPinAngleFill } from "react-icons/bs";
import { BiRadioCircle, BiRadioCircleMarked } from "react-icons/bi";
import FullPostLoader from "../SkeletonLoading/FullPostLoader";

/**Toolkit */
import { useSelector, useDispatch } from "react-redux";
import { selectPosts } from "../../redux/_post/postSelectors";
import {
  selectUser,
  selectToken,
  selectFollowing,
} from "../../redux/_user/userSelectors";
import { handleFollowUser } from "../../redux/_user/userSlice";
import {
  updatePinnedPost,
  updateBookmarkPost,
  updateHidePost,
  setPinnedPost,
  updateSocialPost,
  updateDeletePost,
  updatePostSharePrivacy,
  updatePostCommentPrivacy,
  updateSharePost,
  handleFetchFullPost,
} from "../../redux/_post/postSlice";
import {
  AiOutlinePushpin,
  AiOutlineEdit,
  AiOutlineDelete,
  AiOutlineShareAlt,
} from "react-icons/ai";
import { BsBookmark } from "react-icons/bs";
import { MdOutlineHideSource, MdOutlinePrivacyTip } from "react-icons/md";
import { BiBitcoin } from "react-icons/bi";
import { GrAnalytics } from "react-icons/gr";

const PostCard = ({ postData }) => {
  const dispatch = useDispatch();
  const isPost = useSelector(selectPosts);
  const isToken = useSelector(selectToken);
  const user = useSelector(selectUser);
  const following = useSelector(selectFollowing);

  const navigate = useNavigate();
  const { t } = useTranslation(["common"]);
  const [postId, setPostId] = React.useState("");
  const [post, setPost] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);
  // Post pinned state
  const [openPinnedModal, setOpenPinnedModal] = React.useState(false);
  const [hasPinned, setHasPinned] = React.useState(postData.pinned || 0);
  // Post Delete state
  const [postDelete, setPostDelete] = React.useState(
    postData.isDelete || false
  );
  // Post bookmark state
  const [openBookModal, setOpenBookModal] = React.useState(false);
  // Post hide state
  const [openHideModal, setOpenHideModal] = React.useState(false); // Post Delete state
  const [openDeleteModal, setOpenDeleteModal] = React.useState(false);
  const [width, setWidth] = React.useState("");

  // Post edit modal
  const [openEditModal, setOpenEditModal] = React.useState(false);
  const [selectPost, setSelectPost] = React.useState(null);
  const [editText, setEditText] = React.useState("");
  const [openShareModal, setOpenShareModal] = React.useState(false);
  const [content, setContent] = React.useState("");
  const [isToxic, setIsToxic] = React.useState(false);
  const [nftModal, setNftModal] = React.useState(false);
  const [openFullPostModal, setOpenFullPostModal] = React.useState(false);
  const [myComments, setMyComments] = React.useState([]);
  const [fullpostData, setFullPostData] = React.useState(null);
  const componentRef = React.createRef(null);
  const [activeTab, setActiveTab] = React.useState("one");
  const [openPrivacyMenu, setOpenPrivacyMenu] = React.useState(false);
  const [commentPrivacy, setCommentPrivacy] = React.useState(
    postData.cmnt_prv || "all"
  );
  const [sharePrivacy, setSharePrivacy] = React.useState(
    postData.shr_prv || "all"
  );
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(5);

  // comment code
  const [cmntPage, setCmntPage] = React.useState(1);
  const [cmntLimit, setCmntLimit] = React.useState(5);
  const [commentsData, setCommentsData] = React.useState([]);

  const [collectId, setCollectId] = React.useState("");
  const [isModalLoading, setIsModalLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [bookmark, setBookmark] = React.useState(postData.book || []);

  useSocket();

  // socket.emit("block message", result);

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
      setPost(data);
      setOpenShareModal(true);
      setPostId(id);
    } else if (value === "comment") {
      setPostId(id);
      fetchComments();
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
      setOpenFullPostModal(true);
      fetchFullPost(id);
    } else if (value === "nft") {
      setNftModal(true);
      setPostId(id);
    } else if (value === "privacy") {
      setOpenPrivacyMenu(true);
      setPostId(id);
    }
  };

  // *** Pinned post handle
  const pinnedPostHandler = async () => {
    setIsLoading(true);
    // updating useState here
    if (!hasPinned) {
      setHasPinned((prev) => prev + 1);
    } else {
      setHasPinned((prev) => prev - 1);
    }
    const data = { postId, isToken };
    // from here we call the postSlice method
    const post = await dispatch(updatePinnedPost(data));
    try {
      console.log("TRY: ", post);
      if (post.status === 200) {
        setPostId("");
        setOpenPinnedModal(false);
        setIsLoading(false);
      } else {
        setError("Something went wrong");
      }
    } catch (error) {
      setError("Something went wrong");
    }
  };

  // *** Handle bookmark post
  const handleBookmarkPost = async () => {
    // updating useState here
    if (bookmark.includes(user.handleUn)) {
      const arr = bookmark;
      const temp = arr.filter((data) => data !== user.handleUn);
      setBookmark(temp);
    } else {
      setBookmark((prev) => [...prev, user.handleUn]);
    }
    const data = { isToken, postId };
    // from here we call the postSlice method
    const post = await dispatch(updateBookmarkPost(data));
    try {
      console.log("TRY: ", post);
      if (post.status === 200) {
        setOpenBookModal(false);
        setPostId("");
        setIsLoading(false);
      } else {
        setError("Something went wrong");
        const arr = bookmark;
        const temp = arr.filter((data) => data !== user.handleUn);
        setBookmark(temp);
      }
    } catch (error) {
      setError("Something went wrong");
      const arr = bookmark;
      const temp = arr.filter((data) => data !== user.handleUn);
      setBookmark(temp);
    }
  };

  // *** Handle hide post
  const handleHidePost = async () => {
    setIsLoading(true);
    const data = { isToken, postId };
    // from here we call the postSlice method
    const post = await dispatch(updateHidePost(data));
    dispatch(setPinnedPost(post));
    setOpenHideModal(false);
    setIsLoading(false);
  };

  // *** Delete Post
  const handleDeletePost = async () => {
    setPostDelete(true);
    const data = { isToken, postId };
    const post = await dispatch(updateDeletePost(data));
    dispatch(setPinnedPost(post));
    setOpenDeleteModal(false);
  };

  // *** Edit post
  const handleEditPost = async () => {
    const data = { editText, isToken, postId };
    const post = await dispatch(updateSocialPost(data));
    dispatch(setPinnedPost(post));
    setPostId("");
    setEditText("");
    setOpenEditModal(false);
  };

  // **** Handle update of post comment privacy
  const updateCommentPrivacy = async (value) => {
    const data = { isToken, postId, commentPrivacy: value };
    const post = await dispatch(updatePostCommentPrivacy(data));
    setPinnedPost(post);
    setSharePrivacy(value);
    setOpenPrivacyMenu(false);
  };

  // **** Handle update of post share privacy
  const updateSharePrivacy = async (value) => {
    const data = { isToken, postId, sharePrivacy: value };
    const post = await dispatch(updatePostSharePrivacy(data));
    setPinnedPost(post);
    setSharePrivacy(value);
    setOpenPrivacyMenu(false);
  };

  React.useEffect(() => {
    setWidth(window.innerWidth);
    console.log(window.innerWidth);
  }, [width]);

  const onClose = () => {
    setOpenPinnedModal(false);
    setOpenBookModal(false);
    setOpenHideModal(false);
    setOpenEditModal(false);
    setOpenDeleteModal(false);
    setOpenShareModal(false);
    setNftModal(false);
    setOpenPrivacyMenu(false);
  };

  // *** Post share handler
  const handleRepostWithQuoteHandler = async () => {
    const data = { isToken, content, originalPost: post, postId };
    const response = await dispatch(updateSharePost(data));
    try {
      setOpenShareModal(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setContent(e.target.value.slice(0, 100));
  };

  // *** Create post image for nft
  const createNft = () => {
    // exportComponentAsJPEG(componentRef);
    navigate(`/post/nft/${postId}`);
  };

  // *** Handle follow
  const handleFollow = (userId) => {
    // notification
    //     if (result.notificationData) {
    //       socket.emit("notification receive", result);
    //     } else {
    //       console.log(result);
    //     }
    const data = { isToken, userId };
    dispatch(handleFollowUser(data));
  };

  const closeCommentModal = () => {
    setOpenFullPostModal(false);
  };

  // *** Fetch comments
  const fetchComments = async () => {
    if (likeCount === 0) {
      addEmojiLike(postId);
      setLikeCount((prev) => prev + 1);
    }

    if (page === 1) {
      const res = await Promise.all([
        axios.get(
          `${process.env.REACT_APP_URL_LINK}api/posts/my_comment/${postId}?sortedBy=${sortedBy}&page=${page}&limit=${limit}`,
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        ),
        axios.get(
          `${process.env.REACT_APP_URL_LINK}api/posts/comment/${postId}?sortedBy=${sortedBy}&page=${page}&limit=${limit}`,
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
      setFetchPostCount(data[1].length);
    } else {
      var myHeaders = new Headers();
      myHeaders.append("Authorization", "Bearer " + token);
      var requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };
      fetch(
        `${process.env.REACT_APP_URL_LINK}api/posts/comment/${postId}?sortedBy=${sortedBy}&page=${page}&limit=${limit}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          console.log(result);
          setFetchPostCount(result.length);
          if (result.length > 0) {
            setComments(result);
          } else {
            console.log("*** NOT ***");
          }
        })
        .catch((error) => console.log("error", error));
    }
  };

  // *** Fetch full post with post comment
  const fetchFullPost = async (id) => {
    setIsModalLoading(true);
    const data = { id, cmntPage, cmntLimit, isToken };
    const result = await dispatch(handleFetchFullPost(data));
    console.log(result);
    setFullPostData(result.post);
    setCommentsData(result.comment);
    setIsModalLoading(false);
  };

  const myPostCardRef = React.useRef(null);

  React.useEffect(() => {
    // setCollectId(myPostCardRef.current.id);
  }, [collectId]);

  return (
    <React.Fragment>
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
            hasPinned > 0 ? <>{t("Unpinned post")}</> : <>{t("Pinned post")}</>
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
              <button className='update_btn' onClick={pinnedPostHandler}>
                {isLoading ? (
                  <ImSpinner2 className='spinner' />
                ) : (
                  <>{hasPinned > 0 ? <>{t("Unpin")}</> : <>{t("Pin")}</>}</>
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
              <button className='update_btn' onClick={handleBookmarkPost}>
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
              <button className='update_btn' onClick={handleHidePost}>
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
              <button className='post_modal_btn' onClick={handleEditPost}>
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

      {/* post privacy modal */}
      {openPrivacyMenu && (
        <CustomPostFormModal
          title={
            <div className='comment_modal_title_section'>
              <div className='cmnt_header_box'>
                <button
                  className='cmnt_modal_back_btn'
                  onClick={() => setOpenPrivacyMenu(false)}>
                  <BiArrowBack />
                  <span>Post privacy settings</span>
                </button>
              </div>
            </div>
          }
          onClose={onClose}
          body={
            <div className={`share_content_section `}>
              {/* Share privacy settings */}
              <div className='modal_privacy_seetings_section'>
                <div className='modal_privacy_seetings_text_section'>
                  <div className='modal_privacy_seetings_title_section'>
                    Share settings
                  </div>
                  <div className='modal_privacy_seetings_subheader_section'>
                    Only selected type of user can only share your post
                  </div>
                </div>

                <div className='privacy_modal_radio_section'>
                  <div
                    className='radio_btn_section'
                    onClick={() => updateSharePrivacy("all")}>
                    {sharePrivacy === "all" ? (
                      <BiRadioCircleMarked className='active_privacy_radio_icon' />
                    ) : (
                      <BiRadioCircle className='privacy_radio_icon' />
                    )}
                    <span className='privacy_radio_text'>All</span>
                  </div>

                  {/* <div className='radio_btn_section'>
                    {sharePrivacy === "flwr" ? (
                      <BiRadioCircleMarked className='active_privacy_radio_icon' />
                    ) : (
                      <BiRadioCircle className='privacy_radio_icon' />
                    )}
                    <span className='privacy_radio_text'>Follower</span>
                  </div> */}

                  <div
                    className='radio_btn_section'
                    onClick={() => updateSharePrivacy("none")}>
                    {sharePrivacy === "none" ? (
                      <BiRadioCircleMarked className='active_privacy_radio_icon' />
                    ) : (
                      <BiRadioCircle className='privacy_radio_icon' />
                    )}
                    <span className='privacy_radio_text'>None</span>
                  </div>
                </div>
              </div>

              {/* Comment privacy settings */}
              <div className='modal_privacy_seetings_section'>
                <div className='modal_privacy_seetings_text_section'>
                  <div className='modal_privacy_seetings_title_section'>
                    Comment settings
                  </div>
                  <div className='modal_privacy_seetings_subheader_section'>
                    Only selected type of user can only comment on your post
                  </div>
                </div>

                <div className='privacy_modal_radio_section'>
                  <div
                    className='radio_btn_section'
                    onClick={() => updateCommentPrivacy("all")}>
                    {commentPrivacy === "all" ? (
                      <BiRadioCircleMarked className='active_privacy_radio_icon' />
                    ) : (
                      <BiRadioCircle className='privacy_radio_icon' />
                    )}
                    <span className='privacy_radio_text'>All</span>
                  </div>

                  {/* <div className='radio_btn_section'>
                    {commentPrivacy === "flwr" ? (
                      <BiRadioCircleMarked className='active_privacy_radio_icon' />
                    ) : (
                      <BiRadioCircle className='privacy_radio_icon' />
                    )}
                    <span className='privacy_radio_text'>Follower</span>
                  </div> */}

                  <div
                    className='radio_btn_section'
                    onClick={() => updateCommentPrivacy("none")}>
                    {commentPrivacy === "none" ? (
                      <BiRadioCircleMarked className='active_privacy_radio_icon' />
                    ) : (
                      <BiRadioCircle className='privacy_radio_icon' />
                    )}
                    <span className='privacy_radio_text'>None</span>
                  </div>
                </div>
              </div>
            </div>
          }
        />
      )}

      {/* Share modal */}
      {openShareModal && (
        <CustomPostFormModal
          title={
            <div className='comment_modal_title_section'>
              <div className='cmnt_header_box'>
                <button
                  className='cmnt_modal_back_btn'
                  onClick={() => setOpenShareModal(false)}>
                  <BiArrowBack />
                  <span>Share post</span>
                </button>
              </div>
            </div>
          }
          onClose={onClose}
          body={
            <div>
              <div className='modal_body_tab'>
                <li
                  onClick={() => setActiveTab("one")}
                  className={
                    activeTab == "one"
                      ? "modal_body_tab_list modal_body_tab_list_active"
                      : "modal_body_tab_list"
                  }>
                  Share with quote
                </li>
                <li
                  onClick={() => setActiveTab("two")}
                  className={
                    activeTab == "two"
                      ? "modal_body_tab_list modal_body_tab_list_active"
                      : "modal_body_tab_list"
                  }>
                  Share with others
                </li>
              </div>

              {activeTab === "one" ? (
                <div className='share_content_section'>
                  <textarea
                    type='text'
                    placeholder={t("share_placeholder")}
                    className='share_post_textarea'
                    value={content}
                    onChange={(e) => handleChange(e)}></textarea>
                  <div className='social_media_post_card'>
                    <div className='social_media_post_card_header'>
                      <img
                        src={
                          postData.u_img
                            ? `${process.env.REACT_APP_GOOGLE_CLOUD_IMAGE_LINK}${postData.u_img}`
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
                            className={val.includes("#") ? "trend_tag" : ""}>
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
              ) : (
                <div>Other social media </div>
              )}
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

      {/* Full post view */}
      {openFullPostModal && (
        <CustomPostFormModal
          title={
            <div className='comment_modal_title_section'>
              <div className='cmnt_header_box'>
                <button
                  className='cmnt_modal_back_btn'
                  onClick={closeCommentModal}>
                  <BiArrowBack />
                  <span>View full post</span>
                </button>
              </div>
            </div>
          }
          body={
            <React.Fragment>
              {isModalLoading ? (
                <FullPostLoader />
              ) : (
                <React.Fragment>
                  {fullpostData ? (
                    <FullPostComp
                      postData={fullpostData}
                      myComments={commentsData}
                      setCmntPage={setCmntPage}
                      cmntPage={cmntPage}
                    />
                  ) : (
                    <div className='empty_post'>No post found</div>
                  )}
                </React.Fragment>
              )}
            </React.Fragment>
          }
        />
      )}

      {postData.hide.includes(user.handleUn) ? (
        <div className='social_media_unhide_post_card'>
          <div className='hide_text'>{t("You hide this post")}</div>
          <div className='unhhide_btn_section'>
            <button
              className='unhide_btn'
              id='unhide'
              onClick={(e) => handleClick(e.target.id, postData.id)}>
              {t("Unhide")}
            </button>
          </div>
        </div>
      ) : (
        <React.Fragment>
          {!postDelete && (
            <div
              ref={myPostCardRef}
              className={`social_media_post_card ${postData.postOf}`}
              id={postData.id}
              onClick={(e) => handleClick(e.target.id, postData.id, postData)}>
              {/* Pinned post icon */}
              {hasPinned > 0 && (
                <div>
                  <BsFillPinAngleFill className='pinned_icon' />
                </div>
              )}
              {/* Bookmark post */}
              {bookmark.includes(user.handleUn) && (
                <span class='icon-bookmark_one'></span>
              )}

              {/* If this is a share post than this part of of code will run */}
              {postData.is_share && (
                <div className='share_container'>
                  <div className='social_post_main_header'>
                    <div className='social_media_post_card_header'>
                      <img
                        src={postData.s_u_img}
                        className='posted_user_avatar'
                        id='profile'
                      />
                      {/* Post creator personal info */}
                      <div className='post_creator_info'>
                        <>
                          {/* creator name */}
                          <span className='creator_name' id='profile'>
                            {width <= 506 && postData.s_u_fn.length > 9 ? (
                              <>{postData.s_u_fn.slice(0, 9) + ".."}</>
                            ) : (
                              <>{postData.s_u_fn}</>
                            )}{" "}
                            {width <= 506 && postData.s_u_ln.length > 5 ? (
                              <>{postData.s_u_ln.slice(0, 5) + "..."}</>
                            ) : (
                              <>{postData.s_u_ln}</>
                            )}
                          </span>
                          {/* creator username */}
                          <span className='creator_username'>
                            @
                            {width <= 506 &&
                            postData.s_u_dun.length > 11 &&
                            postData.s_u_dun.length > 5 ? (
                              <>{postData.s_u_dun.slice(0, 11) + "..."}</>
                            ) : (
                              <>{postData.s_u_dun}</>
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
                        <MenuItem id='hide' className={"social_post_menu_item"}>
                          <div id='hide' className='menu_item_section'>
                            {" "}
                            <MdOutlineHideSource
                              id='hide'
                              className='menu_item_icon'
                            />
                            {t("Hide")}
                          </div>
                        </MenuItem>
                      }

                      {/* Delete share post */}
                      {postData.s_u_dun === user.handleUn && (
                        <MenuItem
                          id='delete'
                          className={"social_post_menu_item"}>
                          <div id='delete' className='menu_item_section'>
                            {" "}
                            <AiOutlineDelete
                              id='delete'
                              className='menu_item_icon'
                            />
                            {t("Delete")}
                          </div>
                        </MenuItem>
                      )}

                      {sharePrivacy === "all" ? (
                        <MenuItem
                          id='share'
                          className={"social_post_menu_item"}>
                          <div id='share' className='menu_item_section'>
                            <AiOutlineShareAlt
                              id='share'
                              className='menu_item_icon'
                            />
                            {t("Share")}
                          </div>
                        </MenuItem>
                      ) : (
                        <>
                          {postData.u_dun !== user.handleUn ? null : (
                            <MenuItem
                              id='share'
                              className={"social_post_menu_item"}>
                              <div id='share' className='menu_item_section'>
                                <AiOutlineShareAlt
                                  id='share'
                                  className='menu_item_icon'
                                />
                                {t("Share")}
                              </div>
                            </MenuItem>
                          )}
                        </>
                      )}
                    </Menu>
                  </div>
                  <div className='post_card_body' id='post_body'>
                    <span className='main_body_text' id='post_body'>
                      {postData.s_content.split(" ").map((val, index) => (
                        <span
                          id='post_body'
                          key={index}
                          className={val.includes("#") ? "trend_tag" : ""}>
                          {val}{" "}
                        </span>
                      ))}
                    </span>
                  </div>
                </div>
              )}

              <div ref={componentRef}>
                {/* Post card header */}
                <div className='social_post_main_header'>
                  <div className='social_media_post_card_header'>
                    <img
                      src={
                        postData.u_img
                          ? `${process.env.REACT_APP_GOOGLE_CLOUD_IMAGE_LINK}${postData.u_img}`
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
                        <br />
                        <span className='status_text'>
                          {postData.statusText}
                        </span>
                      </div>
                      {postData.userLocation && (
                        <div className='post_user_location'>
                          <MdLocationOn className='location_icon' />
                          {postData.userLocation}
                        </div>
                      )}
                      {postData.u_dun !== user.handleUn && (
                        <button
                          className='post_card_flw_btn'
                          onClick={() => handleFollow(postData.u_dun)}>
                          Follow
                        </button>
                      )}
                      {/* post feelings */}
                      <div className='post_feelings'>
                        {postData.feelingIcon}
                        <span className='post_feelings_text'>
                          {postData.feeling}
                        </span>
                      </div>
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
                        <MenuItem id='pin' className={"social_post_menu_item"}>
                          {hasPinned > 0 ? (
                            <div id='pin' className='menu_item_section'>
                              <AiOutlinePushpin
                                id='pin'
                                className='menu_item_icon'
                              />
                              {t("Unpin")}
                            </div>
                          ) : (
                            <div id='pin' className='menu_item_section'>
                              {" "}
                              <AiOutlinePushpin
                                id='pin'
                                className='menu_item_icon'
                              />
                              {t("Pin")}
                            </div>
                          )}
                        </MenuItem>
                      )}
                      {/* Bookmark post menu button */}
                      {
                        <MenuItem id='book' className={"social_post_menu_item"}>
                          {bookmark.includes(user.handleUn) ? (
                            <div id='book' className='menu_item_section'>
                              <BsBookmark
                                id='book'
                                className='menu_item_icon'
                              />
                              {t("Remove")}
                            </div>
                          ) : (
                            <div id='book' className='menu_item_section'>
                              <BsBookmark
                                id='book'
                                className='menu_item_icon'
                              />
                              {t("Save")}
                            </div>
                          )}
                        </MenuItem>
                      }
                      {/* Hide post menu button */}
                      {
                        <MenuItem id='hide' className={"social_post_menu_item"}>
                          <div id='hide' className='menu_item_section'>
                            {" "}
                            <MdOutlineHideSource
                              id='hide'
                              className='menu_item_icon'
                            />
                            {t("Hide")}
                          </div>
                        </MenuItem>
                      }
                      {/* Post analytics menu */}
                      {postData.u_dun === user.handleUn && (
                        <MenuItem
                          id='analytics'
                          className={"social_post_menu_item"}>
                          <div id='analytics' className='menu_item_section'>
                            {" "}
                            <GrAnalytics
                              id='analytics'
                              className='menu_item_icon'
                            />
                            {t("Analytics")}
                          </div>
                        </MenuItem>
                      )}

                      {/* Post edit menu */}
                      {postData.u_dun === user.handleUn && (
                        <MenuItem id='edit' className={"social_post_menu_item"}>
                          <div id='edit' className='menu_item_section'>
                            <AiOutlineEdit
                              id='book'
                              className='menu_item_icon'
                            />
                            {t("Edit")}
                          </div>
                        </MenuItem>
                      )}

                      {/* Post nft menu */}
                      {postData.u_dun === user.handleUn && (
                        <MenuItem id='nft' className={"social_post_menu_item"}>
                          <div id='nft' className='menu_item_section'>
                            {" "}
                            <BiBitcoin id='nft' className='menu_item_icon' />
                            {t("Make nft")}
                          </div>
                        </MenuItem>
                      )}

                      {/* Share menu */}
                      {sharePrivacy === "all" ? (
                        <MenuItem
                          id='share'
                          className={"social_post_menu_item"}>
                          <div id='share' className='menu_item_section'>
                            <AiOutlineShareAlt
                              id='share'
                              className='menu_item_icon'
                            />
                            {t("Share")}
                          </div>
                        </MenuItem>
                      ) : (
                        <>
                          {postData.u_dun !== user.handleUn ? null : (
                            <MenuItem
                              id='share'
                              className={"social_post_menu_item"}>
                              <div id='share' className='menu_item_section'>
                                <AiOutlineShareAlt
                                  id='share'
                                  className='menu_item_icon'
                                />
                                {t("Share")}
                              </div>
                            </MenuItem>
                          )}
                        </>
                      )}

                      {/* Delete post menu */}
                      {postData.u_dun === user.handleUn && (
                        <MenuItem
                          id='delete'
                          className={"social_post_menu_item"}>
                          <div id='delete' className='menu_item_section'>
                            {" "}
                            <AiOutlineDelete
                              id='delete'
                              className='menu_item_icon'
                            />
                            {t("Delete")}
                          </div>
                        </MenuItem>
                      )}

                      {/* privacy settings menu */}
                      {postData.u_dun === user.handleUn && (
                        <MenuItem
                          id='privacy'
                          className={"social_post_menu_item"}>
                          <div id='privacy' className='menu_item_section'>
                            {" "}
                            <MdOutlinePrivacyTip
                              id='privacy'
                              className='menu_item_icon'
                            />
                            {t("Privacy")}
                          </div>
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
              </div>

              {/* Post card footer */}
              {postData.postOf === "np" ? (
                <NormalPostCardFooter
                  postData={postData}
                  setIsToxic={setIsToxic}
                />
              ) : (
                <>
                  {postData.postOf === "news" ? (
                    <NewsPostCardFooter postData={postData} />
                  ) : (
                    <>
                      {postData.postOf === "anc" ? (
                        <AnnouncementPostCardFooter postData={postData} />
                      ) : (
                        <InformationPostCardFooter postData={postData} />
                      )}
                    </>
                  )}
                </>
              )}
            </div>
          )}
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

const mapStateToProps = (state) => ({
  user: state.user.user,
  token: state.user.token,
  posts: state.post.posts,
  pinnedPost: state.post.pinnedPost,
  spamList: state.user.spam,
  following: state.user.following,
  emoji_likes: state.user.emoji_likes,
  emoji_heart: state.user.emoji_heart,
  emoji_haha: state.user.emoji_haha,
  emoji_party: state.user.emoji_party,
  emoji_dislikes: state.user.emoji_dislikes,
  selectComment: state.post.selectComment,
});

const mapDispatchToProps = (dispatch) => ({
  newPosts: (posts) => dispatch(newPosts(posts)),
  putPostsLast: (posts) => dispatch(putPostsLast(posts)),
  // updatePost: (post) => dispatch(updatePost(post)),
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
  addFollower: (data) => dispatch(addFollower(data)),
  removeFollower: (data) => dispatch(removeFollower(data)),
  setComments: (data) => dispatch(addNewComment(data)),
});

export default PostCard;
