
import React, { Component } from 'react';
import { Menu, Icon } from 'antd';
import { Link } from 'react-router-dom'
import Util from '../../uilt/http.utils';

import cookie from '../../uilt/cookie';
import logo from '../../images/login/logo.png';
import './index.css';

function HeadNavigationBar(MyappedComponent) {

  return class HeadNavigationBar extends Component {
    constructor(props) {
      super(props);
      this.state = {
        UserName: '',
        current: '',
        url: '',
        catalog: {
          pers: [
            {
              name: '人员管理',
              key: 'pers',
              icon: 'user',
              use: true,
              vals: [
                { name: '人员', url: '/rygl_ry' },
                { name: '部门', url: '/rygl_bm' },
                { name: '职位', url: '/rygl_zw' },
                { name: '离职人员', url: '/rygl_lzry' }
              ]
            }
          ],
          att: [
            {
              name: '考勤设备',
              icon: 'credit-card',
              key: 'att',
              vals: [
                { name: '区域', url: '/kqsb_qy' },
                { name: '设备', url: '/kqsb_sb' }
              ]
            },
            {
              name: '班次管理',
              icon: 'file-protect',
              key: 'att',
              vals: [
                { name: '时间段', url: '/bcgl_sjd' },
                { name: '班次', url: '/bcgl_pc' }
              ]
            },
            {
              name: '排班管理',
              icon: 'solution',
              key: 'att',
              vals: [
                { name: '部门排班', url: '/bcgl_bmpb' },
                { name: '人员排班', url: '/bcgl_rypb' }
              ]
            },
            {
              name: '统计报表',
              icon: 'file-done',
              key: 'att',
              vals: [
                { name: '日打卡详情表', url: '/tjbb_rdkxqb' },
                { name: '月明细报表', url: '/tjbb_ymxbb' },
                { name: '月统计报表', url: '/tjbb_ytjbb' }
              ]
            },
            // {
            //   name:'补签单',
            //   url:'/ycgl_bqd'
            // }
          ],
        }


      };

    }
    componentDidMount() {
      //获取用户信息
      let obj = JSON.parse(cookie.getCookie('user'));

      if (obj && obj.user) {
        let user = obj.user;
        this.setState({
          UserName: user.name
        });

      } else {
        this.props.history.push('/');
      }
      //获取URL
      this.setState({
        url: this.props.match.url
      });

    }

    componentWillReceiveProps() {
      //跟踪地址

      if (this.props.history.location.pathname !== this.props.location.pathname) {

        this.props.history.push(this.props.history.location.pathname);
        this.props.history.goBack()

      }
    }

    handleClick(val) {
      this.setState({
        current: val.key,
      });

    }

    render() {
      return (
        <div className="top-head-navigation-bar">
          <div className="head-navigation-bar">
            {/* <Link to="/index" >  */}
            <img title="主页" src={logo} className="top-box-logo" alt="logo" />
            {/* </Link> */}
            <div className="top-box">
              <Menu onClick={this.handleClick.bind(this)}
                selectedKeys={[this.state.current]}
                mode="horizontal">
                <Menu.Item style={this.props.match.url === "/pers" ? { backgroundColor: '#693be6' } : {}} title="人事" key="pers">
                  <Link to="/pers">
                    {/* <Icon type="user" /> */}
                    人事管理
                    {
                      this.props.match.url === "/pers" ? <i className="choice"></i> : ""
                    }
                  </Link>
                </Menu.Item>
                {/* <Menu.Item key="app">
                  <Icon type="heat-map" />门禁
                </Menu.Item> */}
                <Menu.Item style={this.props.match.url === "/att" ? { backgroundColor: '#693be6' } : {}} title="考勤" key="att">
                  <Link to="/att">
                    {/* <Icon type="solution" /> */}
                    考勤管理
                    {
                      this.props.match.url === "/att" ? <i className="choice"></i> : ""
                    }
                  </Link>
                </Menu.Item>
              </Menu>


            </div>
            <div className="top-r-box-showcompany">
              <span title={this.state.UserName} className="top-user">用户：{this.state.UserName}</span>
              <div title="用户" className="top-icon">
                {/* <Link to="/user"> */}
                <Icon type="user" />
                {/* </Link> */}
              </div>
              <div title="关于" className="top-icon">
                <Icon type="exclamation-circle" />
              </div>
              <div title="帮助" className="top-icon">
                <Icon type="question-circle" />
              </div>


            </div>

          </div>
          <MyappedComponent {...this.props} {...this.state} />
        </div>

      );
    }
  }

}



export default HeadNavigationBar;
