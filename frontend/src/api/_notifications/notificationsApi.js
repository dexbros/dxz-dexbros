/** @format */

import { BASE_URL } from "../constants";
import { POST, GET, PUT } from "../index";

export const getNotifications = async (data) => {
  const ENDPOINT = `api/notifications?page=${data.page}&limit=${data.limit}`;
  return handleGetNotifications(ENDPOINT, data.isToken);
};

const handleGetNotifications = async (endpoint, token) => {
  try {
    const response = await GET(BASE_URL, endpoint, token);
    return response.data;
  } catch (error) {
    console.log("Error in notifications");
  }
};
