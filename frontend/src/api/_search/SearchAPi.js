/** @format */

import { BASE_URL } from "../constants";
import { POST, GET, PUT } from "../index";

export const getSearchResult = async (data) => {
  // const get1 = handleGetNotifications(ENDPOINT1, data.isToken);
  // const get2 = handleGetNotifications(ENDPOINT1, data.isToken);
  // const get3 = handleGetNotifications(ENDPOINT1, data.isToken);
  // return;
  const ENDPOINT1 = `api/users/search/user?search=${data.search}`;
  const ENDPOINT2 = `api/group/search/group?search=${data.search}`;
  const ENDPOINT3 = `api/posts/search/post?search=${data.search}`;
  return handleGetSearchResult(ENDPOINT1, ENDPOINT2, ENDPOINT3, data.isToken);
};

const handleGetSearchResult = async (
  endpoint1,
  endpoint2,
  endpoint3,
  token
) => {
  // try {
  //   const response = await GET(BASE_URL, endpoint, token);
  //   return response.data;
  // } catch (error) {
  //   console.log("Error in notifications");
  // }
  try {
    const response = await Promise.all([
      GET(BASE_URL, endpoint1, token),
      GET(BASE_URL, endpoint2, token),
      GET(BASE_URL, endpoint3, token),
    ]);
    return response;
  } catch (error) {
    console.log("ERROR: ", error);
  }
};
