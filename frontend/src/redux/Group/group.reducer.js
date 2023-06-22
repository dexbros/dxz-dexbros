import ActionTypes from "./group.types";

const INTIAL_STATE = {
  join_groups: [],
  recomended_group: [],
  my_group: [],
  selectGroup: null,
  groupData: null,
  updatedGroup: null,

  posts: [],
  comments: [],
  updatePost: null,
  updateComment: null,

  myBlock: [],
  joinBlock: [],
};

export const groupReducer = (state = INTIAL_STATE, action) => {
  switch (action.type) {
    case ActionTypes.ADD_NEW_RECOMENDED_GROUP:
      return {
        ...state,
        recomended_group: action.data
      };
      
    case ActionTypes.ADD_MY_GROUP:
      return {
        ...state,
        my_group: action.data
      };
    
    case ActionTypes.ADD_JOIN_GROUP:
      return {
        ...state,
        join_groups: action.data
      };

    case ActionTypes.SET_GROUP_DATA: 
      return {
          ...state,
          groupData: action.data
      }
    
    case ActionTypes.SET_UPDATE_GROUP_DATA:
      return {
          ...state,
          updatedGroup: action.data
      }

    
    // post
    
    case ActionTypes.ADD_GROUP_POST: 
      return {
        ...state,
        posts: action.data
      }
    
    case ActionTypes.UPDATE_GROUP_POST:
      console.log("UPDATE_GROUP_POST")
      return {
        ...state,
        updatePost: action.data
      };
    
    case ActionTypes.DELETE_GROUP_POST_DATA: 
      var postsCopy = state.posts
      const newPosts = postsCopy.filter(p => p.p_id != action.data)
      return {
        ...state,
        posts: newPosts
      };
    
      
    case ActionTypes.SET_SINGLE_GROUP_DATA: 
      return {
        ...state,
        selectGroup: action.data
      }
    
      
    case ActionTypes.ADD_BLOCKS:
      return {
        ...state,
        myBlock: action.data
      };
      
    case ActionTypes.ADD_MY_BLOCK:
      console.log("REDUCER++")
      return {
        ...state,
        myBlock: [action.data, ...state.myBlock]
      }
      break;
    
    case ActionTypes.REMOVE_MY_BLOCK:
      var blockArr = state.myBlock;
      var temp7 = blockArr.filter(list => list !== action.data);
      return { ...state, myBlock: temp7 };
      break;
    
    case ActionTypes.ADD_JOIN_BLOCK: 
      return {
        ...state,
        joinBlock: [...state.joinBlock, action.data]
      }
      break;
    
    case ActionTypes.REMOVE_MY_BLOCK:
      var blockArr = state.joinBlock;
      var temp8 = blockArr.filter(list => list !== action.data);
      return { ...state, joinBlock: temp8 };
      break;
    
    
    
    default: return state;
  }
};