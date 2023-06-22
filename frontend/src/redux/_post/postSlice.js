/** @format */
// updateExistingPost
import { createSlice } from "@reduxjs/toolkit";
import {
  getPosts,
  handleCreateNewPost,
  handlePinnedPost,
  handleBookmarkPost,
  handleHidePost,
  handleSocialPostUpdate,
  handleUpdateDeletePost,
  handleUpdateSharePrivacy,
  handleUpdatePostCommentPrivacy,
  handleSharePost,
  handleUpdateDonatePost,
  postAnalytics,
  handleUpdatePostSpam,
  handleUpdateLikePost,
  handleUpdateAngryPost,
  handleUpdateHahaPost,
  handleUpdateDislikePost,
  handlePostComment,
  fetchPostRelatedComment,
  pinnedComment,
  editComment,
  deleteComment,
  commentSpam,
  updateLikeComment,
  updateRemoveLikeComment,
  CommentReply,
  fetchReplies,
  deleteReply,
  spamReply,
  likeReply,
  dislikeReply,
  handleFetchLikeUser,
  fetchFullPost,
} from "../../api/_post/postApi";

//reset state helper function
const resetState = (state) => {
  state.isLoading = true;
  state.error = null;
};

//success helper function
const successFetchPosts = (state, action) => {
  state.posts = action.payload;
  state.isLoading = false;
};

//error or fail helper function
const handleFail = (state, action) => {
  state.error = action.payload;
  state.isLoading = false;
};

//create slice
export const postSlice = createSlice({
  name: "post",
  initialState: {
    posts: [],
    pinnedPost: null,
    comments: [],
    myComments: [],
    selectComment: null,
    selectedPost: null,
    notificationPost: [],
    cusrrentPostCount: 0,
    currentCommentCount: 0,
    commentUpdate: null,
    // other state properties,
    replies: [],
  },
  reducers: {
    fetchPostsStart: resetState,
    fetchPostsSuccess: successFetchPosts,
    fetchPostsFail: handleFail,

    updatePostStart: resetState,
    updatePostSuccess: (state, action) => {
      // Assuming the API returns the updated post on success,
      // find the post in the state by its ID and update it
      const updatedPost = action.payload;
      const existingPost = state.posts.find(
        (post) => post.id === updatedPost.id
      );
      if (existingPost) {
        // Copy the updated fields to the existing post
        Object.assign(existingPost, updatedPost);
      }
      state.isLoading = false;
    },
    updatePostFail: handleFail,

    // Add other actions here...
    putPostLast: (state, action) => {
      state.posts = [...action.payload, ...state.posts];
    },
    removePosts: (state) => {
      state.posts = [];
    },
    removeNotificationPost: (state, action) => {
      state.notificationPost = [];
    },
    addNotificationPost: (state, action) => {
      state.notificationPost = [action.payload, ...state.notificationPost];
    },
    setPinnedPost: (state, action) => {
      state.pinnedPost = action.payload;
    },
    prependPost: (state, action) => {
      state.posts = [action.payload, ...state.posts];
    },
    appendPost: (state, action) => {
      state.posts = [...state.posts, ...action.payload];
    },
    setPostCount: (state, action) => {
      state.cusrrentPostCount = action.payload;
    },

    /**
     * @COMMENTS
     */
    setComments: (state, action) => {
      state.comments = action.payload;
    },
    prependComment: (state, action) => {
      state.comments = [action.payload, ...state.comments];
    },
    appendComment: (state, action) => {
      console.log("APPEND ", action.payload);
      state.comments = [...state.comments, ...action.payload];
    },
    setCommentCount: (state, action) => {
      state.currentCommentCount = action.payload;
    },
    removeComments: (state, action) => {
      state.comments = [];
    },
    setUpdateComment: (state, action) => {
      state.commentUpdate = action.payload;
    },

    /**
     * @REPLY
     */
    addReply: (state, action) => {
      state.replies = action.payload;
    },
    appendReply: (state, action) => {
      state.replies = [action.payload, ...state.replies];
    },
    removeReply: (state, action) => {
      state.replies = [];
    },
    putRepliesLast: (state, action) => {
      state.replies = [...state.replies, ...action.payload];
    },
  },
});

