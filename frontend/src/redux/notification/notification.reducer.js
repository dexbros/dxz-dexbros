/** @format */

import ActionTypes from "./notification.types";
import { store } from "../store";

const INITIAL_STATE = {
  notifications: [],
  notificationCount: 0,
};

export const notificationReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ActionTypes.PUT_NOTIFICATION:
      //   var user = store.getState().user;
      //   return {
      //     notifications: action.notifications.filter(
      //       (n) => n.userFrom._id != user._id
      //     ),
      //   };
      return {
        ...state,
        notifications: action.notifications,
      };
      break;

    case ActionTypes.NEW_NOTIFICATION:
      return {
        ...state,
        notifications: [action.notification, ...state.notifications],
      };

    case ActionTypes.UPDATE_NOTIFICATION:
      var notificationsCopy = state.notifications;
      const index = notificationsCopy.findIndex(
        (n) => n._id === action.notification._id
      );
      notificationsCopy[index] = action.notification;
      return { notifications: notificationsCopy };
      break;

    case ActionTypes.SET_NOTIFICATION_COUNT:
      return {
        ...state,
        notificationCount: action.count,
      };
      break;

    case ActionTypes.UPDATE_NOTIFICATION_COUNT:
      return {
        ...state,
        notificationCount: state.notificationCount + 1,
      };

    default:
      return state;
  }
};
