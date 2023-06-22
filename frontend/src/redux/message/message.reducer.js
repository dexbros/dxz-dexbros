import ActionTypes from './message.types';
import { store } from '../store';

const INITIAL_STATE = {
  likes: [],
  save: [],
  selectMessage: null
};


export const MessageReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) { 
    case ActionTypes.UPDATE_MESSAGE: 
      // console.log("MESSAGE", action)
      return {
        ...state,
        selectMessage: action.data,
      };
      break;
    
    case ActionTypes.SAVE_MESSAGE: 
      return {
        ...state, save : [ ...state.save, action.data],
      }
    
    default:
      return state;
  }
}