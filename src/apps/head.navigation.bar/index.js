
import React, { Component } from 'react';
import { Menu, Icon } from 'antd';
import { Link } from 'react-router-dom'

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
        url:'',
        catalog:{
          pers: [
            {
              name:'人员管理',
              key:'pers',
              icon:'user',
              use:true,
              vals:[
                {name:'人员',url:'/pers/rygl_ry'},
                {name:'部门',url:'/pers/rygl_bm'},
                {name:'职位',url:'/pers/rygl_zw'},
                {name:'离职人员',url:'/pers/rygl_lzry'}
              ]
            }
          ],
          att:[
            {
              name:'考勤设备',
              icon:'credit-card',
              key:'att',
              vals:[
                {name:'区域',url:'/att/kqsb_qy'},
                {name:'设备',url:'/att/kqsb_sb'}
              ]
            },
            {
              name:'班次管理',
              icon:'file-protect',
              key:'att',
              vals:[
                {name:'时间段',url:'/att/bcgl_sjd'},
                {name:'班次',url:'/att/bcgl_pc'}
              ]
            },
            {
              name:'统计报表',
              icon:'file-done',
              key:'att',
              vals:[
                {name:'月明细报表',url:'/att/tjbb_ymxbb'},
                {name:'月统计报表',url:'/att/tjbb_ytjbb'}
              ]
            }
          ],
        }
       

      };

    }
    componentDidMount() {
      //获取用户信息
      let obj = cookie.Get('user');
      if (obj && obj.user) {
        let user = obj.user;
        this.setState({
          UserName: user.UserName
        });
      }
      //获取URL
      this.setState({
        url:this.props.match.url
      });
    }

    componentWillReceiveProps() {

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
            <Link to="/index">
              <img title="主页" src={logo} className="top-box-logo" alt="logo" />
            </Link>
            <div className="top-box">
              <Menu onClick={this.handleClick.bind(this)}
                selectedKeys={[this.state.current]}
                mode="horizontal">
                <Menu.Item title="人事" key="pers">
                  <Link to="/pers/rygl_ry">
                    <Icon type="user" />人事
                </Link>
                </Menu.Item>
                {/* <Menu.Item key="app">
                  <Icon type="heat-map" />门禁
                </Menu.Item> */}
                <Menu.Item title="考勤" key="att">
                  <Link to="/att/kqsb_qy">
                    <Icon type="solution" />考勤
                </Link>
                </Menu.Item>
              </Menu>


            </div>
            <div className="top-r-box-showcompany">
              <span title={this.state.UserName} className="top-user">用户：{this.state.UserName}</span>
              <div title="用户" className="top-icon">
                <Icon type="user" />
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
