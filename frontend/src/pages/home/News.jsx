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
import { FiMoreHorizontal } from "react-icons/fi";
import { useNavigate } from "react-router";
import NewsComp from "../../components/NewsComp/NewsComp";
import NewsHome from "../../components/NewsHome/NewsHome";
import NewsMobile from "../../components/NewsHome/NewsMobile";

const NewsPage = ({ token }) => {
  const [news, setNews] = React.useState([]);
  const [mobilescrolled, setMobileScrolled] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  const handleScroll = () => {
    const offset = window.scrollY;
    setScrolled(offset);
  };

  React.useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  });

  const fetchNews = () => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      `${process.env.REACT_APP_URL_LINK}api/posts/fetch/news`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        setNews(result);
      })
      .catch((error) => console.log("error", error));
  };

  React.useEffect(() => {
    fetchNews();
  }, []);
  return (
    <React.Fragment>
      <div className='large_screen_news'>
        <NewsHome />
      </div>
      <div className='small_screen_news'>
        <NewsMobile scrolled={scrolled} />
      </div>
    </React.Fragment>
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

export default connect(mapStateToProps, mapDispatchToProps)(NewsPage);
