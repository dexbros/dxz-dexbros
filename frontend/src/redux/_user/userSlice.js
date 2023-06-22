/** @format */

import { createSlice } from "@reduxjs/toolkit";
import {
  registerUser,
  loginUser,
  getProfile,
  fetchProfileAnalytics,
  handleUpdateGender,
  handleUpdateLanguage,
  handleUpdateCountry,
  handleUpdateBirthday,
  handleUpdateDisplayName,
  handleUpdateBio,
  handleUpdateLink,
  handleUpdateProfilePrivacy,
  handleUpdatePostPrivacy,
  handleUpdateProfileViewPrivacy,
  handleUpdateProfileMessagePrivacy,
  handleUpdatePassword,
  handleUpdateCover,
  handleUpdateProfileImage,
  handleUpdateUserInfo,
  UpdateUserInterest,
  updateUserProfileAvatar,
  handleFetchProfileDetails,
  updateFollowUser,
} from "../../api/_user/userApi";

//reset state helper function
const resetState = (state) => {
  state.isLoading = true;
  state.responseType = "idle";
  state.response = null;
};

//success helper function
const successLoginRegister = (state, action) => {
  state.user = action.payload.user;
  state.isToken = action.payload.token;
  state.isLoading = false;
  state.responseType = "success";
  state.isLoggedIn = true;
};

//success helper function
const successUserUpdate = (state, action) => {
  state.user = action.payload.user;
  state.isToken = action.payload.token;
  state.isLoading = false;
  state.responseType = "success";
  state.isLoggedIn = true;
};

//error or fail helper function
const handleFail = (state, action) => {
  state.responseType = "error";
  state.response = action.payload;
  state.isLoading = false;
};

//create slice
export const userSlice = createSlice({
  name: "user",
  initialState: {
    user_analytics: null,
    profile: null,
    isLoggedIn: false,
    user: null,
    isToken: null,
    likes: [],
    spam: [],
    shares: [],
    dislikes: [],
    poll: [],
    following: [],
    followers: [],
    update: null,
    hide: [],
    bookmark: [],
    angry: [],
    updateUser: null,

    emoji_likes: [],
    emoji_angry: [],
    emoji_haha: [],
    emoji_dislikes: [],

    // Blockcast
    blockcast: [],
    myblockcast: [],
    updateBlockcast: null,

    // Comment
    cmntLike: [],
    cmntDislike: [],
    cmntSpam: [],

    // news post
    reliable: [],
    intersting: [],
    fake: [],

    // informative post
    helpful: [],
    unhelpful: [],
    misleading: [],

    // Announcement post
    likeAnc: [],
    impAnc: [],

    interestEvent: [],
    notInterestEvent: [],
    join: [],

    join_block: [],
    my_block: [],
    searchHistory: [],
    searchTag: [],
  },
  reducers: {
    //for register
    registerStart: resetState,
    registerSuccess: successLoginRegister, //call helper function
    registerFail: handleFail,

    //for login
    loginStart: resetState,
    loginSuccess: successLoginRegister,
    loginFail: handleFail,

    //for user update
    userUpdateStart: resetState,
    userUpdateSuccess: successUserUpdate,
    userUpdateFail: handleFail,

    //clear messages
    clearMessages: resetState,

    setSearchHistory: (state, action) => {
      state.searchHistory = [...state.searchHistory, action.payload];
    },

    setSearchTag: (state, action) => {
      state.searchTag = [...state.searchTag, action.payload];
    },

    logout: (state, action) => {
      state.isLoggedIn = false;
      state.user = null;
      state.isToken = null;
    },

    setProfile: (state, action) => {
      state.profile = action.payload;
      state.isLoading = false;
    },
    setUserAnalytics: (state, action) => {
      state.user_analytics = action.payload;
      state.isLoading = false;
    },

    setUserUpdate: (state, action) => {
      state.updateUser = action.payload;
    },
    setAddSpam: (state, action) => {
      state.spam = [...state.spam, action.payload];
    },
    setRemoveSpam: (state, action) => {
      const arr = state.spam;
      const temp = arr.filter((data) => data !== action.payload);
      state.spam = temp;
    },

    // ***** ADDED
    // like
    addLike: (state, action) => {
      state.emoji_likes = [...state.emoji_likes, action.payload];
    },
    removeLike: (state, action) => {
      const arr = state.emoji_likes;
      const temp = arr.filter((data) => data !== action.payload);
      state.emoji_likes = temp;
    },

    // angry
    addAngry: (state, action) => {
      state.emoji_angry = [...state.emoji_angry, action.payload];
    },
    removeAngry: (state, action) => {
      const arr = state.emoji_angry;
      const temp = arr.filter((data) => data !== action.payload);
      state.emoji_angry = temp;
    },

    // haha
    addHAHA: (state, action) => {
      state.emoji_haha = [...state.emoji_haha, action.payload];
    },
    removeHaha: (state, action) => {
      const arr = state.emoji_haha;
      const temp = arr.filter((data) => data !== action.payload);
      state.emoji_haha = temp;
    },

    // dislikes
    addDislikes: (state, action) => {
      state.emoji_dislikes = [...state.emoji_dislikes, action.payload];
    },
    removeDislikes: (state, action) => {
      const arr = state.emoji_dislikes;
      const temp = arr.filter((data) => data !== action.payload);
      state.emoji_dislikes = temp;
    },

    /**
     * @COMMENT
     */
    addcommentSpam: (state, action) => {
      state.cmntSpam = [...state.cmntSpam, action.payload];
    },
    removecommentSpam: (state, action) => {
      const arr = state.cmntSpam;
      const temp = arr.filter((data) => data !== action.payload);
      state.cmntSpam = temp;
    },
  },
});

