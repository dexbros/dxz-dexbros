/** @format */

import ActionTypes from "./user.types";

export const userLogin = (user, token) => ({
  type: ActionTypes.USER_LOGIN,
  user: user,
  token: token,
});

export const userLogout = () => ({
  type: ActionTypes.USER_LOGOUT,
});

export const updateUser = (data) => ({
  type: ActionTypes.UPDATE_USER,
  data: data,
});

export const addToLike = (data) => {
  // console.log("Like action call", data)
  return {
    type: ActionTypes.ADD_TO_LIKE,
    data: data,
  };
};

export const addToPoll = (data) => {
  // console.log("Poll action call", data)
  return {
    type: ActionTypes.POLL_VOTE,
    data: data,
  };
};

export const removeToLike = (data) => {
  // console.log("Action REMOVE_TO_LIKE")
  return {
    type: ActionTypes.REMOVE_TO_LIKE,
    data: data,
  };
};

export const addToDislike = (data) => {
  // console.log("Like action call", data)
  return {
    type: ActionTypes.ADD_TO_DISLIKES,
    data: data,
  };
};

export const removeToDislike = (data) => {
  // console.log("Action REMOVE_TO_LIKE")
  return {
    type: ActionTypes.REMOVE_TO_DISLIKES,
    data: data,
  };
};

export const addToShares = (data) => {
  console.log("Like action call", data);
  return {
    type: ActionTypes.ADD_TO_SHARES,
    data: data,
  };
};

export const removeToShares = (data) => {
  return {
    type: ActionTypes.REMOVE_TO_SHARES,
    data: data,
  };
};

export const addToDislikes = (data) => {
  // console.log("Like action call", data)
  return {
    type: ActionTypes.ADD_TO_DISLIKES,
    data: data,
  };
};

export const removeToDislikes = (data) => {
  return {
    type: ActionTypes.REMOVE_TO_DISLIKES,
    data: data,
  };
};

export const searchTerm = (data) => {
  return {
    type: ActionTypes.USER_SEARCH_KEY,
    data: data,
  };
};

export const addFollower = (data) => {
  return {
    type: ActionTypes.ADD_FOLLOWER,
    data: data,
  };
};

export const removeFollower = (data) => {
  return {
    type: ActionTypes.REMOVE_FOLLOWER,
    data: data,
  };
};

// *** POST EMOJI LIKE
export const addEmojiLike = (data) => {
  return {
    type: ActionTypes.APPEND_LIKES,
    data: data,
  };
};
export const removeEmojiLike = (data) => {
  return {
    type: ActionTypes.REMOVE_LIKES,
    data: data,
  };
};

// *** POST DISLIKES
export const addEmojiDislike = (data) => {
  return {
    type: ActionTypes.APPEND_DISLIKES,
    data: data,
  };
};
export const removeEmojiDislike = (data) => {
  return {
    type: ActionTypes.REMOVE_DISLIKES,
    data: data,
  };
};

// *** POST LIKE
export const addEmojiHeart = (data) => {
  return {
    type: ActionTypes.APPEND_HEART,
    data: data,
  };
};
export const removeEmojiHeart = (data) => {
  return {
    type: ActionTypes.REMOVE_HEART,
    data: data,
  };
};

// *** POST EMOJI PARTY
export const addEmojParty = (data) => {
  console.log("ACTION ", data);
  return {
    type: ActionTypes.APPEND_PARTY,
    data: data,
  };
};
export const removeEmojiParty = (data) => {
  return {
    type: ActionTypes.REMOVE_PARTY,
    data: data,
  };
};

// *** POST ANGRY
export const addEmojAngry = (data) => {
  return {
    type: ActionTypes.APPEND_ANGRY,
    data: data,
  };
};
export const removeEmojiAngry = (data) => {
  return {
    type: ActionTypes.REMOVE_ANGRY,
    data: data,
  };
};

// *** POST EMOJI HAHA
export const addEmojHaha = (data) => {
  return {
    type: ActionTypes.APPEND_HAHA,
    data: data,
  };
};
export const removeEmojiHaha = (data) => {
  return {
    type: ActionTypes.REMOVE_HAHA,
    data: data,
  };
};

// Post spam
export const addToSpam = (data) => {
  return {
    type: ActionTypes.ADD_TO_SPAM,
    data: data,
  };
};

export const removeToSpam = (data) => {
  return {
    type: ActionTypes.REMOVE_TO_SPAM,
    data: data,
  };
};

export const addToHideUser = (data) => ({
  type: ActionTypes.HIDE_USER,
  data: data,
});

export const removeToHideUser = (data) => ({
  type: ActionTypes.UNHIDE_USER,
  data: data,
});

