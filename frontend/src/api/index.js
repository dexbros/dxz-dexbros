/** @format */

import axios from "axios";

export const GET = (baseUrl, endpoint, token) => {
  return axios.get(`${baseUrl}${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const POST = (baseUrl, endpoint, data) => {
  return axios.post(`${baseUrl}${endpoint}`, data);
};

export const PUT = (baseUrl, endpoint, token, data) => {
  return axios.put(`${baseUrl}${endpoint}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const POSTFILE = (baseUrl, endpoint, token, data, key) => {
  const formData = new FormData();
  formData.append(key, data);
  return axios.post(`${baseUrl}${endpoint}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
};

export const POSTForm = (baseUrl, endpoint, token, data, key) => {
  const formData = new FormData();
  formData.append(key, data);
  return axios.post(`${baseUrl}${endpoint}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
};

export const DELETE = (baseUrl, endpoint, token) => {
  console.log("Delete starting");
  return axios.delete(`${baseUrl}${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const POSTWITHTOKEN = (baseUrl, endpoint, token, data) => {
  return axios.post(`${baseUrl}${endpoint}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
/***
 *
 */

export const PATCH = (baseUrl, endpoint, data) => {
  return axios.patch(`${baseUrl}${endpoint}`, data);
};

export const HEAD = (baseUrl, endpoint, params) => {
  return axios.head(`${baseUrl}${endpoint}`, { params });
};

export const OPTIONS = (baseUrl, endpoint, params) => {
  return axios.options(`${baseUrl}${endpoint}`, { params });
};

export const FormPost = (baseUrl, endpoint, token, data) => {
  const keys = Object.keys(data.post);
  const values = Object.values(data.post);
  var formData = new FormData();

  for (let i = 0; i < keys.length; i++) {
    formData.append(keys[i], values[i]);
  }
  console.log(data);
  return axios.post(`${baseUrl}${endpoint}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
};
