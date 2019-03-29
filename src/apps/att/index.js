

import React, { Component } from 'react';
import HeadNavigationBar from "../head.navigation.bar";
import './index.css';

import BordersMenu from "../borders.menu";

import BcglPc from '../catalogs/bcgl.pc';         //班次页面
import BcglSjd from '../catalogs/bcgl.sjd';       //时间段页面
import KqsbQy from '../catalogs/kqsb.qy';         //区域页面
import KqsbSb from '../catalogs/kqsb.sb';         //设备页面
import TjbbYmxbb from '../catalogs/tjbb.ymxbb';   //月明细报表页面
import TjbbYtjbb from '../catalogs/tjbb.ytjbb';   //月统计报表页面

import BcglBmpb from '../catalogs/bcgl.bmpb';   //月统计报表页面
import BcglRypb from '../catalogs/bcgl.rypb';   //月统计报表页面
class Att extends Component {
  render() {
 
    return (
      <div className="att">考勤</div>
    );
  }
}
function page(page) {

  switch(page){

    case "/att":
    case "/kqsb_qy":
    return <KqsbQy />;

    case "/kqsb_sb":
    return <KqsbSb />;

    case "/bcgl_sjd":
    return <BcglSjd />;

    case "/bcgl_pc":
    return <BcglPc />;
    
    case "/tjbb_ymxbb":
    return <TjbbYmxbb />;

    case "/tjbb_ytjbb":
    return <TjbbYtjbb />;

    case "/bcgl_bmpb":
    return <BcglBmpb />;

    case "/bcgl_rypb":
    return <BcglRypb />;
    default :
    
  }

}

export default HeadNavigationBar(BordersMenu(Att,page));
