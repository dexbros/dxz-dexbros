/** @format */

import React from "react";
import { useParams } from "react-router-dom";
import { connect } from "react-redux";
import { setPageType } from "../../redux/page/page.actions";
import { userLogin } from "../../redux/user/user.actions";
import { newPosts, setNewPinnedPost } from "../../redux/post/post.actions";
import PostCard from "../../components/PostCardComp/PostCard";
import { useTranslation } from "react-i18next";

const ProfilePost = ({
  user,
  token,
  login,
  posts,
  newPosts,
  pinnedPost,
  setPinnedPost,
  setPageType,
}) => {
  const { t } = useTranslation(["common"]);
  // const [userPosts, setuserPosts] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [lastResponseData, setLastResponseData] = React.useState(1);
  const [postsData, setPostsData] = React.useState([]);
  const [sortedBy, setSortedBy] = React.useState("new");
  const [prevSortedBy, setprevSortedBy] = React.useState("new");

  const { handleUn } = useParams();

  const scrollHandler = (e) => {
    let cl = e.currentTarget.clientHeight;
    // console.log(e.currentTarget.clientHeight)
    let sy = Math.round(e.currentTarget.scrollTop);
    // console.log(sy)
    let sh = e.currentTarget.scrollHeight;
    // console.log(sh)
    if (cl + sy + 1 >= sh) {
      setPage((page) => page + 1);
    }
  };

  const fetchPosts = () => {
    var axios = require("axios");

    var config = {
      method: "get",
      url: `${process.env.REACT_APP_URL_LINK}api/posts/user/post/${handleUn}?page=${page}`,
      headers: {
        Authorization: "Bearer " + token,
      },
    };

    axios(config)
      .then(function (response) {
        setLastResponseData(response.data.posts.length);
        console.log(response.data.posts.length);
        setPostsData((prev) => [...response.data.posts, ...prev]);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  React.useEffect(() => {
    if (lastResponseData > 0) {
      console.log("page" + page);
      fetchPosts();
    }
  }, [handleUn, token, pinnedPost, page]);

  return (
    <div className='profile_post_container'>
      {(postsData || []).length > 0 ? (
        <div>
          {postsData.map((post) => (
            <div className='posts_container' key={post.id}>
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
});

const mapDispatchToProps = (dispatch) => ({
  login: (user, token) => dispatch(userLogin(user, token)),
  newPosts: (posts) => dispatch(newPosts(posts)),
  setPinnedPost: (post) => dispatch(setNewPinnedPost(post)),
  setPageType: (pageType) => dispatch(setPageType(pageType)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfilePost);
