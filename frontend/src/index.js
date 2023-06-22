/** @format */

import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import { PersistGate } from "redux-persist/integration/react";

import { store, persistor } from "./redux/store";

import "./i18n";

// import "./index.css";
// import "./app.css";
import "./MyStyle.css";
import "./custom.css";

ReactDOM.render(
  <BrowserRouter>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </BrowserRouter>,
  document.getElementById("root")
);