// Export actions outside
export const {
  fetchPostsStart,
  fetchPostsSuccess,
  fetchPostsFail,
  updatePostStart,
  updatePostSuccess,
  updatePostFail,
  putPostLast,
  addNotificationPost,
  removeNotificationPost,
  removePosts,
  setPinnedPost,
  prependPost,
  appendPost,
  setPostCount,
  setComments,
  prependComment,
  appendComment,
  setCommentCount,
  removeComments,
  setUpdateComment,
  appendReply,
  removeReply,
  addReply,
  putRepliesLast,
} = postSlice.actions;

// Define async thunks
export const fetchPosts = (data) => async (dispatch) => {
  dispatch(fetchPostsStart());

  try {
    const posts = await getPosts(data);
    // console.log("posts from serverrrrrrrrrrrrrrrr", posts);

    if (data.page === 1) {
      dispatch(fetchPostsSuccess(posts));
      dispatch(setPostCount(posts.length));
    } else {
      dispatch(appendPost(posts));
      dispatch(setPostCount(posts.length));
    }
  } catch (error) {
    dispatch(fetchPostsFail(error.toString()));
  }
};

export const updatePost = (data) => async (dispatch) => {
  // console.log("Data >>> ", data);
  dispatch(updatePostStart());
  try {
    const posts = await getPosts(data);
    console.log("posts from serverrrrrrrrrrrrrrrr", posts);
    dispatch(updatePostSuccess(posts));
  } catch (error) {
    dispatch(updatePostFail(error.toString()));
  }
};

export const createNewPost = (data) => async (dispatch) => {
  const postData = await handleCreateNewPost(data);
  try {
    return postData;
  } catch (error) {
    console.log("Error");
  }
};

//result retruned back to component without updating redux
export const updatePinnedPost = (data) => async (dispatch) => {
  const postData = await handlePinnedPost(data);
  try {
    return postData;
  } catch (error) {
    console.log(error);
  }
};

//result retruned back to component without updating redux
export const updateBookmarkPost = (data) => async (dispatch) => {
  const postData = await handleBookmarkPost(data);
  try {
    return postData;
  } catch (error) {
    console.log(error);
  }
};

//result retruned back to component without updating redux
export const updateHidePost = (data) => async (dispatch) => {
  const postData = await handleHidePost(data);
  try {
    return postData;
  } catch (error) {
    console.log(error);
  }
};

export const updateSocialPost = (data) => async (dispatch) => {
  // console.log(data);
  const postData = await handleSocialPostUpdate(data);
  try {
    return postData;
  } catch (error) {
    console.log(error);
  }
};

export const updateDeletePost = (data) => async (dispatch) => {
  const postData = await handleUpdateDeletePost(data);
  try {
    return postData;
  } catch (error) {
    console.log(error);
  }
};

export const updatePostSharePrivacy = (data) => async (dispatch) => {
  const postData = await handleUpdateSharePrivacy(data);
  try {
    return postData;
  } catch (error) {
    console.log(error);
  }
};

export const updatePostCommentPrivacy = (data) => async (dispatch) => {
  const postData = await handleUpdatePostCommentPrivacy(data);
  try {
    return postData;
  } catch (error) {
    console.log(error);
  }
};

export const updateSharePost = (data) => async (dispatch) => {
  // console.log(data);
  const postData = await handleSharePost(data);
  try {
    console.log("Share post came ", postData);
    dispatch(prependPost(postData));
    return postData;
  } catch (error) {
    console.log(error);
  }
};

export const updateDonatePost = (data) => async (dispatch) => {
  const postData = await handleUpdateDonatePost(data);
  try {
    dispatch(setPinnedPost(postData));
    return postData;
  } catch (error) {
    console.log(error);
  }
};

export const updateSpamPost = (data) => async (dispatch) => {
  const postData = await handleUpdatePostSpam(data);
  try {
    dispatch(setPinnedPost(postData));
    return postData;
  } catch (error) {
    console.log(error);
  }
};

export const fetchPostAnalytics = (data) => async (dispatch) => {
  const post = await postAnalytics(data);
  try {
  } catch (error) {
    console.log("ERROR");
  }
};

