/** @format */

import React from "react";
import MainLayout from "../../layouts/main-layout.component";
import { useParams } from "react-router";
import { connect } from "react-redux";
import { useSocket } from "../../socket/socket";
import { useTranslation } from "react-i18next";
import {
  newPosts,
  updatePost,
  putPostsLast,
} from "../../redux/post/post.actions";
import {
  setPageType,
  setDrawer,
  setScrollAxis,
} from "../../redux/page/page.actions";
import { Menu, MenuItem, MenuButton, SubMenu } from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";
import PostCard from "../../components/PostCardComp/PostCard";
import HeaderTitle from "../../components/HeaderTitle/HeaderTitle";

const TrendingPosts = ({
  token,
  user,
  pinnedPost,
  newPosts,
  setPageType,
  updatePost,
  putPostsLast,
  setPinnedPost,
  setDrawer,
  isOpen,
}) => {
  const { key } = useParams();
  const [page, setPage] = React.useState(1);
  const [posts, setPosts] = React.useState([]);
  const [prevScrollDirection, setPrevScrollDirection] = React.useState(0);

  React.useLayoutEffect(() => {
    setPageType("trending");
  });

  React.useEffect(() => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      `${process.env.REACT_APP_URL_LINK}api/posts/trending/posts?key=${key}&page=1`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        setPosts(result);
      })
      .catch((error) => console.log("error", error));
  }, [token, user, pinnedPost]);

  function handleScroll(e) {
    // console.log(e.target.scrollTop);
    // setScrollAxis(e.target.scrollTop);

    const currentScrollPos = e.target.scrollTop;
    // console.log(e.target.scrollTop);
    if (prevScrollDirection < currentScrollPos) {
      // setScrollDirection('down');
      // console.log("Down");
      setScrollAxis("Down");
    } else {
      // setScrollDirection('up');
      // console.log("up");
      setScrollAxis("Up");
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
    <MainLayout goBack={true} title={"#" + key}>
      <div
        className='trending_post_container'
        onScroll={(e) => handleScroll(e)}>
        {posts.map((post) => (
          <div key={post.record.bins.id}>
            <PostCard postData={post.record.bins} />
          </div>
        ))}
      </div>
    </MainLayout>
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
  setScrollAxis: (data) => dispatch(setScrollAxis(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TrendingPosts);
