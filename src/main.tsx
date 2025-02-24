import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App.tsx";
import { Provider } from "./provider.tsx";
import { GlobalConfigProvider } from "./config/GlobalConfig.tsx";
import "@/styles/globals.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <GlobalConfigProvider>
        <Provider>
          <App />
        </Provider>
      </GlobalConfigProvider>
    </BrowserRouter>
  </React.StrictMode>
);
