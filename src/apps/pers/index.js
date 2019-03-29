

import React, { Component } from 'react';
import HeadNavigationBar from "../head.navigation.bar";
import BordersMenu from "../borders.menu";

import './index.css';
import RyglRy from '../catalogs/rygl.ry'

import RyglRzry from '../catalogs/rygl.lzry';     //离职人员页面
import RyglBm from '../catalogs/rygl.bm';         //部门页面
import RyglZw from '../catalogs/rygl.zw';         //职位页面


class Pers extends Component {

  constructor(props) {
    super(props);
    this.state = {
      ress:'RyglRy',
      page:"404"
    };
  }

  render() {
    
    return (
      <div className="pers">人事</div>
    );
  }
}
function page(page) {

  switch(page){

    case "/pers":
    case "/rygl_ry":
    return <RyglRy />;

    case "/rygl_lzry":
    return <RyglRzry />;

    case "/rygl_bm":
    return <RyglBm />;

    case "/rygl_zw":
    return <RyglZw />;

    default :
  }

}
export default HeadNavigationBar(BordersMenu(Pers,page));
