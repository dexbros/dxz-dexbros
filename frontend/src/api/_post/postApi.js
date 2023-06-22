/** @format */

import { BASE_URL } from "../constants";
import { POST, GET, PUT, FormPost, DELETE, POSTWITHTOKEN } from "../index";

//GET
export const getPosts = async (data) => {
  const ENDPOINT = `api/posts/feed/all?page=${data.page}&sort=${data.sortedBy}`;
  return handleRequestGet(ENDPOINT, data.isToken);
};
//put
export const putPosts = async (data) => {
  const ENDPOINT = `api/posts/./${data.postId}`;
  return handleRequestPut(ENDPOINT, data.isToken);
};
export const putBookmarks = async (data) => {
  const ENDPOINT = `api/posts/pinned/${data.postId}`;
  return handleRequestPut(ENDPOINT, data.isToken);
};

// Generic handler for GET requests
const handleRequestGet = async (endpoint, token) => {
  try {
    const response = await GET(BASE_URL, endpoint, token);

    return response.data;
  } catch (error) {
    console.log("FEED ERROR: ", error);
    let errorMessage = "Something went wrong.";

    if (error.response) {
      errorMessage = `Error: ${error.response.status} - ${errorMessage}`;
    } else if (error.request) {
      errorMessage = "Server did not respond.";
    }
    console.log(errorMessage);
    throw new Error(errorMessage);
  }
};

// Generic handler for POST requests
const handleRequestPost = async (endpoint, data) => {
  try {
    const response = await POST(BASE_URL, endpoint, data);
    return response.data;
  } catch (error) {
    let errorMessage = "Something went wrong.";

    if (error.response) {
      errorMessage = `Error: ${error.response.status} - ${errorMessage}`;
    } else if (error.request) {
      errorMessage = "Server did not respond.";
    }

    throw new Error(errorMessage);
  }
};

const handleRequestPut = async (endpoint, token) => {
  try {
    const response = await PUT(BASE_URL, endpoint, token);
    return response.data;
  } catch (error) {
    let errorMessage = "Something went wrong.";

    if (error.response) {
      errorMessage = `Error: ${error.response.status} - ${errorMessage}`;
    } else if (error.request) {
      errorMessage = "Server did not respond.";
    }

    throw new Error(errorMessage);
  }
};

// Generic handler for GET requests
export const handleCreateNewPost = async (data) => {
  const endpoint = "api/posts/create";
  const response = await FormPost(BASE_URL, endpoint, data.isToken, data);
  try {
    return response.data;
  } catch (error) {
    console.log("Error: ", error);
  }
};

// *** Pinned post
export const handlePinnedPost = async (data) => {
  // console.log(data);
  const endpoint = `api/posts/pinned/${data.postId}`;
  const response = await PUT(BASE_URL, endpoint, data.isToken, data);
  try {
    return response;
  } catch (error) {
    console.log(error);
  }
};

