/** @format */

import { BASE_URL } from "../constants";
import {
  POST,
  GET,
  PUT,
  FormPost,
  DELETE,
  POSTWITHTOKEN,
  POSTFILE,
} from "../index";

export const getMyBlock = async (data) => {
  const endpoint = `api/group/my-group`;
  const result = await GET(BASE_URL, endpoint, data.token);
  try {
    return result;
  } catch (error) {
    console.log(error);
  }
};

// getJoinBlock
export const getJoinBlock = async (data) => {
  const endpoint = `api/group/join-group`;
  const result = await GET(BASE_URL, endpoint, data.token);
  try {
    return result;
  } catch (error) {
    console.log(error);
  }
};

// create new block
export const createNewBlock = async (data) => {
  const endpoint = `api/group`;
  const result = await POSTWITHTOKEN(BASE_URL, endpoint, data.token, data);
  try {
    return result;
  } catch (error) {
    console.log(error);
  }
};

export const fetchRecomendedBlock = async (data) => {
  const endpoint = `api/group/block/recomendation?page=${data.page}&limit=${data.limit}`;
  const result = await GET(BASE_URL, endpoint, data.token);
  try {
    return result;
  } catch (error) {
    console.log(error);
  }
};

export const addGroupMember = async (data) => {
  const endpoint = `api/group/follow/${data.id}`;
  const result = await PUT(BASE_URL, endpoint, data.token, data);
  console.log(result);
  try {
    return result;
  } catch (error) {
    console.log(error);
  }
};

export const blockSearch = async (data) => {
  const endpoint = `api/group/search/group?search=${data.search}`;
  const result = await GET(BASE_URL, endpoint, data.token);
  try {
    return result;
  } catch (error) {
    console.log(error);
  }
};

export const fetchBlock = async (data) => {
  const endpoint = `api/group/${data.id}`;
  const result = await GET(BASE_URL, endpoint, data.token);
  try {
    return result;
  } catch (error) {
    console.log(error);
  }
};

export const uploadCoverBlockImage = async (data) => {
  const endpoint = `api/group/cover-image/${data.id}`;
  const result = await POSTFILE(
    BASE_URL,
    endpoint,
    data.token,
    data.cover_img,
    "cover_img"
  );
  return result;
};

export const uploadProfileBlockImage = async (data) => {
  const endpoint = `api/group/profile-image/${data.id}`;
  const result = await POSTFILE(
    BASE_URL,
    endpoint,
    data.token,
    data.profile_img,
    "profile_img"
  );
  return result;
};

export const fetchGroupMembers = async (data) => {
  const endpoint = `api/group/fetch/block/members/${data.id}`;
  const result = await GET(BASE_URL, endpoint, data.token);
  try {
    return result;
  } catch (error) {
    console.log(error);
  }
};

export const updateBlockName = async (data) => {
  const endpoint = `api/group/update/name/${data.id}`;
  const response = await PUT(BASE_URL, endpoint, data.token, {
    name: data.name,
  });
  try {
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const updateBlockBio = async (data) => {
  const endpoint = `api/group/update/bio/${data.id}`;
  const response = await PUT(BASE_URL, endpoint, data.token, {
    bio: data.bio,
  });
  try {
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const getBlockMembers = async (data) => {
  const endpoint = `api/group/fetch/block/members/${data.id}`;
  const result = await GET(BASE_URL, endpoint, data.token);
  try {
    return result;
  } catch (error) {
    console.log(error);
  }
};

export const addBlockAdmin = async (data) => {
  const endpoint = `api/group/admin/members/${data.id}`;
  const response = await PUT(BASE_URL, endpoint, data.token, {
    username: data.username,
  });
  try {
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const updateBlockJoinPrivacy = async (data) => {
  const endpoint = `api/group/update/block/join/${data.id}`;
  const response = await PUT(BASE_URL, endpoint, data.token, {
    join_prv: data.join_prv,
  });
  try {
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const updateBlockPrivacy = async (data) => {
  const endpoint = `api/group/update/block/details/privacy/${data.id}`;
  const response = await PUT(BASE_URL, endpoint, data.token, {
    view: data.view,
  });
  try {
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const updateBlockMemberPrivacy = async (data) => {
  const endpoint = `api/group/update/block/members/list/privacy/${data.id}`;
  const response = await PUT(BASE_URL, endpoint, data.token, {
    l_view: data.l_view,
  });
  try {
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const updateBlockPostPrivacy = async (data) => {
  const endpoint = `api/group/update/post/${data.id}`;
  const response = await PUT(BASE_URL, endpoint, data.token, {
    post_prv: data.post_prv,
  });
  try {
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const updateBlockEventPrivacy = async (data) => {
  const endpoint = `api/group/update/create/event/${data.id}`;
  const response = await PUT(BASE_URL, endpoint, data.token, {
    event: data.event,
  });
  try {
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const updateDmBlockPrivacy = async (data) => {
  const endpoint = `api/group/update/dm/privacy/${data.id}`;
  const response = await PUT(BASE_URL, endpoint, data.token, {
    dm_prv: data.dm_prv,
  });
  try {
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const createBlockEvent = async (data) => {
  // (BASE_URL, endpoint, token, data)
  const endpoint = `api/group/post/event/create`;
  const response = await FormPost(BASE_URL, endpoint, data.token, data);
  try {
    return response;
  } catch (error) {
    console.log(error);
  }
};
