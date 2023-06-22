/** @format */

import ActionTypes from "./notification.types";

export const putNotifications = (notifications) => ({
  type: ActionTypes.PUT_NOTIFICATION,
  notifications: notifications,
});

export const updateNotification = (notification) => ({
  type: ActionTypes.UPDATE_NOTIFICATION,
  notification: notification,
});

export const newNotification = (notification) => ({
  type: ActionTypes.NEW_NOTIFICATION,
  notification: notification,
});

export const setNotificationCount = (count) => ({
  type: ActionTypes.SET_NOTIFICATION_COUNT,
  count: count,
});

export const updateNotificationCount = () => ({
  type: ActionTypes.UPDATE_NOTIFICATION_COUNT,
});
