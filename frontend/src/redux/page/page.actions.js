/** @format */

import ActionTypes from "./page.types";

export const setPageType = (pageType) => ({
  type: ActionTypes.SET_PAGE_TYPE,
  pageType: pageType,
});

export const setDrawer = (data) => ({
  type: ActionTypes.DRAWER_HEANDLER,
  data: data,
});

export const setMobileDrawer = (data) => ({
  type: ActionTypes.MOBILE_DRAWER,
  data: data,
});

export const setScrollAxis = (data) => ({
  type: ActionTypes.SCROLL_AXIS,
  data: data,
});

export const setScrollHeight = (data) => ({
  type: ActionTypes.SCROLL_HEIGHT,
  data: data,
});
