import React, { Component } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

// import the necessary modules here
import Header from "./components/Header";
import { Provider } from "react-redux"
import store from "./Pages/store";

import "./App.css";

class AppComp extends Component {
  render() {
    return (
      <Provider store={store}>
        <Header />
      </Provider>
    );
  }
}

export default AppComp;