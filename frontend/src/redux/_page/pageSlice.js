/** @format */

import { createSlice } from "@reduxjs/toolkit";

const pageSlice = createSlice({
  name: "page",
  initialState: {
    pageType: "default",
    isOpen: false,
    openDrawer: false,
    axisValue: "",
    scrollHeight: 0,
  },
  reducers: {
    setPageType: (state, action) => {
      state.pageType = action.payload;
    },

    setScrollAxis: (state, action) => {
      console.log(action.payload, "action");
      state.axisValue = action.payload;
    },

    setDrawerHandler: (state, action) => {
      state.isOpen = action.payload;
    },

    /*drawerHandler: (state, action) => {
      state.isOpen = action.payload;
    },
    mobileDrawer: (state, action) => {
      state.openDrawer = action.payload;
    },
    scrollHeight: (state, action) => {
      state.scrollHeight = action.payload;
    },
    */
  },
});

// Extract the action creators object and the reducer
const { actions, reducer } = pageSlice;

// Extract and export each action creator by name
export const { setPageType, setScrollAxis, setDrawerHandler } = actions;

// Export the reducer, either as a default or named export
export default reducer;
