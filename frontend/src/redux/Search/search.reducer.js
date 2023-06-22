import ActionTypes from "./search.types";

const INITIAL_STATE = {
  search: null,
  all: [],
  searchposts: [],
  people: [],
  searchblock: [],
  recentData: []
}

export const searchReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ActionTypes.USER_SEARCH_KEY:
      return {
        ...state,
        search: action.data
      }
      
      
    case ActionTypes.ALL_SEARCH:
      return {
        ...state,
        all: action.data
      };
      
    case ActionTypes.POST_SEARCH:
      return {
        ...state,
        searchposts: action.data
      };
      
    case ActionTypes.PEOPLE_SEARCH:
      return {
        ...state,
        people: action.data
      };
      
    case ActionTypes.BLOCK_SAERCH:
      return {
        ...state,
        searchblock: action.data
      };
    
    case ActionTypes.RECENT_SEARCH:
      return {
        ...state,
        recentData: [...state.recentData, action.data]
      };





      
      
    
    case ActionTypes.DELETE_RECENT_SEARCH:
      var searchCopy = state.recentData;
      console.log("delete reducer");
      // console.log(action.data)
      var newRecentData = searchCopy.filter(data => data.u_id !== action.data);
      console.log(newRecentData)
      return {
        ...state,
        recentData: newRecentData
      }


    default: return state
  }
};