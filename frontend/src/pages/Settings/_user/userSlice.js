/** @format */

import { createSlice } from "@reduxjs/toolkit";
import registerUser from "../../../api/users/register";

export const userSlice = createSlice({
  name: "tUser",
  initialState: {
    user: null,
    token: null,
    isLoading: false,
    responseSuccess: null,
    responseError: null,
  },
  reducers: {
    registerStart: (state) => {
      state.isLoading = true;
      state.responseSuccess = null;
      state.responseError = null;
    },
    registerSuccess: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isLoading = false;
      state.responseSuccess = "Registration successful";
    },
    registerFail: (state, action) => {
      state.responseError = action.payload;
      state.isLoading = false;
    },
  },
});

export const { registerStart, registerSuccess, registerFail } =
  userSlice.actions;

export const register = (data) => async (dispatch) => {
  dispatch(registerStart());

  try {
    const response = await registerUser(data);

    dispatch(registerSuccess(response));
  } catch (error) {
    dispatch(registerFail(error.message));
  }
};

export const selectUser = (state) => state.user.user;
export const selectToken = (state) => state.user.token;
export const selectLoading = (state) => state.user.isLoading;
export const selectError = (state) => state.user.error;

export default userSlice.reducer;
