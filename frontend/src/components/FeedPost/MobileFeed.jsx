/** @format */

import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useSocket } from "../../socket/socket";
import { useTranslation } from "react-i18next";
import {
  newPosts,
  updatePost,
  putPostsLast,
  removeAllPosts,
} from "../../redux/post/post.actions";
import {
  setPageType,
  setDrawer,
  setScrollAxis,
} from "../../redux/page/page.actions";
import { Menu, MenuItem, MenuButton, SubMenu } from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";
import { AiFillCaretDown } from "react-icons/ai";
import PostCard from "../../components/PostCardComp/PostCard";
import PostSkeleton from "../SkeletonLoading/PostSkeleton";
import { setScrollAxis } from "../../redux/_page/pageSlice";
import { useDispatch } from "react-redux";
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
  scrollHeight,
  removeAllPosts,
  putPostsLast,
  sortedBy,
  setSortedBy,
  handleDropDownMenu,
}) => {
  const dispatch = useDispatch();
  const { t } = useTranslation(["common"]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [prevScrollDirection, setPrevScrollDirection] = React.useState(0);

  // const handleDropDownMenu = (val) => {
  //   // removeAllPosts();
  //   setIsLoading(true);
  //   setTimeout(() => {
  //     setIsLoading(false);
  //   }, 1000);
  //   setSortedBy(val);
  //   setPage(1);
  // };

  // const nextPage = () => {
  //   setPage((prev) => prev + 1);
  // };
  // useSocket();

  // React.useLayoutEffect(() => {
  //   setPageType("social");
  // }, []);

  // const handler = (event) => {
  //   if (!dropRef.current.contains(event.target)) {
  //     setIsDropDownVisible(false);
  //   }
  // };

  // const dropRef = React.useRef();
  // React.useEffect(() => {
  //   document.addEventListener("mousedown", handler);

  //   return () => {
  //     document.removeEventListener("mousedown", handler);
  //   };
  // });

  // const handleSelect = (data) => {
  //   setIsCheck((p) => !p);
  // };

  // function handleScroll(e) {
  //   // console.log(e.target.scrollTop);
  //   // setScrollAxis(e.target.scrollTop);

  //   // const
  //   // // console.log(currentScrollPos);

  //   // // console.log(e.target.scrollTop);
  // currentScrollPos = e.target.scrollTop;
  // if (prevScrollDirection < currentScrollPos) {
  //   // setScrollDirection('down');
  //   // console.log("Down");
  //   setScrollAxis("Down");
  // } else {
  //   setScrollAxis("Up");
  // }
  // setPrevScrollDirection(currentScrollPos);

  //   let cl = e.currentTarget.clientHeight;
  //   let sy = Math.round(e.currentTarget.scrollTop);
  //   let sh = e.currentTarget.scrollHeight;
  //   if (cl + sy + 1 >= sh) {
  //     setPage((page) => page + 1);
  //   }
  // }

  // React.useEffect(() => {
  //   window.addEventListener("scroll", handleScroll);
  //   return () => {
  //     window.removeEventListener("scroll", handleScroll);
  //   };
  // });

  // React.useEffect(() => {
  //   setIsLoading(true);
  //   setTimeout(() => {
  //     setIsLoading(false);
  //   }, 1000);
  // }, []);

  function handleScroll(e) {
    // console.log(e.target.scrollTop);
    // setScrollAxis(e.target.scrollTop);

    const currentScrollPos = e.target.scrollTop;
    // console.log(e.target.scrollTop);
    if (prevScrollDirection < currentScrollPos) {
      // setScrollDirection('down');
      // console.log("Down");
      dispatch(setScrollAxis("Down"));
      console.log("DOWN");
    } else {
      // setScrollDirection('up');
      console.log("up");
      dispatch(setScrollAxis("Up"));
    }
    setPrevScrollDirection(currentScrollPos);
  }

  React.useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  });

  return (
    <div className={"scroll_post_feed_container"}>
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
      </div>

      {isLoading ? (
        <PostSkeleton />
      ) : (
        <>
          {(posts || []).length > 0 ? (
            <div
              className={
                scrollHeight > 88
                  ? "social_post_cards_container scroll_social_post_cards_container"
                  : "social_post_cards_container"
              }
              onScroll={(e) => handleScroll(e)}>
              {posts.map((post) => (
                <div key={post.id}>
                  <PostCard postData={post} />
                </div>
              ))}
            </div>
          ) : (
            <div className='empty_post_container'>{t("NoPost")}</div>
          )}
        </>
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
  axisValue: state.page.axisValue,
  scrollHeight: state.page.scrollHeight,
  posts: state.post.posts,
});

const mapDispatchToProps = (dispatch) => ({
  newPosts: (posts) => dispatch(newPosts(posts)),
  putPostsLast: (posts) => dispatch(putPostsLast(posts)),
  updatePost: (post) => dispatch(updatePost(post)),
  setPageType: (type) => dispatch(setPageType(type)),
  setDrawer: (data) => dispatch(setDrawer(data)),
  setScrollAxis: (data) => dispatch(setScrollAxis(data)),
  removeAllPosts: (data) => dispatch(removeAllPosts(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Feed);
