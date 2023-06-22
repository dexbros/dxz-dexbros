/** @format */

export const selectUser = (state) => state.user.user;
export const selectPosts = (state) => state.post.posts;
export const selectLoading = (state) => state.user.isLoading;
export const selectNotificationPost = (state) => state.post.notificationPost;
export const selectFollwing = (state) => state.user.followingt;
export const selectPinnedPost = (state) => state.post.pinnedPost;
export const selectCurrentPostCount = (state) => state.post.cusrrentPostCount;
export const selectComments = (state) => state.post.comments;
export const selectMyComments = (state) => state.post.myComments;
export const selectCurrentCommentCount = (state) =>
  state.post.currentCommentCount;
export const selectCommentUpdate = (state) => state.post.commentUpdate;
export const selectReply = (state) => state.post.replies;
