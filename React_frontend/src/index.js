import React from "react";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";
import { createStore, applyMiddleware, compose } from "redux";
import { Provider } from "react-redux";
import createSagaMiddleware from "redux-saga";
import { composeWithDevTools } from "redux-devtools-extension";
import rootReducer from "./reducer";
import rootSaga from "./saga";
import ScrollTop from "./lib/ScrollTop";

const sagaMiddleware = createSagaMiddleware();
const enhancer =
  process.env.NODE_ENV === "production"
	? compose(applyMiddleware(sagaMiddleware))
	: composeWithDevTools(applyMiddleware(sagaMiddleware));

const store = createStore(rootReducer, enhancer);
sagaMiddleware.run(rootSaga);
const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <Provider store={store}>
    <BrowserRouter>
      <ScrollTop /> 
      <App />
    </BrowserRouter>
  </Provider>
);

reportWebVitals();