// *** Handle bookmark post
export const handleBookmarkPost = async (data) => {
  const endpoint = `api/posts/bookmark/${data.postId}`;
  const response = await PUT(BASE_URL, endpoint, data.isToken, data);
  try {
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const handleHidePost = async (data) => {
  const endpoint = `api/posts/hide/${data.postId}`;
  const response = await PUT(BASE_URL, endpoint, data.isToken, data);
  try {
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const handleSocialPostUpdate = async (data) => {
  const endpoint = `api/posts/edit/${data.postId}`;
  const response = await PUT(BASE_URL, endpoint, data.isToken, {
    editText: data.editText,
  });
  try {
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const handleUpdateDeletePost = async (data) => {
  const endpoint = `api/posts/delete/${data.postId}`;
  const response = await DELETE(BASE_URL, endpoint, data.isToken);
  try {
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const handleUpdateSharePrivacy = async (data) => {
  // console.log("Came here:   ", data);
  const endpoint = `api/posts/share/post/privacy/${data.postId}`;
  const response = await PUT(BASE_URL, endpoint, data.isToken, {
    sharePrivacy: data.sharePrivacy,
  });
  try {
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const handleUpdatePostCommentPrivacy = async (data) => {
  const endpoint = `api/posts/comment/post/privacy/${data.postId}`;
  const response = await PUT(BASE_URL, endpoint, data.isToken, {
    commentPrivacy: data.commentPrivacy,
  });
  try {
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const handleSharePost = async (data) => {
  const endpoint = `api/posts/share/post/${data.postId}`;
  // const bodyData = {
  //   originalPost: data.originalPost,
  //   content: data.content,
  // };
  const response = await POSTWITHTOKEN(BASE_URL, endpoint, data.isToken, {
    originalPost: data.originalPost,
    content: data.content,
  });
  try {
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const handleUpdateDonatePost = async (data) => {
  const endpoint = `${process.env.REACT_APP_URL_LINK}api/posts/donate/${postId}?amount=${donateValue}&handleUn=${postUserId}&message=${custommessage}`;
  // const bodyData = {
  //   originalPost: data.originalPost,
  //   content: data.content,
  // };
  const response = await POSTWITHTOKEN(BASE_URL, endpoint, data.isToken, data);
  try {
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const handleUpdatePostSpam = async (data) => {
  const endpoint = `api/posts/spam/${data.postId}`;
  const response = await PUT(BASE_URL, endpoint, data.token, {
    editText: data.editText,
  });
  try {
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const postAnalytics = async (data) => {
  const endpoint = `api/posts/fetch/post/analytics/${data.id}`;
  const response = await GET(BASE_URL, endpoint, data.isToken);
  try {
    console.log(response);
  } catch (error) {
    console.log(response);
  }
};

export const handleUpdateLikePost = async (data) => {
  const endpoint = `api/posts/emoji/like/${data.id}`;
  const response = await PUT(BASE_URL, endpoint, data.token, data);
  try {
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const handleUpdateAngryPost = async (data) => {
  const endpoint = `api/posts/emoji/angry/${data.id}`;
  const response = await PUT(BASE_URL, endpoint, data.token, data);
  try {
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const handleUpdateHahaPost = async (data) => {
  const endpoint = `api/posts/emoji/haha/${data.id}`;
  const response = await PUT(BASE_URL, endpoint, data.token, data);
  try {
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const handleUpdateDislikePost = async (data) => {
  const endpoint = `api/posts/emoji/dislike/${data.id}`;
  const response = await PUT(BASE_URL, endpoint, data.token, data);
  try {
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const handleFetchLikeUser = async (data) => {
  const endpoint = `api/posts/like/users/${data.postId}?type=${data.likeType}`;
  const response = await GET(BASE_URL, endpoint, data.token);

  try {
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const fetchFullPost = async (data) => {
  const endpoint = `api/posts/fetch/full/post/${data.id}?page=${data.cmntPage}&limit=${data.cmntLimit}`;
  const response = await GET(BASE_URL, endpoint, data.isToken);

  try {
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

/***
 * @COMMENT
 */
export const handlePostComment = async (data) => {
  const endpoint = `api/posts/comment/${data.post.postId}`;
  const response = await FormPost(BASE_URL, endpoint, data.token, data);
  try {
    return response;
  } catch (error) {
    console.log("Error: ", error);
  }
};

export const fetchPostRelatedComment = async (data) => {
  const ENDPOINT = `api/posts/my_comment/${data.postId}?sortedBy=${data.sortedBy}&page=${data.page}&limit=${data.limit}`;
  const response = await GET(BASE_URL, ENDPOINT, data.token);
  return response.data;
};

export const pinnedComment = async (data) => {
  const endpoint = `api/posts/comment/pinned/${data.cmntId}`;
  const response = await PUT(BASE_URL, endpoint, data.token, data);
  try {
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const editComment = async (data) => {
  const endpoint = `api/posts/comment/edit/${data.cmntId}`;
  const response = await PUT(BASE_URL, endpoint, data.token, data);
  try {
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const deleteComment = async (data) => {
  const endpoint = `api/posts/comment/delete/${data.cmntId}`;
  const response = await PUT(BASE_URL, endpoint, data.token, data);
  try {
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const commentSpam = async (data) => {
  const endpoint = `api/posts/comment/spam/${data.id}`;
  const response = await PUT(BASE_URL, endpoint, data.token, data);
  try {
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const updateLikeComment = async (data) => {
  const endpoint = `api/posts/comment/${data.value}/${data.id}/${data.ownerName}/${data.likeCount}`;
  const response = await PUT(BASE_URL, endpoint, data.token, data);
  try {
    console.log(">>> Like count uppdate : ", response);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const updateRemoveLikeComment = async (data) => {
  const endpoint = `api/posts/comment/like/remove/${data.id}`;
  const response = await PUT(BASE_URL, endpoint, data.token, data);
  try {
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const CommentReply = async (data) => {
  const endpoint = `api/posts/comment/reply/${data.cmntId}`;
  const response = await POSTWITHTOKEN(BASE_URL, endpoint, data.token, {
    text: data.text,
    // content: data.content,
  });

  try {
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const fetchReplies = async (data) => {
  const endpoint = `api/posts/comment/reply/${data.id}?page=${data.page}&limit=${data.limit}`;
  const response = await GET(BASE_URL, endpoint, data.token);
  console.log(response.data);
  try {
    return response.data;
  } catch (error) {
    console.log(response);
  }
};

export const deleteReply = async (data) => {
  const endpoint = `api/posts/comment/reply/delete/${data.replyId}`;
  const response = await PUT(BASE_URL, endpoint, data.token, data);
  try {
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const spamReply = async (data) => {
  const endpoint = `api/posts/comment/reply/spam/${data.id}`;
  const response = await PUT(BASE_URL, endpoint, data.token, data);
  try {
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const likeReply = async (data) => {
  const endpoint = `api/posts/comment/reply/like/${data.id}`;
  const response = await PUT(BASE_URL, endpoint, data.token, data);
  try {
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const dislikeReply = async (data) => {
  const endpoint = `api/posts/comment/reply/dislike/${data.id}`;
  const response = await PUT(BASE_URL, endpoint, data.token, data);
  try {
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