export const addBlockCast = (data) => ({
  type: ActionTypes.ADD_BLOCKCAST,
  data: data,
});

export const removeBlockCast = (data) => ({
  type: ActionTypes.REMOVE_BLOCKCAST,
  data: data,
});

// *** COMMENT
// Add to spam
export const addCommentSpam = (data) => ({
  type: ActionTypes.ADD_COMMENT_SPAM,
  data: data,
});
// Remove to spam
export const removeCommentSpam = (data) => ({
  type: ActionTypes.REMOVE_COMMENT_SPAM,
  data: data,
});

// Add Like to comment
export const addCommentLike = (data) => ({
  type: ActionTypes.ADD_COMMENT_LIKE,
  data: data,
});
// Add Dislike to comment
export const removeCommentLike = (data) => ({
  type: ActionTypes.REMOVE_COMMENT_LIKE,
  data: data,
});

// Add Like to comment
export const addCommentDislike = (data) => ({
  type: ActionTypes.ADD_COMMENT_DISLIKE,
  data: data,
});
// Add Dislike to comment
export const removeCommentDislike = (data) => ({
  type: ActionTypes.REMOVE_COMMENT_DISLIKE,
  data: data,
});

export const addBookmark = (data) => ({
  type: ActionTypes.ADD_BOOKMARK,
  data: data,
});
// Add Dislike to comment
export const removeBookmark = (data) => ({
  type: ActionTypes.REMOVE_BOOKMARK,
  data: data,
});

// *** NEWS POST

export const addReliableNews = (data) => ({
  type: ActionTypes.ADD_RELIABLE,
  data: data,
});
export const removeReliableNews = (data) => ({
  type: ActionTypes.REMOVE_RELIABLE,
  data: data,
});

export const addInterstingNews = (data) => ({
  type: ActionTypes.ADD_INTEREST,
  data: data,
});
export const removeInterstingNews = (data) => ({
  type: ActionTypes.REMOVE_INTEREST,
  data: data,
});

export const addFakeNews = (data) => ({
  type: ActionTypes.ADD_FAKE,
  data: data,
});
export const removeFakeNews = (data) => ({
  type: ActionTypes.REMOVE_FAKE,
  data: data,
});

// Informative post
export const addHelpful = (data) => ({
  type: ActionTypes.ADD_HELPFUL,
  data: data,
});
export const removeHelpful = (data) => ({
  type: ActionTypes.REMOVE_HELPFUL,
  data: data,
});

export const addUnhelpful = (data) => ({
  type: ActionTypes.ADD_UNHELPFUL,
  data: data,
});
export const removeUnhelpful = (data) => ({
  type: ActionTypes.REMOVE_UNHELPFUL,
  data: data,
});
export const addMisleading = (data) => ({
  type: ActionTypes.ADD_MISLEADING,
  data: data,
});
export const removeMisleading = (data) => ({
  type: ActionTypes.REMOVE_MISLEADING,
  data: data,
});

// ANNOUNCEMENT POST
export const addLikeAnc = (data) => ({
  type: ActionTypes.ADD_LIKE_ANNOUNCEMENT,
  data: data,
});
export const removeLikeAnc = (data) => ({
  type: ActionTypes.REMOVE_LIKE_ANNOUNCEMENT,
  data: data,
});
export const addImpAnc = (data) => ({
  type: ActionTypes.ADD_IMPORTENT_ANNOUNCEMENT,
  data: data,
});
export const removeImpAnc = (data) => ({
  type: ActionTypes.REMOVE_IMPORTENT_ANNOUNCEMENT,
  data: data,
});

// BLOCK EVENT
export const addToInterest = (data) => ({
  type: ActionTypes.ADD_INTEREST_EVENT,
  data: data,
});
export const removeToInterest = (data) => ({
  type: ActionTypes.REMOVE_INTEREST_EVENT,
  data: data,
});

export const addToNotInterest = (data) => ({
  type: ActionTypes.ADD_NOT_INTEREST_EVENT,
  data: data,
});
export const removeToNotnterest = (data) => ({
  type: ActionTypes.REMOVE_NOT_INTEREST_EVENT,
  data: data,
});

export const addToJoin = (data) => ({
  type: ActionTypes.ADD_JOIN_EVENT,
  data: data,
});
export const removeToJoin = (data) => ({
  type: ActionTypes.REMOVE_JOIN_EVENT,
  data: data,
});

// BLOCK AND BLOCKCAST
export const addToBlock = (data) => ({
  type: ActionTypes.ADD_JOIN_BLOCK,
  data: data,
});
export const removeFromBlock = (data) => ({
  type: ActionTypes.REMOVE_JOIN_BLOCK,
  data: data,
});
