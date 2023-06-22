/** @format */

import ActionTypes from "./page.types";

const INITIAL_STATE = {
  pageType: "default",
  isOpen: false,
  openDrawer: false,
  axisValue: 0,
  scrollHeight: 0,
};

export const pageReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ActionTypes.SET_PAGE_TYPE:
      return {
        ...state,
        pageType: action.pageType,
      };

    /*
    case ActionTypes.SCROLL_AXIS:
      return {
        ...state,
        axisValue: action.data,
      };

    case ActionTypes.DRAWER_HEANDLER:
      return {
        ...state,
        isOpen: action.data,
      };

    case ActionTypes.MOBILE_DRAWER:
      return {
        ...state,
        openDrawer: action.data,
      };

    case ActionTypes.SCROLL_HEIGHT:
      return {
        ...state,
        scrollHeight: action.data,
      };
    default:
      return state;
  */
  }
};