//export actions outside
export const {
  clearMessages,
  setAddSpam,
  setRemoveSpam,
  addLike,
  removeLike,
  addAngry,
  removeAngry,
  addHAHA,
  removeHaha,
  addDislikes,
  removeDislikes,
  addcommentSpam,
  removecommentSpam,
} = userSlice.actions;

//export actions inside
const {
  registerStart,
  registerSuccess,
  registerFail,
  loginStart,
  loginSuccess,
  loginFail,
  setSearchHistory,
  setSearchTag,
  logout,
  setProfile,
  userUpdateSuccess,
  setUserAnalytics,
  setUserUpdate,
} = userSlice.actions;

export const register = (data) => async (dispatch) => {
  dispatch(registerStart());
  try {
    const response = await registerUser(data);
    dispatch(registerSuccess(response));
  } catch (error) {
    dispatch(registerFail(error.message));
  }
};

export const login = (data) => async (dispatch) => {
  dispatch(loginStart());
  try {
    const response = await loginUser(data);
    dispatch(loginSuccess(response));
  } catch (error) {
    dispatch(loginFail(error.message));
  }
};

export const updateUserState = (data) => (dispatch) => {
  // console.log("Data: >> ", data);
  dispatch(userUpdateSuccess(data));
};

export const addToSearchHistory = (data) => (dispatch) => {
  dispatch(setSearchHistory(data));
};

export const setLogout = () => (dispatch) => {
  dispatch(logout());
};

export const fetchProfileDetails = (data) => async (dispatch) => {
  dispatch(registerStart());
  try {
    const profileData = await getProfile(data);
    dispatch(setProfile(profileData));
  } catch (error) {
    console.log(error);
  }
};

export const getProfileAnalytics = (data) => async (dispatch) => {
  dispatch(registerStart());
  try {
    const analyticsData = await fetchProfileAnalytics(data);
    dispatch(setUserAnalytics(analyticsData));
  } catch (error) {
    console.log(error);
  }
};

export const updateUserGender = (data) => async (dispatch) => {
  const userData = await handleUpdateGender(data);
  try {
    // console.log(userData);
    dispatch(userUpdateSuccess(userData));
  } catch (error) {
    console.log("Error: ", error);
  }
};

export const updateUserLanguage = (data) => async (dispatch) => {
  const userData = await handleUpdateLanguage(data);
  try {
    // console.log(userData);
    dispatch(userUpdateSuccess(userData));
  } catch (error) {
    console.log("Error: ", error);
  }
};

export const updateUserCountry = (data) => async (dispatch) => {
  const userData = await handleUpdateCountry(data);
  try {
    dispatch(userUpdateSuccess(userData));
  } catch (error) {
    console.log("Error: ", error);
  }
};

