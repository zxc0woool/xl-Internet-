

import React, { Component } from 'react';
import HeadNavigationBar from "../head.navigation.bar";
import './index.css';

import BordersMenu from "../borders.menu";

class Att extends Component {
  render() {
 
    return (
      <div className="att">考勤</div>
    );
  }
}

export default HeadNavigationBar(BordersMenu(Att));
