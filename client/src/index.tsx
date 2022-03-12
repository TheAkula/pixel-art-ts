import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";

import ArtsContextProvider from "./context/arts-context";

ReactDOM.render(
  <React.StrictMode>
    <ArtsContextProvider>
      <App />
    </ArtsContextProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
