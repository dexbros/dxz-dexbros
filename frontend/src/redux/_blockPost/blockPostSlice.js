/** @format */

import { createSlice } from "@reduxjs/toolkit";
import {
  createBlockPost,
  handleFetchBlockPosts,
  pinnedBlockPost,
  deleteBlockPost,
  editBlockPost,
  spamBlockPost,
  likePost,
} from "../../api/_blockPost/blockPostApi";

const groupPostSlice = createSlice({
  name: "groupPost",
  initialState: {
    posts: [],
    pinnedPost: null,
    events: [],
    spam: [],
    events: [],
  },
  reducers: {
    addPosts: (state, action) => {
      state.posts = action.payload;
    },
    prepandPosts: (state, action) => {
      state.posts = [action.payload, ...state.posts];
    },
  },
});

// Extract the action creators object and the reducer
const { actions, reducer } = groupPostSlice;

// Extract and export each action creator by name
export const { addPosts, prepandPosts } = groupPostSlice.actions;

export const handleCreatePost = (data) => async (dispatch) => {
  // console.log(data);
  const result = await createBlockPost(data);
  console.log("Result: ", result);
  try {
    return result.data;
  } catch (error) {
    console.log(error);
  }
};

export const fetchBlockPosts = (data) => async (dispatch) => {
  const response = await handleFetchBlockPosts(data);
  try {
    return response.posts;
  } catch (error) {
    console.log(error);
  }
};

export const handlePinnedBlockPost = (data) => async (dispatch) => {
  const result = await pinnedBlockPost(data);
  try {
    return result;
  } catch (error) {
    console.log(error);
  }
};

export const handleDeleteBlockPost = (data) => async (dispatch) => {
  const result = await deleteBlockPost(data);
  try {
    return result;
  } catch (error) {
    console.log(error);
  }
};

export const handleEditBlockPost = (data) => async (dispatch) => {
  const result = await editBlockPost(data);
  try {
    return result;
  } catch (error) {
    console.log(error);
  }
};

export const handleSpamBlockPost = (data) => async (dispatch) => {
  const result = await spamBlockPost(data);
  try {
    return result;
  } catch (error) {
    console.log(error);
  }
};

export const handleLikeBlockPost = (data) => async (dispatch) => {
  console.log("Came in slice");
  const result = await likePost(data);
  // console.log("RESULT: >> ", result);
  // try {
  //   return result;
  // } catch (error) {
  //   console.log(error);
  // }
};

// Export the reducer, either as a default or named export
export default reducer;
