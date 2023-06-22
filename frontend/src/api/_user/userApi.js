/** @format */

import { BASE_URL } from "../constants";
import { POST, GET, PUT, POSTFILE } from "../index";

export const registerUser = async (data) => {
  const ENDPOINT = "register";
  return handleRequest(ENDPOINT, data);
};

export const loginUser = async (data) => {
  const ENDPOINT = "login";
  return handleRequest(ENDPOINT, data);
};

export const getProfile = async (data) => {
  const ENDPOINT = `profile/fetch/${data.handleUn}`;
  return handleFetchRequest(ENDPOINT, data.isToken);
};

export const fetchProfileAnalytics = async (data) => {
  const ENDPOINT = `api/users/analytics/${data.handleUn}`;
  return handleFetchRequest(ENDPOINT, data.isToken);
};

// Generic handler for POST requests
const handleRequest = async (endpoint, data) => {
  try {
    const response = await POST(BASE_URL, endpoint, data);
    return response.data;
  } catch (error) {
    let errorMessage = "Something went wrong.";

    if (error.response) {
      errorMessage = `Error: ${error.response.status} - ${errorMessage}`;
    } else if (error.request) {
      errorMessage = "Server did not respond.";
    }

    throw new Error(errorMessage);
  }
};

//
const handleFetchRequest = async (endpoint, token) => {
  const response = await GET(BASE_URL, endpoint, token);
  try {
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const handleUpdateGender = async (data) => {
  const ENDPOINT = `api/users/update/gender`;
  const response = await PUT(BASE_URL, ENDPOINT, data.token, {
    gender: data.gender,
  });
  try {
    // console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

// handleUpdateLanguage
export const handleUpdateLanguage = async (data) => {
  const ENDPOINT = `api/users/update/language`;
  const response = await PUT(BASE_URL, ENDPOINT, data.token, {
    language: data.language,
  });
  try {
    // console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const handleUpdateCountry = async (data) => {
  const ENDPOINT = `api/users/update/country`;
  const response = await PUT(BASE_URL, ENDPOINT, data.token, {
    country: data.country,
  });
  try {
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const handleUpdateBirthday = async (data) => {
  const ENDPOINT = `api/users/update/country`;
  const response = await PUT(BASE_URL, ENDPOINT, data.token, {
    dob: data.dob,
  });
  try {
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const handleUpdateDisplayName = async (data) => {
  const ENDPOINT = `api/users/update/display_name`;
  const response = await PUT(BASE_URL, ENDPOINT, data.token, {
    name: data.name,
  });
  try {
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const handleUpdateBio = async (data) => {
  const ENDPOINT = `api/users/update/about`;
  const response = await PUT(BASE_URL, ENDPOINT, data.token, {
    bio: data.bio,
  });
  try {
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const handleUpdateLink = async (data) => {
  const ENDPOINT = `api/users/update/link`;
  const response = await PUT(BASE_URL, ENDPOINT, data.token, {
    link: data.link,
    linkName: data.linkName,
  });
  try {
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const handleUpdateProfilePrivacy = async (data) => {
  const ENDPOINT = `api/users/update/profile/privacy`;
  const response = await PUT(BASE_URL, ENDPOINT, data.token, {
    profileprivacy: data.profileprivacy,
  });
  try {
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const handleUpdatePostPrivacy = async (data) => {
  const ENDPOINT = `api/users/update/profile/comment`;
  const response = await PUT(BASE_URL, ENDPOINT, data.token, {
    cmnt_prv: data.cmnt_prv,
  });
  try {
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const handleUpdateProfileViewPrivacy = async (data) => {
  const ENDPOINT = `api/users/update/profile/visit/privacy`;
  const response = await PUT(BASE_URL, ENDPOINT, data.token, {
    prfl_prv: data.prfl_prv,
  });
  try {
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const handleUpdateProfileMessagePrivacy = async (data) => {
  const ENDPOINT = `api/users/update/profile/message/privacy`;
  const response = await PUT(BASE_URL, ENDPOINT, data.token, {
    msgPrivacy: data.msgPrivacy,
  });
  try {
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const handleUpdatePassword = async (data) => {
  const ENDPOINT = `api/users/update/password`;
  const response = await PUT(BASE_URL, ENDPOINT, data.token, {
    currentPassword: data.currentPassword,
    newPassword: data.newPassword,
  });
  try {
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const handleUpdateCover = async (data) => {
  const ENDPOINT = `api/users/cover/image`;
  const response = await POSTFILE(
    BASE_URL,
    ENDPOINT,
    data.isToken,
    data.coverImg,
    "coverPicture"
  );
  try {
    return response.data;
  } catch (error) {
    console.log("Error: ", error);
  }
};

export const handleUpdateProfileImage = async (data) => {
  const ENDPOINT = `api/users/profile/image`;
  const response = await POSTFILE(
    BASE_URL,
    ENDPOINT,
    data.isToken,
    data.profileImg,
    "p_iture"
  );
  try {
    return response.data;
  } catch (error) {
    console.log("Error: ", error);
  }
};

export const handleUpdateProfile = async (data) => {
  const ENDPOINT = `api/users/profile/image`;
  const response = await POSTFILE(
    BASE_URL,
    ENDPOINT,
    data.isToken,
    data.profileImg,
    "p_iture"
  );
  try {
    return response.data;
  } catch (error) {
    console.log("Error: ", error);
  }
};

export const handleUpdateUserInfo = async (data) => {
  const ENDPOINT = `api/users/update/personalInfo/${data.handleUn}`;
  const response = await PUT(BASE_URL, ENDPOINT, data.isToken, {
    log_un: data.log_un,
    name: data.name,
    gender: data.gender,
  });
  try {
    return response.data;
  } catch (error) {
    return error;
  }
};

export const UpdateUserInterest = async (data) => {
  const ENDPOINT = `api/users/update/interest/${data.handleUn}`;
  const response = await PUT(BASE_URL, ENDPOINT, data.isToken, {
    selected: data.interestsArr,
  });
  try {
    return response.data;
  } catch (error) {
    return error;
  }
};

export const updateUserProfileAvatar = async (data) => {
  const ENDPOINT = `api/users/update/avatar`;
  const response = await PUT(BASE_URL, ENDPOINT, data.isToken, {
    url: data.selectUrl,
  });
  try {
    return response.data;
  } catch (error) {
    return error;
  }
};

export const handleFetchProfileDetails = async (data) => {
  const ENDPOINT = `api/users/update/info/${data.handleUn}`;
  const response = await GET(BASE_URL, ENDPOINT, data.isToken);
  try {
    return response.data;
  } catch (error) {
    return error;
  }
};

export const updateFollowUser = async (data) => {
  console.log("HERE..........................");
  const ENDPOINT = `api/users/follow-following/${data.userId}`;
  const response = await PUT(BASE_URL, ENDPOINT, data.isToken);
  try {
    console.log(">>>> API: ", response);
    return response.data;
  } catch (error) {
    return error;
  }
};
