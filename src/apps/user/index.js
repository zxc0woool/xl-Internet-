

import React, { Component } from 'react';
import { Icon, Table } from 'antd';
import HeadNavigationBar from "../head.navigation.bar";
import cookie from '../../uilt/cookie';
import style from './index.less';


class User extends Component {
  constructor(props) {
    super(props);
    this.state = {
      UserName: ""

    };

  }

  componentDidMount() {
    //获取用户信息
    let obj = JSON.parse(cookie.getCookie('user'));

    if (obj && obj.user) {
        let user = obj.user;
      
        this.setState({
            UserName: user.UserName
        });

    }

}
  render() {

    return (
     
      <div className={style["User"]}>
          <div className={style["text"]}>
            用户名：{this.state.UserName}
          </div>
  
      </div>
    );
  }
}



export default HeadNavigationBar(User);
