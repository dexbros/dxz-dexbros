/** @format */

import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useSocket } from "../../socket/socket";
import { useTranslation } from "react-i18next";
import {
  newPosts,
  updatePost,
  putPostsLast,
} from "../../redux/post/post.actions";
import { setPageType, setDrawer } from "../../redux/page/page.actions";
import { Menu, MenuItem, MenuButton, SubMenu } from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";
import { AiFillCaretDown } from "react-icons/ai";
import PostCard from "../../components/PostCardComp/PostCard";
// import Search from "../search/Search";
// import Multiselect from 'multiselect-react-dropdown';
import { BsFilter } from "react-icons/bs";

const data = [
  // { name: "All", id: 'all' },
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
  posts,
  pinnedPost,
  newPosts,
  setPageType,
  updatePost,
  putPostsLast,
  setPinnedPost,
  setDrawer,
  isOpen,
}) => {
  const { t } = useTranslation(["common"]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [postsData, setPostsData] = useState([]);
  const [sortedBy, setSortedBy] = React.useState("new");
  const [prevSortedBy, setprevSortedBy] = React.useState("new");
  const [isSelected, setIsSelected] = React.useState("all");
  const [selectSort, setSelectSort] = React.useState("New");
  const [isDropDownVisible, setIsDropDownVisible] = React.useState(false);
  const [isDrop, setIsDrop] = React.useState(false);
  const [isCheck, setIsCheck] = React.useState(false);
  const [selectType, setSelectType] = React.useState([
    // { name: "All", id: 'all' },
    { name: "Normal Post", id: "np" },
    { name: "News", id: "news" },
    { name: "Announcement", id: "anc" },
    { name: "Information", id: "info" },
  ]);
  const [isDisable, setIsDisable] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const [mobilescrolled, setMobileScrolled] = React.useState(false);

  const handleScroll = () => {
    const offset = window.scrollY;
    // console.log(offset)
    if (offset > 280) {
      setScrolled(true);
    } else {
      setScrolled(false);
      setMobileScrolled(false);
    }
  };

  React.useEffect(() => {
    window.addEventListener("scroll", handleScroll);
  });

  const handleDropDownMenu = (val) => {
    setSortedBy(val);
  };

  const nextPage = () => {
    setPage((prev) => prev + 1);
  };
  useSocket();

  React.useLayoutEffect(() => {
    setPageType("social");
  }, []);
  const fetchPost = () => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      `${process.env.REACT_APP_URL_LINK}api/posts/fetch/feed?sortedBy=${sortedBy}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        newPosts(result);
      })
      .catch((error) => console.log("error", error));
  };

  // *** Fetch posts
  useEffect(() => {
    if (user.log_un) {
      fetchPost();
    }
  }, [token, user, pinnedPost, page, sortedBy]);

  const handler = (event) => {
    if (!dropRef.current.contains(event.target)) {
      setIsDropDownVisible(false);
    }
  };

  const dropRef = React.useRef();
  React.useEffect(() => {
    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  });

  const handleSelect = (data) => {
    setIsCheck((p) => !p);
  };

  return (
    <div
      className={
        scrolled
          ? "scroll_post_feed_container social_feed_container"
          : "social_feed_container"
      }>
      {/* Sorting dropdown menu */}
      <div className='feed_header'>
        <div className='dropdown_sorting_container'>
          <label className='dropdown_label'>Sort By: </label>
          <Menu
            menuButton={
              <MenuButton className='feed_sort_button'>
                {sortedBy.split("")[0].toUpperCase()}
                {sortedBy.split("").splice(1).join("")}
                <AiFillCaretDown className='comment_header_dropdown_icons' />
              </MenuButton>
            }>
            <MenuItem
              className={"home_menu_item"}
              value={"popular"}
              onClick={(e) => handleDropDownMenu(e.value)}>
              Popular
            </MenuItem>
            <MenuItem
              className={"home_menu_item"}
              value={"old"}
              onClick={(e) => handleDropDownMenu(e.value)}>
              Oldest
            </MenuItem>
            <MenuItem
              className={"home_menu_item"}
              value={"new"}
              onClick={(e) => handleDropDownMenu(e.value)}>
              Newest
            </MenuItem>
            <MenuItem
              className={"home_menu_item"}
              value={"random"}
              onClick={(e) => handleDropDownMenu(e.value)}>
              Random
            </MenuItem>
          </Menu>
        </div>

        {/*  */}
        <div className='dropdown_select_container' ref={dropRef}>
          {!isDropDownVisible && (
            <button
              className='select_dropdown_label'
              onClick={() => setIsDropDownVisible((prev) => !prev)}>
              {t("Filter")}
              <BsFilter />
            </button>
          )}

          {isDropDownVisible && (
            <form className='drop_down_form'>
              <input
                type='text'
                onFocus={() => setIsDrop(true)}
                value={names.map((data) => {
                  data;
                })}
              />
              {isDrop && (
                <div className='checkbox_lists'>
                  {selectType.map((data, index) => (
                    <label key={index} className='label'>
                      <input
                        type='checkbox'
                        value={data.id}
                        onChange={(e) => handleSelect(data)}
                      />
                      {data.name}
                    </label>
                  ))}
                </div>
              )}
            </form>
          )}
        </div>
      </div>

      {(posts || []).length > 0 ? (
        <div className='social_post_cards_container'>
          {posts.map((post) => (
            <div key={post.id}>
              <PostCard postData={post} />
            </div>
          ))}
        </div>
      ) : (
        <div className='empty_post_container'>{t("NoPost")}</div>
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  user: state.user.user,
  token: state.user.token,
  posts: state.post.posts,
  pinnedPost: state.post.pinnedPost,
  isOpen: state.page.isOpen,
});

const mapDispatchToProps = (dispatch) => ({
  newPosts: (posts) => dispatch(newPosts(posts)),
  putPostsLast: (posts) => dispatch(putPostsLast(posts)),
  updatePost: (post) => dispatch(updatePost(post)),
  setPageType: (type) => dispatch(setPageType(type)),
  setDrawer: (data) => dispatch(setDrawer(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Feed);
