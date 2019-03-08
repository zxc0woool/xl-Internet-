

import React, { Component } from 'react';
// import Login from './apps/login';
// import HeadNavigationBar from "./apps/head.navigation.bar";
import './App.css';
import RouterMap from "./apps/router";

class App extends Component {
  render() {
    return (
      <div className="App">

          {/* <HeadNavigationBar /> */}
          <RouterMap />
      </div>
    );
  }
}

export default App;
