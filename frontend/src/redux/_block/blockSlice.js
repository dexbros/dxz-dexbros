/** @format */

import { createSlice } from "@reduxjs/toolkit";
import {
  getMyBlock,
  getJoinBlock,
  createNewBlock,
  fetchRecomendedBlock,
  addGroupMember,
  blockSearch,
  fetchBlock,
  uploadCoverBlockImage,
  uploadProfileBlockImage,
  fetchGroupMembers,
  updateBlockName,
  updateBlockBio,
  getBlockMembers,
  addBlockAdmin,
  updateBlockJoinPrivacy,
  updateBlockPrivacy,
  updateBlockMemberPrivacy,
  updateBlockPostPrivacy,
  updateBlockEventPrivacy,
  updateDmBlockPrivacy,
  createBlockEvent,
} from "../../api/_block/blockApi";

const groupSlice = createSlice({
  name: "group",
  initialState: {
    join_groups: [],
    recomended_group: [],
    my_group: [],
    selectGroup: null,
    groupData: null,
    updatedGroup: null,

    posts: [],
    comments: [],
    replies: [],
    updatePost: null,
    updateComment: null,

    myBlock: [],
    joinBlock: [],
  },
  reducers: {
    addRecomended: (state, action) => {
      state.recomended_group = action.payload;
    },
    addBlocks: (state, action) => {
      state.my_group = action.payload;
    },
    appendMyBlock: (state, action) => {
      state.my_group = [action.payload, ...state.my_group];
    },

    joinedBlock: (state, action) => {
      state.join_groups = action.payload;
    },

    setGroupData: (state, action) => {
      state.groupData = action.payload;
    },
    setUpdatedGroupData: (state, action) => {
      state.updatedGroup = action.payload;
    },
  },
});

// Extract the action creators object and the reducer
const { actions, reducer } = groupSlice;

// Extract and export each action creator by name
export const {
  addRecomended,
  addBlocks,
  joinedBlock,
  appendMyBlock,
  setGroupData,
  setUpdatedGroupData,
} = groupSlice.actions;

export const fetchMyBlock = (data) => async (dispatch) => {
  const response = await getMyBlock(data);
  try {
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const fetchJoinedBlock = (data) => async (dispatch) => {
  const response = await getJoinBlock(data);
  try {
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

// create a new block
export const handleCreateNewBlock = (data) => async (dispatch) => {
  const response = await createNewBlock(data);
  try {
    return response.data;
  } catch (error) {
    console.log("Error");
  }
};

// fetch recomended block
export const handleFetchRecomendedBlock = (data) => async (dispatch) => {
  const response = await fetchRecomendedBlock(data);
  try {
    return response;
  } catch (error) {
    console.log("Error");
  }
};

// join or remove from group as a member
export const handleAddGroupMember = (data) => async (dispatch) => {
  const response = await addGroupMember(data);
};

export const handleBlockSearch = (data) => async (dispatch) => {
  const result = await blockSearch(data);
  try {
    return result;
  } catch (error) {
    console.log(error);
  }
};

export const handleFetchBlock = (data) => async (dispatch) => {
  const result = await fetchBlock(data);
  try {
    return result.data;
  } catch (error) {
    console.log(error);
  }
};

export const handleCoverImage = (data) => async (dispatch) => {
  const response = await uploadCoverBlockImage(data);
  try {
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const handleProfileImage = (data) => async (dispatch) => {
  const response = await uploadProfileBlockImage(data);
  try {
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const handleFetchGroupMembers = (data) => async (dispatch) => {
  const response = await fetchGroupMembers(data);
  try {
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const handleUpdateBlockName = (data) => async (dispatch) => {
  const response = await updateBlockName(data);
  try {
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const handleUpdateBlockBio = (data) => async (dispatch) => {
  const response = await updateBlockBio(data);
  try {
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const handleFetchBlockMembers = (data) => async (dispatch) => {
  const response = await getBlockMembers(data);
  try {
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const handleAddBlockAdmin = (data) => async (dispatch) => {
  const response = await addBlockAdmin(data);
  try {
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const handleUpdateBlockJoinPrivacy = (data) => async (dispatch) => {
  const response = await updateBlockJoinPrivacy(data);
  try {
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const handleUpdateBlockPrivacy = (data) => async (dispatch) => {
  const response = await updateBlockPrivacy(data);
  try {
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const handleUpdateBlockMembersPrivacy = (data) => async (dispatch) => {
  const response = await updateBlockMemberPrivacy(data);
  try {
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const handleUpdateBlockPostPrivacy = (data) => async (dispatch) => {
  const response = await updateBlockPostPrivacy(data);
  try {
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const handleUpdateBlockEventPrivacy = (data) => async (dispatch) => {
  const response = await updateBlockEventPrivacy(data);
  try {
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const handleUpdateDmBlockPrivacy = (data) => async (dispatch) => {
  const response = await updateDmBlockPrivacy(data);
  try {
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const handleCreateEvent = (data) => async (dispatch) => {
  const response = await createBlockEvent(data);
  try {
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

// Export the reducer, either as a default or named export
export default reducer;
