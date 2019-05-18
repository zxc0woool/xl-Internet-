

import React, { Component } from 'react';
import HeadNavigationBar from "../head.navigation.bar";
import './index.css';

import BordersMenu from "../borders.menu";

import SystemYh from '../catalogs/system.yh';         //用户


class System extends Component {
  render() {
 
    return (
      <span className="system">系统</span>
    );
  }
}
function page(page) {

  switch(page){

    case "/system":
    case "/system_yh":
    return <SystemYh />;


    default :
    
  }

}

export default HeadNavigationBar(BordersMenu(System,page));
