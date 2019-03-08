

import React, { Component } from 'react';
import HeadNavigationBar from "../head.navigation.bar";
import BordersMenu from "../borders.menu";

import './index.css';


class Pers extends Component {

  constructor(props) {
    super(props);
    this.state = {
   
    };
  }


  render() {
 
    return (
      <div className="pers">人事</div>
    );
  }
}

export default HeadNavigationBar(BordersMenu(Pers));
