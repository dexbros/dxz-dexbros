import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useSocket } from "../../socket/socket";
import { useTranslation } from "react-i18next";
import { newPosts, updatePost, putPostsLast } from "../../redux/post/post.actions";
import { setPageType, setDrawer } from "../../redux/page/page.actions";
import { Menu, MenuItem, MenuButton, SubMenu } from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";
import { FiMoreHorizontal } from "react-icons/fi";
import { useNavigate } from "react-router";
import NewsComp from "../../components/NewsComp/NewsComp";
import NewsSkeleton from "../SkeletonLoading/NewsSkeleton";

const NewsPage = ({ token }) => {
  const [news, setNews] = React.useState([]);
  const [scrolled, setScrolled] = React.useState(false);
  const [mobilescrolled, setMobileScrolled] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  
  const handleScroll = () => {
    const offset = window.scrollY;
    // console.log(offset)
    if (offset > 250) {
      setScrolled(true);
    }
    else {
      setScrolled(false);
      setMobileScrolled(false)
    }
  }

  React.useEffect(() => {
    window.addEventListener('scroll', handleScroll)
  })

  const fetchNews = () => {
    setIsLoading(true)
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    fetch(`${process.env.REACT_APP_URL_LINK}api/posts/fetch/news`, requestOptions)
      .then(response => response.json())
      .then(result => {
        setIsLoading(false);
        setNews(result);
      })
      .catch(error => console.log('error', error));
  };

  React.useEffect(() => {
    fetchNews();
  }, [])
  return (
    <React.Fragment>
      {
        isLoading ? <NewsSkeleton /> :
          <div className={(scrolled) ? "scroll_post_feed_container social_feed_container" : "social_feed_container"}>
            {
              (news || []).length > 0 &&
              <>
                {
                  news.map(data => (
                    <NewsComp key={data.id} newsData={data} />
                  ))
                }
              </>
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
  isOpen: state.page.isOpen
});

const mapDispatchToProps = (dispatch) => ({
  newPosts: (posts) => dispatch(newPosts(posts)),
  putPostsLast: (posts) => dispatch(putPostsLast(posts)),
  updatePost: (post) => dispatch(updatePost(post)),
  setPageType: (type) => dispatch(setPageType(type)),
  setDrawer: (data) => dispatch(setDrawer(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(NewsPage);