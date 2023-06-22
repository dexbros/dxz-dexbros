import ActionTypes from "./comment.types";

const INITIAL_STATE = {
  comments: [],
  likes: 0,
  spams: [],
  pin: [],
  bookmarks: [],
  comment: null,
  post: ""
}

export const commentReducers = (state = INITIAL_STATE, action) => {
  //console.log("state:", action);
  switch (action.type) {
    // *** Add comments into the array
    case ActionTypes.ADD_COMMENT:
      //console.log("action.comments:",action.comments);
      return {
        ...state, comments: [...state.comments, ...action.comments]
      }
      break;
    case ActionTypes.SELECT_POST: {
      return {
        ...state, post: action.data
      }
    }
    case ActionTypes.ADD_LIKE: {
      return {
        ...state, likes: state.data
      }
    }
    default:
      return state;
  }
};