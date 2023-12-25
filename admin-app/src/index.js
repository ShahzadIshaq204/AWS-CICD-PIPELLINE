import "./i18n";
import App from "./App";
import React from "react";
import ReactDOM from "react-dom";
import configureStore from "./store";
import { Provider } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import * as serviceWorker from "./serviceWorker";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { onDebugMode } from "utils/helpers/environment";
import { ReactQueryDevtools } from "react-query/devtools";
import { QueryClient, QueryClientProvider } from "react-query";
import ThemeDirectionSwitcher from "layout-blueprint/layout/Theme/ThemeDirectionSwitcher";

const developMode = onDebugMode();
//
const queryClient = new QueryClient();
const store = configureStore();

const app = (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeDirectionSwitcher>
          <App />
        </ThemeDirectionSwitcher>
        {developMode && <ReactQueryDevtools initialIsOpen={false} />}
      </BrowserRouter>
    </QueryClientProvider>
    <ToastContainer
      autoClose={4500}
      containerId={"B"}
      closeOnClick={true}
      pauseOnHover={true}
      closeButton={false}
      position={toast.POSITION.TOP_RIGHT}
    />
  </Provider>
);

ReactDOM.render(app, document.getElementById("root"));
serviceWorker.unregister();
