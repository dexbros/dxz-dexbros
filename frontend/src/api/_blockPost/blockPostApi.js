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

export const createBlockPost = async (data) => {
  console.log(data);
  const endpoint = `api/group/post/create/post/${data.id}`;
  const response = await FormPost(BASE_URL, endpoint, data.token, data);
  try {
    return response;
  } catch (error) {
    console.log("Error: ", error);
  }
};

export const handleFetchBlockPosts = async (data) => {
  const endpoint = `api/group/post/${data.id}?sortedBy=${data.sortedBy}&page=${data.page}&limit=${data.limit}`;
  const response = await GET(BASE_URL, endpoint, data.token);
  try {
    return response.data;
  } catch (error) {
    console.log("Error: ", error);
  }
};

export const pinnedBlockPost = async (data) => {
  const endpoint = `api/group/post/pinned/${data.postId}`;
  const response = await PUT(BASE_URL, endpoint, data.token, data);
  try {
    return response;
  } catch (error) {
    console.log("Error: ", error);
  }
};

export const deleteBlockPost = async (data) => {
  const endpoint = `api/group/post/delete/${data.postId}`;
  const response = await PUT(BASE_URL, endpoint, data.token, data);
  try {
    return response;
  } catch (error) {
    console.log("Error: ", error);
  }
};

// editBlockPost
export const editBlockPost = async (data) => {
  const endpoint = `api/group/post/edit/${data.postId}`;
  const response = await PUT(BASE_URL, endpoint, data.token, {
    content: data.content,
  });
  try {
    return response;
  } catch (error) {
    console.log("Error: ", error);
  }
};

export const spamBlockPost = async (data) => {
  const endpoint = `api/group/post/spam/${data.id}`;
  const response = await PUT(BASE_URL, endpoint, data.token, {
    content: data.content,
  });
  try {
    return response;
  } catch (error) {
    console.log("Error: ", error);
  }
};

export const likePost = async (data) => {
  console.log("Block post API");
  // api/group/post/like/${postId}
  const endpoint = `api/group/post/${data.value}/${data.postId}`;
  const response = await PUT(BASE_URL, endpoint, data.token, data);
  console.log("END POINT:", endpoint);
  // try {
  //   return response;
  // } catch (error) {
  //   console.log("Error: ", error);
  // }
};
