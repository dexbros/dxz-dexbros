/** @format */

import { createSlice } from "@reduxjs/toolkit";
import { getNotifications } from "../../api/_notifications/notificationsApi";

const notificationSlice = createSlice({
  name: "notification",
  initialState: {
    notifications: [],
    notificationCount: 0,
  },
  reducers: {
    putNotification: (state, action) => {
      state.notifications = action.notifications;
    },

    newNotification: (state, action) => {
      state.notifications = [action.notification, ...state.notifications];
    },

    updateNotification: (state, action) => {
      var notificationsCopy = state.notifications;
      const index = notificationsCopy.findIndex(
        (n) => n._id === action.notification._id
      );
      notificationsCopy[index] = action.notification;
      state.notifications = notificationsCopy;
    },
    setNotificationCount: (state, action) => {
      state.notificationCount = action.count;
    },
    updateNotificationCount: (state, actions) => {
      state.notificationCount = state.notificationCount + 1;
    },
  },
});

// Extract the action creators object and the reducer
const { actions, reducer } = notificationSlice;

// Extract and export each action creator by name
export const {
  putNotification,
  newNotification,
  updateNotification,
  setNotificationCount,
  updateNotificationCount,
} = notificationSlice.actions;

export const fetchNotifications = (data) => async (dispatch) => {
  console.log("NOTI Data >>> ", data);
  try {
    const notificationsData = await getNotifications(data);
    putNotification(notificationsData);
  } catch (error) {
    console.log("Error: ", error);
  }
  // dispatch(fetchPostsStart());
  // try {
  //   const posts = await getPosts(data);
  //   console.log("posts from serverrrrrrrrrrrrrrrr", posts);
  //   dispatch(fetchPostsSuccess(posts));
  // } catch (error) {
  //   dispatch(fetchPostsFail(error.toString()));
  // }
};

// Export the reducer, either as a default or named export
export default notificationSlice.reducer;
