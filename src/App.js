

import React, { Component } from 'react';
import style from './App.css';
import RouterMap from "./apps/router";
import './js/app';

class App extends Component {
  render() {
    return (
      <div className="App">
          <RouterMap />
      </div>
    );
  }
}

export default App;

