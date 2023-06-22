/** @format */

import React, { useEffect, useState } from "react";

//toolkit
import { useSelector, useDispatch } from "react-redux";
import {
  selectPosts,
  selectNotificationPost,
  selectPinnedPost,
  selectCurrentPostCount,
} from "../../redux/_post/postSelectors";
import { selectUser, selectToken } from "../../redux/_user/userSelectors";
import {
  fetchPosts,
  putPostLast,
  addNotificationPost,
  removeNotificationPost,
  removePosts,
} from "../../redux/_post/postSlice";
import { setPageType } from "../../redux/_page/pageSlice";

import { useSocket, socket } from "../../socket/socket";
import { useTranslation } from "react-i18next";
import { Menu, MenuItem, MenuButton, SubMenu } from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";
import PostCard from "../../components/PostCardComp/PostCard";
import PostSkeleton from "../../components/SkeletonLoading/PostSkeleton";
import UserAvatar from "../../Assets/userAvatar.webp";
import { BiUserPlus, BiUserCheck } from "react-icons/bi";
import { BiLoaderAlt } from "react-icons/bi";
import { AiFillCaretDown } from "react-icons/ai";

const data = [
  { name: "Normal Post", id: "np" },
  { name: "News", id: "news" },
  { name: "Announcement", id: "anc" },
  { name: "Information", id: "info" },
];

var ids = [];
var names = [];

