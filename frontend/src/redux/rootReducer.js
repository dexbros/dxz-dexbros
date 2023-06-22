/** @format */

import { combineReducers } from "redux";

// import { userReducer } from "./user/user.reducer";
// import { postReducer } from "./post/post.reducer";
// import { notificationReducer } from "./notification/notification.reducer";
// import { searchReducer } from "./Search/search.reducer";
// import { pageReducer } from "./page/page.reducer";
import { resultReducer } from "./result/result.reducer";
import { groupPostReducer } from "./GroupPost/groupPost.reducer";
import { blockCastReducer } from "./block/block.reducer";
import { groupReducer } from "./Group/group.reducer";
import { MessageReducer } from "./message/message.reducer";
import { commentReducer } from "./comment/comment.reducer";
import { replyReducer } from "./reply/reply.reducer";
import userSlice from "./_user/userSlice";
import postSlice from "./_post/postSlice";
import pageSlice from "./_page/pageSlice";
import notificationSlice from "./_notification/notificationSlice";
import searchSlice from "./_search/searchSlice";
import groupSlice from "./_block/blockSlice";
import groupPostSlice from "./_blockPost/blockPostSlice";

export const rootReducer = combineReducers({
  user: userSlice,
  // post: postReducer,
  post: postSlice,
  // notification: notificationReducer,
  notification: notificationSlice,
  results: resultReducer,
  // page: pageReducer,
  page: pageSlice,
  // groupPost: groupPostReducer,
  groupPost: groupPostSlice,
  blockCast: blockCastReducer,
  // group: groupReducer,
  group: groupSlice,
  // search: searchReducer,
  search: searchSlice,
  message: MessageReducer,
  comment: commentReducer,
  reply: replyReducer,
  //_user: userSlice,
});
