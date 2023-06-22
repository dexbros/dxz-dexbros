/** @format */

import ActionTypes from "./groupPost.types";

const INITIAL_STATE = {
  posts: [],
  pinnedPost: null,
  events: [],
  spam: [],
  events: [],
};

export const groupPostReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    // case ActionTypes.SET_PINNED_POST:
    //   return {
    //     ...state,
    //     pinnedPost: action.post,
    //   };
    //   break;
    case ActionTypes.UPDATE_GROUP_POST:
      return {
        ...state,
        pinnedPost: action.data,
      };
      break;

    case ActionTypes.ADD_NEW_POST:
      return {
        ...state,
        posts: [action.posts, ...state.posts],
      };
      break;

    case ActionTypes.GROUP_NEW_POSTS:
      return {
        ...state,
        posts: action.data,
      };
      break;
    case ActionTypes.GROUP_PUT_POSTS_LAST:
      return {
        ...state,
        posts: [...state.posts, ...action.data],
      };
      break;

    case ActionTypes.REMOVE_EVENT:
      var allEvents = state.events;
      var temp7 = allEvents.filter((list) => list !== action.data);
      return { ...state, events: temp7 };
      break;
    // Add group post
    case ActionTypes.ADD_GROUP_POST:
      return {
        ...state,
        posts: action.data,
      };
      break;

    // Set group post when page is set to 1
    case ActionTypes.SET_GROUP_POSTS:
      return {
        ...state,
        posts: action.data,
      };
      break;

    case ActionTypes.APPEND_SINGLE_POST:
      return {
        ...state,
        pinnedPost: action.data,
      };

    case ActionTypes.ADD_EVENTS:
      return {
        ...state,
        events: action.data,
      };

    case ActionTypes.PUT_EVENT_FIRST:
      return {
        ...state,
        posts: [action.data, ...state.events],
      };
    default:
      return state;
  }
};
