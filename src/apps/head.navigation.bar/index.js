
import React, { Component } from 'react';
import { Menu, Icon } from 'antd';
import { Link } from 'react-router-dom'
import Util from '../../uilt/http.utils';
import About from '../controls/about';
import Personal from '../controls/personal';
import cookie from '../../uilt/cookie';
import logo from '../../images/login/logo.png';
import ElasticFrame from '../controls/elastic.frame';
import './index.css';

function HeadNavigationBar(MyappedComponent) {

  return class HeadNavigationBar extends Component {
    constructor(props) {
      super(props);
      this.state = {
        UserName: '',
        current: '',
        superStatus:'',
        isCancellation:false,
        url: '',
        popup: {
          about: {
            title: '关于',
            switch: false
          },
          personal: {
            title: '个人信息',
            switch: false
          }
        },
        catalog: {
          pers: [
            {
              name: '人员管理',
              key: 'pers',
              icon: 'user',
              superStatus:'2',
              use: true,
              vals: [
                { name: '人员', url: '/rygl_ry', superStatus:'2', use: true },
                { name: '部门', url: '/rygl_bm', superStatus:'2', use: true  },
                { name: '职位', url: '/rygl_zw', superStatus:'2', use: true  },
                { name: '离职人员', url: '/rygl_lzry', superStatus:'2', use: true  }
              ]
            }
          ],
          att: [
            {
              name: '考勤设备',
              icon: 'credit-card',
              key: 'att',
              superStatus:'1',
              use: true ,
              vals: [
                // { name: '区域', url: '/kqsb_qy', superStatus:'1', use: true  },
                { name: '设备', url: '/kqsb_sb', superStatus:'1', use: true, }
              ]
              
            },
            // {
            //   name: '班次管理',
            //   icon: 'file-protect',
            //   key: 'att',
            //   use: true ,
            //   superStatus:'2',
            //   vals: [
            //     { name: '时间段', url: '/bcgl_sjd', superStatus:'2', use: true  },
            //     { name: '班次', url: '/bcgl_pc', superStatus:'2', use: true  }
            //   ]
            // },
            // {
            //   name: '排班管理',
            //   icon: 'solution',
            //   key: 'att',
            //   superStatus:'2',
            //   use: true ,
            //   vals: [
            //     { name: '部门排班', url: '/bcgl_bmpb', superStatus:'2', use: true  },
            //     { name: '人员排班', url: '/bcgl_rypb', superStatus:'2', use: true  }
            //   ]
            // },
            {
              name: '统计报表',
              icon: 'file-done',
              key: 'att',
              superStatus:'2',
              use: true ,
              vals: [
                { name: '日打卡详情表', url: '/tjbb_rdkxqb', superStatus:'2', use: true  },
                { name: '门禁详情表', url: '/tjbb_mjxqb', superStatus:'2', use: true  },
                // { name: '月明细报表', url: '/tjbb_ymxbb', superStatus:'2', use: true  },
                // { name: '月统计报表', url: '/tjbb_ytjbb', superStatus:'2', use: true  },

              ]
            },
            {
              name: '异常管理',
              icon: 'exception',
              key: 'ycgl',
              superStatus:'2',
              use: true ,
              vals: [
                { name: '补签单', url: '/ycgl_bqd', superStatus:'2', use: true  },
                // { name: '请假单', url: '/ycgl_qjd', superStatus:'2', use: true  }

              ]
            },

          ],

          system: [
            {
              name: '权限管理',
              key: 'system',
              icon: 'cluster',
              superStatus:'2',
              use: true,
              vals: [
                { name: '用户', url: '/system_yh', superStatus:'2', use: true  },

              ]
            }
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
          superStatus: user.superStatus, // 是否超级用户
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
      let { popup } = this.state
      return (
        <div className="top-head-navigation-bar">
          <div className="head-navigation-bar">
            <Link to="/index" >
              <img title="主页" src={logo} className="top-box-logo" alt="logo" />
            </Link>
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
                {
                  this.state.superStatus==='1'?  <Menu.Item style={this.props.match.url === "/system" ? { backgroundColor: '#693be6' } : {}} title="系统" key="system">
                  <Link to="/system">
                    系统管理
                    {
                      this.props.match.url === "/system" ? <i className="choice"></i> : ""
                    }
                  </Link>
                </Menu.Item>:''
                }
              
              </Menu>


            </div>
            <div className="top-r-box-showcompany">
              <span title={this.state.UserName} className="top-user">用户：{this.state.UserName}</span>
              <div title="用户" className="top-icon">
                <a onClick={() => {
                  this.setState({
                    popup: {
                      ...this.state.popup,
                      personal: {
                        title: '个人信息',
                        switch: true
                      }
                    }
                  });
                }}>
                  <Icon type="user" />
                </a>
              </div>
              <div title="关于" className="top-icon">
                <a onClick={() => {
                  this.setState({
                    popup: {
                      ...this.state.popup,
                      about: {
                        title: '关于',
                        switch: true
                      }
                    }
                  });
                }}>
                  <Icon type="exclamation-circle" />
                </a>
              </div>
              <div title="帮助" className="top-icon">
                <Icon type="question-circle" />
              </div>
              <div title="注销" className="top-icon">
                <a onClick={() => {

                  this.setState({isCancellation:true})
                 
                }}>
                  <Icon type="poweroff" />
                </a>

              </div>

            </div>

          </div>
          <MyappedComponent {...this.props} {...this.state} />
          {
            popup.about.switch ? <About onNewlyPopup={
              (about) => {
                this.setState({
                  popup: {
                    ...this.state.popup,
                    about: about
                  }
                });
              }
            } /> : popup.personal.switch ? <Personal onNewlyPopup={
              (personal) => {
                this.setState({
                  popup: {
                    ...this.state.popup,
                    personal: personal
                  }
                });
              }
            } />
                : this.state.isCancellation ?
                  <ElasticFrame
                    style={{ width: 280, height: 150 }}
                    title={"提示"}
                    close={() => {
                      this.setState({isCancellation:false})
                    }}
                    titleText={''}
                    ok={() => {
                      // this.setState({isCancellation:false})
                      Util._httpGet("/project_war_exploded/user/logout.do", {
                      }).then((params) => {
                        //删除用户信息
                        cookie.remove('user');
                        this.props.history.push('/login');
                        // message.success(params.data.message)
                      }).catch((error) => {
    
                      })
                    }}
                    renderDom={(props) => {
                      return (
                        <div className="">
                          你确定注销用户吗？
                            </div>
                      )
                    }}
                  /> : ''
          }

        </div>

      );
    }
  }

}



export default HeadNavigationBar;
