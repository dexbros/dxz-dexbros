import ActionTypes from "./group.types";



export const newRecomendedGroups = (data) => ({
  type: ActionTypes.ADD_NEW_RECOMENDED_GROUP,
  data: data
});

export const newMyGroups = (data) => ({
  type: ActionTypes.ADD_MY_GROUP,
  data: data
});

export const newJoinGroups = (data) => ({
  type: ActionTypes.ADD_JOIN_GROUP,
  data: data
});

export const selectGroup = (data) => ({
  type: ActionTypes.SELECT_GROUP,
  data: data
});

export const setGroupData = (data) => ({
  type: ActionTypes.SET_GROUP_DATA,
  data: data
})

export const setUpdateGroup = (data) => ({
  type: ActionTypes.SET_UPDATE_GROUP_DATA,
  data: data
})

export const addGroupPost = (data) => ({
  type: ActionTypes.ADD_GROUP_POST,
  data: data
})

export const updateGroupPost = (data) => ({
  type: ActionTypes.UPDATE_GROUP_POST,
  data: data
});

export const deleteGroupPost = (data) => ({
  type: ActionTypes.DELETE_GROUP_POST_DATA,
  data: data
});

export const addPostComment = (data) => ({
  type: ActionTypes.ADD_GROUP_COMMENTS,
  data: data
});

export const updatePostComment = (data) => ({
  type: ActionTypes.UPDATE_GROUP_COMMENTS,
  data: data
})

export const deletePostComment = (data) => ({
  type: ActionTypes.DELETE_GROUP_COMMENT,
  data: data,
});

export const setSingleGroup = (data) => ({
  type: ActionTypes.SET_SINGLE_GROUP_DATA,
  data: data,
});

export const addBlocks = (data) => ({
  type: ActionTypes.ADD_BLOCKS,
  data: data
});

export const addMyBlock = (data) => ({
  type: ActionTypes.ADD_MY_BLOCK,
  data: data,
});
export const removeMyBlock = (data) => ({
  type: ActionTypes.REMOVE_MY_BLOCK,
  data: data,
});

export const addJoinBlock = (data) => ({
  type: ActionTypes.ADD_JOIN_BLOCK,
  data: data,
});
export const removeJoinBlock = (data) => ({
  type: ActionTypes.REMOVE_JOIN_BLOCK,
  data: data,
});