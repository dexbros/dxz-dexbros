/** @format */

import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import { rootReducer } from "./rootReducer";

import logger from "redux-logger";

const logMiddleware = [logger];

const persistConfig = {
  key: "root",
  storage,
  blacklist: [
    "search",
    "pregame",
    "notification",
    "results",
    "message",
    "comment",
    "post",
    "group",
    "notification",
  ],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(logMiddleware),
});

const persistor = persistStore(store);
//persistor.purge();
export { store, persistor };
