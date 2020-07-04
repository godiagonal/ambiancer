import React from "react";
import { render } from "react-dom";
import { App } from "./App";
import * as serviceWorker from "./serviceWorker";
import { withStore } from "./store/withStore";

const Root = withStore(App);

render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
  document.getElementById("root"),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
