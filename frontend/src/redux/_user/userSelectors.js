/** @format */

// userSelectors.js

export const selectUser = (state) => state.user.user;
export const selectIsLoading = (state) => state.user.isLoading;
export const selectUpdateUser = (state) => state.user.updateUser;
export const selectProfile = (state) => state.user.profile;
export const selectFollowing = (state) => state.user.user.following;
export const selectToken = (state) => state.user.isToken;
export const selectLoading = (state) => state.user.isLoading;
export const selectSpam = (state) => state.user.spam;
export const selectUserAnalytics = (state) => state.user.user_analytics;
export const selectResponse = (state) => ({
  type: state.user.responseType,
  message: state.user.response,
});

export const selectLike = (state) => state.user.emoji_likes;
export const selectAngry = (state) => state.user.emoji_angry;
export const selectHaha = (state) => state.user.emoji_haha;
export const selectDislikes = (state) => state.user.emoji_dislikes;
export const selectcommentSpam = (state) => state.user.cmntSpam;


