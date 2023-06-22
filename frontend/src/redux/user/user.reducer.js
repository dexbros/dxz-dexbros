/** @format */

import { Action } from "history";
import ActionTypes from "./user.types";

const INITIAL_STATE = {
  isLoggedIn: false,
  user: null,
  token: null,
  likes: [],
  spam: [],
  shares: [],
  dislikes: [],
  poll: [],
  following: [],
  update: null,
  hide: [],
  bookmark: [],
  angry: [],

  emoji_likes: [],
  emoji_heart: [],
  emoji_haha: [],
  emoji_party: [],
  emoji_dislikes: [],
  emoji_angry: [],

  // Blockcast
  blockcast: [],
  myblockcast: [],
  updateBlockcast: null,

  // Comment
  cmntLike: [],
  cmntDislike: [],
  cmntSpam: [],

  // news post
  reliable: [],
  intersting: [],
  fake: [],

  // informative post
  helpful: [],
  unhelpful: [],
  misleading: [],

  // Announcement post
  likeAnc: [],
  impAnc: [],

  interestEvent: [],
  notInterestEvent: [],
  join: [],

  join_block: [],
  my_block: [],
};

export const userReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ActionTypes.USER_LOGIN:
      return {
        ...state,
        isLoggedIn: true,
        user: action.user,
        token: action.token,
      };
      break;

    case ActionTypes.USER_LOGOUT:
      return {
        ...state,
        isLoggedIn: false,
        user: null,
        token: null,
      };
      break;

    // LIKE
    case ActionTypes.ADD_TO_LIKE:
      console.log("Reducer ADD_TO LIKE");
      return {
        ...state,
        likes: [...state.likes, action.data],
      };
      break;

    case ActionTypes.POLL_VOTE:
      console.log("Reducer ADD_TO Poll");
      return {
        ...state,
        poll: [...state.poll, action.data],
      };
      break;

    case ActionTypes.REMOVE_TO_LIKE:
      console.log("REMOVE_TO_LIKE");
      var copy = [...state.likes];
      var filteredCopy = copy.filter((l) => l != action.data);
      return { ...state, likes: filteredCopy };
      break;

    // *** SPAM
    case ActionTypes.ADD_TO_SPAM:
      return {
        ...state,
        spam: [...state.spam, action.data],
      };
      break;

    case ActionTypes.REMOVE_TO_SPAM:
      console.log("REMOVE_TO_SPAM");
      var copy = [...state.spam];
      var filteredCopy = copy.filter((l) => l != action.data);
      return { ...state, spam: filteredCopy };
      break;

    // *** SHARES
    case ActionTypes.ADD_TO_SHARES:
      return {
        ...state,
        shares: [...state.shares, action.data],
      };
      break;

    case ActionTypes.REMOVE_TO_SHARES:
      // console.log("REMOVE_TO_SPAM")
      var copy = [...state.shares];
      var filteredCopy = copy.filter((l) => l != action.data);
      return { ...state, shares: filteredCopy };
      break;

    // *** DISLIKES
    case ActionTypes.ADD_TO_DISLIKES:
      return {
        ...state,
        dislikes: [...state.dislikes, action.data],
      };
      break;

    case ActionTypes.REMOVE_TO_DISLIKES:
      // console.log("REMOVE_TO_SPAM")
      var copy = [...state.dislikes];
      var filteredCopy = copy.filter((l) => l != action.data);
      return { ...state, dislikes: filteredCopy };
      break;

    case ActionTypes.ADD_FOLLOWER:
      return { ...state, following: [...state.following, action.data] };
      break;

    case ActionTypes.REMOVE_FOLLOWER:
      var copy = [...state.following];
      var filterdFollower = copy.filter((val) => val !== action.data);
      return { ...state, following: filterdFollower };
      break;

    case ActionTypes.UPDATE_USER:
      // console.log(action.data)
      return {
        ...state,
        updateUser: action.data,
      };

    // *** Append likes
    case ActionTypes.APPEND_LIKES:
      return { ...state, emoji_likes: [...state.emoji_likes, action.data] };
    // *** Remove emoji likes
    case ActionTypes.REMOVE_LIKES:
      var copy = [...state.emoji_likes];
      var filteredCopy = copy.filter((l) => l != action.data);
      return { ...state, emoji_likes: filteredCopy };

    // *** Append dislikes
    case ActionTypes.APPEND_LIKES:
      return { ...state, emoji_likes: [...state.emoji_likes, action.data] };
    // *** Remove emoji likes
    case ActionTypes.REMOVE_LIKES:
      var copy = [...state.emoji_likes];
      var filteredCopy = copy.filter((l) => l != action.data);
      return { ...state, emoji_likes: filteredCopy };

    // *** Append heart
    case ActionTypes.APPEND_HEART:
      return { ...state, emoji_heart: [...state.emoji_heart, action.data] };
    // *** Remove emoji heart
    case ActionTypes.REMOVE_HEART:
      var copy = [...state.emoji_heart];
      var filteredCopy = copy.filter((l) => l != action.data);
      return { ...state, emoji_heart: filteredCopy };

    // *** Append haha
    case ActionTypes.APPEND_HAHA:
      return { ...state, emoji_haha: [...state.emoji_haha, action.data] };
    // *** Remove emoji haha
    case ActionTypes.REMOVE_HAHA:
      var copy = [...state.emoji_angry];
      var filteredCopy = copy.filter((l) => l != action.data);
      return { ...state, emoji_haha: filteredCopy };

    // *** Append angry
    case ActionTypes.APPEND_ANGRY:
      return { ...state, emoji_angry: [...state.emoji_angry, action.data] };
    // *** Remove emoji haha
    case ActionTypes.REMOVE_ANGRY:
      var copy = [...state.emoji_angry];
      var filteredCopy = copy.filter((l) => l != action.data);
      return { ...state, emoji_angry: filteredCopy };

    // *** Append party
    case ActionTypes.APPEND_PARTY:
      console.log("REDUCER");
      return { ...state, emoji_party: [...state.emoji_party, action.data] };

    // *** Remove emoji party
    case ActionTypes.REMOVE_PARTY:
      var copy = [...state.emoji_party];
      var filteredCopy = copy.filter((l) => l != action.data);
      return { ...state, emoji_party: filteredCopy };

    // *** Append party
    case ActionTypes.APPEND_DISLIKES:
      return {
        ...state,
        emoji_dislikes: [...state.emoji_dislikes, action.data],
      };

    // *** Remove emoji party
    case ActionTypes.REMOVE_DISLIKES:
      var copy = [...state.emoji_dislikes];
      var filteredCopy = copy.filter((l) => l != action.data);
      return { ...state, emoji_dislikes: filteredCopy };

    // *** Hide user
    case ActionTypes.HIDE_USER:
      return { ...state, hide: [...state.hide, action.data] };

    // *** Unhide user
    case ActionTypes.UNHIDE_USER:
      const copyHide = [...state.hide];
      var filteredArr = copyHide.filter((list) => list !== action.data);
      return { ...state, hide: filteredArr };

    // *** Add to blockcast
    case ActionTypes.ADD_BLOCKCAST:
      return { ...state, blockcast: [...state.blockcast, action.data] };

    case ActionTypes.REMOVE_BLOCKCAST:
      const temp = [...state.blockcast];
      var filter = temp.filter((list) => list !== action.data);
      return { ...state, blockcast: filter };

    // Comment
    case ActionTypes.ADD_COMMENT_LIKE:
      return {
        ...state,
        cmntLike: [...state.cmntLike, action.data],
      };
      break;
    case ActionTypes.REMOVE_COMMENT_LIKE:
      var likeTemp = state.cmntLike;
      var likeArr = likeTemp.filter((list) => list !== action.data);
      return { ...state, cmntLike: likeArr };
      break;

    case ActionTypes.ADD_COMMENT_DISLIKE:
      return {
        ...state,
        cmntDislike: [...state.cmntDislike, action.data],
      };
      break;
    case ActionTypes.REMOVE_COMMENT_DISLIKE:
      var dislikeTemp = state.cmntDislike;
      var dislikeArr = dislikeTemp.filter((list) => list !== action.data);
      return { ...state, cmntDislike: dislikeArr };
      break;

    case ActionTypes.ADD_COMMENT_SPAM:
      return {
        ...state,
        cmntSpam: [...state.cmntSpam, action.data],
      };
      break;
    case ActionTypes.REMOVE_COMMENT_SPAM:
      var spamTemp = state.cmntSpam;
      var spamArr = spamTemp.filter((list) => list !== action.data);
      return { ...state, cmntSpam: spamArr };
      break;

    case ActionTypes.ADD_BOOKMARK:
      return {
        ...state,
        bookmark: [...state.bookmark, action.data],
      };
      break;
    case ActionTypes.REMOVE_BOOKMARK:
      var bookmarkTemp = state.bookmark;
      var bookmarkArr = bookmarkTemp.filter((list) => list !== action.data);
      return { ...state, bookmark: bookmarkArr };
      break;

    // News post\
    // 1. Reliable
    case ActionTypes.ADD_RELIABLE:
      return {
        ...state,
        reliable: [...state.reliable, action.data],
      };
      break;
    case ActionTypes.REMOVE_RELIABLE:
      var reliableTemp = state.reliable;
      var temp1 = reliableTemp.filter((list) => list !== action.data);
      return { ...state, reliable: temp1 };
      break;

    // 2. Intersting
    case ActionTypes.ADD_INTEREST:
      return {
        ...state,
        intersting: [...state.intersting, action.data],
      };
      break;
    case ActionTypes.REMOVE_INTEREST:
      var interstingTemp = state.intersting;
      var temp2 = interstingTemp.filter((list) => list !== action.data);
      return { ...state, intersting: temp2 };
      break;

    // 3. Fake
    case ActionTypes.ADD_FAKE:
      return {
        ...state,
        fake: [...state.fake, action.data],
      };
      break;
    case ActionTypes.REMOVE_FAKE:
      var fakeTemp = state.fake;
      var temp3 = fakeTemp.filter((list) => list !== action.data);
      return { ...state, fake: temp3 };
      break;

    // Informative post
    case ActionTypes.ADD_HELPFUL:
      return {
        ...state,
        helpful: [...state.helpful, action.data],
      };
      break;
    case ActionTypes.REMOVE_HELPFUL:
      var helpTemp = state.helpful;
      var temp4 = helpTemp.filter((list) => list !== action.data);
      return { ...state, helpful: temp4 };
      break;

    case ActionTypes.ADD_UNHELPFUL:
      return {
        ...state,
        unhelpful: [...state.unhelpful, action.data],
      };
      break;
    case ActionTypes.REMOVE_UNHELPFUL:
      var unhelpTemp = state.unhelpful;
      var temp5 = unhelpTemp.filter((list) => list !== action.data);
      return { ...state, unhelpful: temp5 };
      break;

    case ActionTypes.ADD_MISLEADING:
      return {
        ...state,
        misleading: [...state.misleading, action.data],
      };
      break;
    case ActionTypes.REMOVE_MISLEADING:
      var misleadTemp = state.misleading;
      var temp6 = misleadTemp.filter((list) => list !== action.data);
      return { ...state, misleading: temp6 };
      break;

    // Announcement post
    case ActionTypes.ADD_LIKE_ANNOUNCEMENT:
      return {
        ...state,
        likeAnc: [...state.likeAnc, action.data],
      };
      break;
    case ActionTypes.REMOVE_LIKE_ANNOUNCEMENT:
      var likeTemp = state.likeAnc;
      var temp7 = likeTemp.filter((list) => list !== action.data);
      return { ...state, likeArr: temp7 };
      break;

    case ActionTypes.ADD_IMPORTENT_ANNOUNCEMENT:
      return {
        ...state,
        impAnc: [...state.impAnc, action.data],
      };
      break;
    case ActionTypes.REMOVE_IMPORTENT_ANNOUNCEMENT:
      var impTemp = state.impAnc;
      var temp8 = impTemp.filter((list) => list !== action.data);
      return { ...state, impAnc: temp8 };
      break;

    // Event
    case ActionTypes.ADD_INTEREST_EVENT:
      return {
        ...state,
        interestEvent: [...state.interestEvent, action.data],
      };
      break;
    case ActionTypes.REMOVE_INTEREST_EVENT:
      var instTemp = state.interestEvent;
      var temp9 = instTemp.filter((list) => list !== action.data);
      return { ...state, interestEvent: temp9 };
      break;

    case ActionTypes.ADD_NOT_INTEREST_EVENT:
      return {
        ...state,
        notInterestEvent: [...state.notInterestEvent, action.data],
      };
      break;
    case ActionTypes.REMOVE_NOT_INTEREST_EVENT:
      var instTemp = state.notInterestEvent;
      var temp10 = instTemp.filter((list) => list !== action.data);
      return { ...state, notInterestEvent: temp10 };
      break;

    case ActionTypes.ADD_JOIN_EVENT:
      return {
        ...state,
        join: [...state.join, action.data],
      };
      break;
    case ActionTypes.REMOVE_JOIN_EVENT:
      var joinTemp = state.join;
      var temp11 = joinTemp.filter((list) => list !== action.data);
      return { ...state, join: temp11 };
      break;

    // Block & Blockcast
    case ActionTypes.ADD_JOIN_BLOCK:
      return {
        ...state,
        join_block: [...state.join_block, action.data],
      };
      break;

    case ActionTypes.REMOVE_JOIN_BLOCK:
      var temp12 = state.join_block;
      var result = temp12.filter((list) => list !== action.data);
      return { ...state, join_block: result };
      break;

    default:
      return state;
  }
};