export const updateUserBirthday = (data) => async (dispatch) => {
  const userData = await handleUpdateBirthday(data);
  try {
    dispatch(userUpdateSuccess(userData));
  } catch (error) {
    console.log("Error: ", error);
  }
};

export const updateUserDisplayName = (data) => async (dispatch) => {
  const userData = await handleUpdateDisplayName(data);
  try {
    dispatch(userUpdateSuccess(userData));
  } catch (error) {
    console.log("Error: ", error);
  }
};

export const updateUserBio = (data) => async (dispatch) => {
  const userData = await handleUpdateBio(data);
  try {
    dispatch(userUpdateSuccess(userData));
  } catch (error) {
    console.log("Error: ", error);
  }
};

export const updateUProfileLink = (data) => async (dispatch) => {
  const userData = await handleUpdateLink(data);
  try {
    dispatch(userUpdateSuccess(userData));
  } catch (error) {
    console.log("Error: ", error);
  }
};

export const updateProfilePrivacy = (data) => async (dispatch) => {
  const userData = await handleUpdateProfilePrivacy(data);
  try {
    dispatch(userUpdateSuccess(userData));
  } catch (error) {
    console.log("Error: ", error);
  }
};

export const updatePostPriacy = (data) => async (dispatch) => {
  const userData = await handleUpdatePostPrivacy(data);
  try {
    dispatch(userUpdateSuccess(userData));
  } catch (error) {
    console.log("Error: ", error);
  }
};

export const updateProfileViewPrivacy = (data) => async (dispatch) => {
  const userData = await handleUpdateProfileViewPrivacy(data);
  try {
    dispatch(userUpdateSuccess(userData));
  } catch (error) {
    console.log("Error: ", error);
  }
};

export const updateMessagePrivacy = (data) => async (dispatch) => {
  const userData = await handleUpdateProfileMessagePrivacy(data);
  try {
    dispatch(userUpdateSuccess(userData));
  } catch (error) {
    console.log("Error: ", error);
  }
};

export const updateUserPassword = (data) => async (dispatch) => {
  const userData = await handleUpdatePassword(data);
  try {
    dispatch(userUpdateSuccess(userData));
    dispatch(logout());
  } catch (error) {
    console.log("Error: ", error);
  }
};

export const updateProfileCoverImage = (data) => async (dispatch) => {
  const userData = await handleUpdateCover(data);
  // console.log("File data came here: ", data);

  try {
    dispatch(userUpdateSuccess(userData));
  } catch (error) {
    console.log("Error: ", error);
  }
};

export const updateProfileImage = (data) => async (dispatch) => {
  const userData = await handleUpdateProfileImage(data);
  try {
    dispatch(userUpdateSuccess(userData));
  } catch (error) {
    console.log("Error: ", error);
  }
};

export const updateProfileHandle = (data) => async (dispatch) => {
  const userData = await handleUpdateUserInfo(data);
  // console.log(userData);
  try {
    return userData;
  } catch (error) {
    return "Something went wrong";
  }
};

export const handleUpdateUserInterest = (data) => async (dispatch) => {
  const userData = await UpdateUserInterest(data);
  // console.log(userData);
  try {
    return userData;
  } catch (error) {
    return "Something went wrong";
  }
};

export const handleFetchSuggestedUser = (data) => async (dispatch) => {
  console.log(data);
};

export const handleUpdateProfileAvatar = (data) => async (dispatch) => {
  const userData = await updateUserProfileAvatar(data);
  // console.log(userData);
  try {
    return userData;
  } catch (error) {
    return "Something went wrong";
  }
};

export const handleUpdateUserDetails = (data) => async (dispatch) => {
  const userData = await handleFetchProfileDetails(data);
  try {
    dispatch(userUpdateSuccess(userData));
  } catch (error) {
    console.log("Error: ", error);
  }
};

export const handleFollowUser = (data) => async (dispatch) => {
  console.log("Came in userSlice");
  const userData = await updateFollowUser(data);
  try {
    dispatch(setUserUpdate(userData));
  } catch (error) {
    console.log(error);
  }
};

export default userSlice.reducer;
