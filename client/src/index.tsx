import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";

import SettingsContextProvider from "./context/settings-context";
import ArtsContextProvider from "./context/arts-context";

ReactDOM.render(
  <React.StrictMode>
    <SettingsContextProvider>
      <ArtsContextProvider>
        <App />
      </ArtsContextProvider>
    </SettingsContextProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
