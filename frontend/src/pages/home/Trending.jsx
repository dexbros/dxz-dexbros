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
import FeedSkeleton from "../../components/SkeletonLoading/FeedSkeleton";


const Trending = ({
  token,
  user,
  posts,
  pinnedPost,
  newPosts,
  setPageType,
  updatePost,
  putPostsLast,
  setPinnedPost, setDrawer, isOpen
}) => {
  const navigate = useNavigate();
  const [trendingList, setTrendingList] = React.useState([])
  const [scrolled, setScrolled] = React.useState(false);
  const [mobilescrolled, setMobileScrolled] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  
  const handleScroll = () => {
    const offset = window.scrollY;
    // console.log(offset)
    if (offset > 280) {
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

  React.useEffect(() => {
    setIsLoading(true);
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    fetch(`${process.env.REACT_APP_URL_LINK}api/posts/trending/list`, requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(result);
        setIsLoading(false);
        setTrendingList(result.temp)
      })
      .catch(error => console.log('error', error));
  }, []);

  const handleClick = (value) => {
    var key = value.replace(/[^a-zA-Z ]/g, "")
    navigate(`/trending/posts/${key}`)
  }

  return (
    <React.Fragment>
      {
        isLoading ?
          <>
            <FeedSkeleton />
          </> :
          <div className={(scrolled) ? "scroll_post_feed_container social_feed_container" : "social_feed_container"}>
            {
              (trendingList || []).length > 0 ?
                <div className="trend_section">
                  <ol>
                    {
                      trendingList.map((data, index) => (
                        <div key={index} className="trending_card" onClick={() => handleClick(data.p_k)}>
                          <div className="trend_data_box">
                            <span className="trending_subheader">{index + 1}.</span>
                            <span className="trending_text">Trending</span><br />
                            <span className="trend_header">{data.p_k}</span><br />
                            <span className="trending_count">{data.p_c} posts</span>
                          </div>
                        </div>
                      ))
                    }
                  </ol>
                </div> :
                <div className="empty_trending">There is no trending at the moment</div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Trending);