const Feed = ({
  token,
  user,
  newPosts,
  scrollHeight,
  putPostsLast,
  setScrollAxis,
  addFollower,
  removeFollower,
  following,
}) => {
  const dispatch = useDispatch();
  const isPost = useSelector(selectPosts);
  const isToken = useSelector(selectToken);
  const isUser = useSelector(selectUser);
  const pinnedPost = useSelector(selectPinnedPost);
  const notificationPost = useSelector(selectNotificationPost);
  const currentPostCount = useSelector(selectCurrentPostCount);

  const { t } = useTranslation(["common"]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = React.useState(false);
  const [type, setType] = React.useState("all");
  const [users, setUsers] = React.useState([]);
  const [limit, setLimit] = React.useState(3);
  const [isLoadingBtn, setIsLoadingBtn] = React.useState(false);
  const [subLoading, setSubLoading] = React.useState(false);

  const [sortedBy, setSortedBy] = React.useState("all");

  const handleDropDownMenu = (val) => {
    // removeAllPosts();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    setSortedBy(val);
    setPage(1);
  };

  const nextPage = () => {
    setPage((prev) => prev + 1);
  };
  useSocket();

  React.useLayoutEffect(() => {
    dispatch(setPageType("social"));
  }, []);

  React.useEffect(() => {
    socket.emit("setup", isUser);
  });

  // *** Fetch posts
  useEffect(() => {
    console.log("This fetch post function call");
    if (isUser.log_un) {
      const postParams = { page, sortedBy, isToken };
      dispatch(fetchPosts(postParams));
      socket.off("feed").on("feed", (data) => {
        // *** If post is mine then directly added otherwise set into notification post
        if (data.u_dun === isUser.handleUn) {
          // dispatch(putPostLast(data));
          console.log("My post notification");
        } else {
          dispatch(addNotificationPost(data));
          console.log("Other post notification");
        }
      });
    }
  }, [isToken, isUser, page, sortedBy, type, pinnedPost]);

  // *** Fetch posts
  useEffect(() => {
    if (Number(localStorage.getItem("page"))) {
      console.log("Previous Page: ", Number(localStorage.getItem("page")));
      setPage(Number(localStorage.getItem("page")));
      localStorage.removeItem("page");
    } else {
      console.log("No page number found");
    }
  }, [page]);

  const handler = (event) => {
    if (!dropRef.current.contains(event.target)) {
      setIsDropDownVisible(false);
    }
  };

  const dropRef = React.useRef();
  useEffect(() => {
    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  });

  // function handleScroll(e) {
  //   let cl = e.currentTarget.clientHeight;
  //   let sy = Math.round(e.currentTarget.scrollTop);
  //   let sh = e.currentTarget.scrollHeight;
  //   if (cl + sy + 1 >= sh) {
  //     // setPage((page) => page + 1);
  //   }
  //   const currentScrollPos = e.target.scrollTop;
  //   console.log("currentScrollPos: ", currentScrollPos);
  //   if (prevScrollDirection < currentScrollPos) {
  //     console.log("Down");
  //     setScrollAxis("Down");
  //   } else {
  //     setScrollAxis("Up");
  //     console.log("UP");
  //   }
  //   setPrevScrollDirection(currentScrollPos);
  // }

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleChangeType = (value) => {
    setType(value);
    dispatch(removePosts());
    setPage(1);
    setUsers([]);
    setSubLoading(true);
    setTimeout(() => {
      setSubLoading(false);
    }, 1000);
  };

  const postRef = React.useRef(null);
  useEffect(() => {
    const currentPostId = localStorage.getItem("postId");
    console.log("currentPostId: ", currentPostId);
    // localStorage.removeItem("postId");

    if (currentPostId) {
      postRef.current?.scrollIntoView({
        behavior: "smooth",
        // block: "end",
        // inline: "nearest",
      });
    }
  });

  const handleFollow = (userId) => {
    if (following && following.includes(userId)) {
      removeFollower(userId);
    } else {
      addFollower(userId);
    }
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + isToken);
    var requestOptions = {
      method: "PUT",
      headers: myHeaders,
      redirect: "follow",
    };
    fetch(
      `${process.env.REACT_APP_URL_LINK}api/users/follow-following/${userId}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        console.log("error", error);
        removeFollower(userId);
      });
  };

  const incrementPage = () => {
    localStorage.removeItem("postId");
    setIsLoadingBtn(true);
    setTimeout(() => {
      setIsLoadingBtn(false);
    }, 1000);
    setPage((prev) => prev + 1);
  };

  const handleReload = () => {
    // window.location.reload();
    dispatch(putPostLast(notificationPost));
    dispatch(removeNotificationPost(notificationPost));
  };

  React.useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleScroll = () => {
    // Your scroll event logic here
    console.log("Scroll position:");
  };

  return (
    <React.Fragment>
      <div className='social_feed_container'>
        {/* Tab container */}
        <div className='feed_tab_container'>
          <li
            onClick={() => handleChangeType("all")}
            className={
              type === "all"
                ? "feed_tab_item active_feed_tab_item"
                : "feed_tab_item"
            }>
            All
          </li>
          <li
            onClick={() => handleChangeType("for_you")}
            className={
              type === "for_you"
                ? "feed_tab_item active_feed_tab_item"
                : "feed_tab_item"
            }>
            For you
          </li>
          <li
            onClick={() => handleChangeType("following")}
            className={
              type === "following"
                ? "feed_tab_item active_feed_tab_item"
                : "feed_tab_item"
            }>
            Following
          </li>
        </div>

        {/* Sorting doropdown menu */}
        <div className='drop_menu_container'>
          <Menu
            menuButton={
              <MenuButton className='feed_sort_button'>
                {/* <AiFillCaretDown className='comment_header_dropdown_icons' /> */}
                <span className='drop_down_text'>
                  {sortedBy === "np" ? (
                    <>Nrmal post</>
                  ) : (
                    <>
                      {sortedBy === "news" ? (
                        <>News</>
                      ) : (
                        <>
                          {sortedBy === "anc" ? (
                            <>Announcement post</>
                          ) : (
                            <>
                              {sortedBy === "info" ? (
                                <>Informative post</>
                              ) : (
                                <>All</>
                              )}
                            </>
                          )}
                        </>
                      )}
                    </>
                  )}
                </span>
                <AiFillCaretDown className='drop_menu_icon' />
              </MenuButton>
            }>
            <MenuItem
              className='menu_item'
              onClick={() => handleDropDownMenu("all")}>
              All
            </MenuItem>
            <MenuItem
              className='menu_item'
              onClick={() => handleDropDownMenu("np")}>
              Normal post
            </MenuItem>
            <MenuItem
              className='menu_item'
              onClick={() => handleDropDownMenu("news")}>
              News post
            </MenuItem>
            <MenuItem
              className='menu_item'
              onClick={() => handleDropDownMenu("anc")}>
              Announcement post
            </MenuItem>
            <MenuItem
              className='menu_item'
              onClick={() => handleDropDownMenu("info")}>
              Informative post
            </MenuItem>
          </Menu>
        </div>
        <>
          <div>
            {(notificationPost || []).length > 0 ? (
              <div
                className='__notification_post_section'
                onClick={handleReload}>
                <div className='inner_noti_post'>
                  <div className='noti_post_image_section'>
                    {notificationPost.map((data, index) => (
                      <img
                        src={
                          data.u_img
                            ? `${process.env.REACT_APP_PUBLIC_URL}${data.u_img}`
                            : UserAvatar
                        }
                        className='notification_popup_img'
                      />
                    ))}
                  </div>
                  {notificationPost.length - 5 > 0 ? (
                    <div className='noti_text'>
                      +{notificationPost.length - 5} users new post received
                    </div>
                  ) : (
                    <div className='noti_text'>users new post received</div>
                  )}
                </div>
              </div>
            ) : null}
          </div>
          {(users || []).length > 0 ? (
            <div className='feed_user_list_card_container'>
              {users.map((data) => (
                <div className='feed_user_card' key={data.handleUn}>
                  <div className='feed_user_info_section'>
                    <img
                      src={data.p_i || UserAvatar}
                      className='feed_card_avatar'
                    />
                    <span className='feed_user_card_name'>
                      {data.fn} {data.l_n}
                    </span>
                    <span className='feed_user_username'>@{data.handleUn}</span>
                  </div>
                  <button
                    className='follow_following_btn'
                    onClick={() => handleFollow(data.handleUn)}>
                    {following.includes(data.handleUn) ? (
                      <BiUserCheck />
                    ) : (
                      <BiUserPlus />
                    )}
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <>
              {isLoading ? (
                <PostSkeleton />
              ) : (
                <>
                  {subLoading ? (
                    <PostSkeleton />
                  ) : (
                    <>
                      {(isPost || []).length > 0 ? (
                        <div
                          className={
                            scrollHeight > 88
                              ? "social_post_cards_container scroll_social_post_cards_container"
                              : "social_post_cards_container"
                          }>
                          {isPost.map((post) => (
                            <div key={post.id} id={post.id} ref={postRef}>
                              <PostCard postData={post} page={page} />
                            </div>
                          ))}
                          {currentPostCount < limit ? null : (
                            <div className='load_more_btn_container'>
                              {isLoadingBtn ? (
                                <div className='loading'>
                                  <BiLoaderAlt className='spinner' />
                                </div>
                              ) : (
                                <button
                                  className='load_more_btn'
                                  onClick={incrementPage}>
                                  Load more
                                </button>
                              )}
                            </div>
                          )}

                          {/* {fetchPostCount === limit && (
                            <div className='load_more_btn_container'>
                              {isLoadingBtn ? (
                                <div className='loading'>
                                  <BiLoaderAlt className='spinner' />
                                </div>
                              ) : (
                                <button
                                  className='load_more_btn'
                                  onClick={incrementPage}>
                                  Load more
                                </button>
                              )}
                            </div>
                          )} */}
                        </div>
                      ) : (
                        <div className='empty_post_container'>
                          {t("NoPost")}
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
            </>
          )}
        </>
      </div>
    </React.Fragment>
  );
};

export default Feed;