export const updateLikePost = (data) => async (dispatch) => {
  const postData = await handleUpdateLikePost(data);
  try {
    return postData;
  } catch (error) {
    console.log(error);
  }
};

export const updateAngryPost = (data) => async (dispatch) => {
  const postData = await handleUpdateAngryPost(data);
  try {
    return postData;
  } catch (error) {
    console.log(error);
  }
};

export const updateHahaPost = (data) => async (dispatch) => {
  const postData = await handleUpdateHahaPost(data);
  try {
    return postData;
  } catch (error) {
    console.log(error);
  }
};

export const updateDislikePost = (data) => async (dispatch) => {
  const postData = await handleUpdateDislikePost(data);
  try {
    return postData;
  } catch (error) {
    console.log(error);
  }
};

export const fetchLikedUser = (data) => async (dispatch) => {
  const result = await handleFetchLikeUser(data);
  console.log("Data came: ", result);
  try {
    return result;
  } catch (error) {
    console.log(error);
  }
};

export const handleFetchFullPost = (data) => async (dispatch) => {
  const result = await fetchFullPost(data);
  try {
    return result;
  } catch (error) {
    console.log(error);
  }
};

/**
 * @COMMENT
 */
export const postComment = (data) => async (dispatch) => {
  const comment = await handlePostComment(data);

  try {
    dispatch(prependComment(comment.data));
  } catch (error) {
    console.log(error);
  }
};

export const fetchPostComment = (data) => async (dispatch) => {
  const comments = await fetchPostRelatedComment(data);
  // console.log("COMMENTS ", comments);
  if (data.page === 1) {
    dispatch(setComments(comments));
  } else {
    dispatch(appendComment(comments));
  }
  dispatch(setCommentCount(comments.length));
};

export const updatePinnedComment = (data) => async (dispatch) => {
  const comment = await pinnedComment(data);

  try {
    return comment;
  } catch (error) {
    console.log(error);
  }
};

export const handleCommentEditComment = (data) => async (dispatch) => {
  const comment = await editComment(data);
  try {
    return comment;
  } catch (error) {
    console.log(error);
  }
};

export const handlePostCommentDelete = (data) => async (dispatch) => {
  const comment = await deleteComment(data);
  try {
    return comment;
  } catch (error) {
    return error;
  }
};

export const handlePostCommentSpam = (data) => async (dispatch) => {
  const comment = await commentSpam(data);
  try {
    return comment;
  } catch (error) {
    return error;
  }
};

export const handleCommentLike = (data) => async (dispatch) => {
  const comment = await updateLikeComment(data);
  try {
    return comment;
  } catch (error) {
    return error;
  }
};

export const handleCommentRemoveLike = (data) => async (dispatch) => {
  const comment = await updateRemoveLikeComment(data);
  try {
    return comment;
  } catch (error) {
    return error;
  }
};

/**
 * @REPLY
 */
export const handleReplyComment = (data) => async (dispatch) => {
  const reply = await CommentReply(data);
  try {
    return reply;
  } catch (error) {
    console.log(error);
  }
};

export const handleFetchReplies = (data) => async (dispatch) => {
  const repliesData = await fetchReplies(data);

  try {
    if (data.page === 1) {
      dispatch(addReply(repliesData));
    } else {
      dispatch(putRepliesLast(repliesData));
    }
  } catch (error) {
    console.log(error);
  }
};

export const handleDeleteReply = (data) => async (dispatch) => {
  const replyData = await deleteReply(data);
  // console.log(replyData);
  try {
    return replyData;
  } catch (error) {
    console.log(error);
  }
};

export const handleReplySpam = (data) => async (dispatch) => {
  const replyData = await spamReply(data);
};

export const handleReplyLike = (data) => async (dispatch) => {
  const replyData = await likeReply(data);
  try {
    return replyData;
  } catch (error) {
    console.log(error);
  }
};

export const handleReplyDislike = (data) => async (dispatch) => {
  const replyData = await dislikeReply(data);
  try {
    return replyData;
  } catch (error) {
    console.log(error);
  }
};
export default postSlice.reducer;
