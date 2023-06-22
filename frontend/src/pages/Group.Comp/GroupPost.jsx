/** @format */

import React from "react";
import { userLogin } from "../../redux/user/user.actions";
import {
  addGroupPost,
  updateGroupPost,
  deleteGroupPost,
  addPostComment,
  updatePostComment,
  deletePostComment,
} from "../../redux/Group/group.actions";
import MyModal from "../../components/modal/MyModal";
import intToString from "../../utils/PostCount";
import {
  setNewPinnedPost,
  updatePost,
  deletePost,
  putPosts,
  newPosts,
} from "../../redux/post/post.actions";
import { Menu, MenuItem, MenuButton, SubMenu } from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";
import { useParams } from "react-router-dom";
import GroupPostComponent from "../../components/Group.Post.component/GroupPostComponent";
import Test from "../../components/Group.Post.component/Test";
import { useState } from "react";
import { AiFillCaretDown } from "react-icons/ai";
import "./GroupPost.css";
import {
  groupNewPosts,
  groupPutPostsLast,
  setGroupPosts,
  appendSinglePost,
} from "../../redux/GroupPost/groupPost.action";
import SkeletonGroupPost from "../../components/SkeletonLoading/SkeletonGroupPost";

// Toolkit
import { useSelector, useDispatch } from "react-redux";
import { selectToken, selectUser } from "../../redux/_user/userSelectors";
import {
  fetchBlockPosts,
  addPosts,
} from "../../redux/_blockPost/blockPostSlice";
import { seleectPosts } from "../../redux/_blockPost/blockPostSelectors";

const GroupPostContainer = ({
  updatePost,
  updateGroupPost,
  groupPutPostsLast,
  activeState,
  setGroupPosts,
  pinnedPost,
}) => {
  const { id } = useParams();
  const posts = useSelector(seleectPosts);
  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  const [group, setGroup] = useState(null);
  const [active, setActive] = React.useState("time");
  const [showPost, setShowPost] = React.useState(false);
  const [sortedBy, setSortedBy] = React.useState("new");
  const [prevSortedBy, setprevSortedBy] = React.useState("new");
  // const [groupPosts, setGroupPosts] = React.useState([]);
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(5);
  const [isLoading, setIsLoading] = React.useState(false);
  const [currentPostLength, setCurrentPostLength] = React.useState(0);

  const handleDropDownMenu = (val) => {
    setSortedBy(val);
  };

  React.useEffect(() => {
    async function fetchData() {
      const data = { id, sortedBy, page, limit, token };
      const result = await dispatch(fetchBlockPosts(data));
      setCurrentPostLength(result.length);
      if (page === 1) {
        dispatch(addPosts(result));
      }
    }
    fetchData();
  }, [id]);

  React.useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  const incrementPage = () => {
    setPage((prev) => prev + 1);
  };

  return (
    <React.Fragment>
      {isLoading ? (
        <SkeletonGroupPost />
      ) : (
        <>
          {(posts || []).length > 0 ? (
            <div>
              {posts.map((post, index) => (
                <Test
                  key={post.p_id}
                  postData={post}
                  group={group}
                  index={index}
                  active={active}
                />
              ))}
              {currentPostLength >= limit && (
                <div className='load_more_btn_container'>
                  <button className='load_more_btn' onClick={incrementPage}>
                    Load more
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className='empty_group_post'>No post available</div>
          )}
        </>
      )}
    </React.Fragment>
  );
};

const mapStateToProps = (state) => ({
  user: state.user.user,
  token: state.user.token,
  posts: state.post.posts,
  pinnedPost: state.post.pinnedPost,
  groupPost: state.groupPost.posts,
  pinnedPost: state.groupPost.pinnedPost,
  updatePost: state.group.updatePost,
});

const mapDispatchToProps = (dispatch) => ({
  groupNewPosts: (posts) => dispatch(groupNewPosts(posts)),
  groupPutPostsLast: (data) => dispatch(groupPutPostsLast(data)),
  setPinnedPost: (post) => dispatch(setNewPinnedPost(post)),
  setPageType: (pageType) => dispatch(setPageType(pageType)),
  addGroupPost: (data) => dispatch(addGroupPost(data)),
  updateGroupPost: (data) => dispatch(updateGroupPost(data)),

  setGroupPosts: (data) => dispatch(setGroupPosts(data)),
  appendSinglePost: (data) => dispatch(appendSinglePost(data)),
});

export default GroupPostContainer;
