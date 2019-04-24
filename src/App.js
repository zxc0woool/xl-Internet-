

import React, { Component } from 'react';
import style from './App.less';
import RouterMap from "./apps/router";
import './js/app';

class App extends Component {
  render() {
    return (
      <div className={style["App"]}>
          <RouterMap />
      </div>
    );
  }
}

export default App;

