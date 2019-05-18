

import React, { Component } from 'react';
import { Layout, Menu, Breadcrumb, Icon, Input } from 'antd';
import { NavLink } from 'react-router-dom'
import './index.css';
import cookie from '../../uilt/cookie';
// import RouterMap from '../catalogs/router'
const { Header, Content, Footer, Sider } = Layout;
const SubMenu = Menu.SubMenu;

function BordersMenu(MyappedComponent, page) {
  return class BordersMenu extends Component {

    constructor(props) {
      super(props);
      this.state = {
        collapsed: false,
        current: '/rygl_ry',
        Url: '',
        JumpUrl: '',
        JumpName: '',
        JumpTitle: '',
        conditionQueryList: []
      };

    }

    componentDidMount() {

      let JumpName = { name: '', key: '' };
      // this.catalogMapKey(this.props.catalog.att, this.props.location.pathname, JumpName);
      let pathname = '';
      //获取用户信息
      let obj = JSON.parse(cookie.getCookie('user'));

      if (obj && obj.user) {
        let user = obj.user;
        this.setState({
          superStatus: user.superStatus // 是否超级用户
        });
        let key = this.props.location.pathname.split('/')[1]

        //获取菜单中第一个页面（权限页面）
        for (let i = 0; i <= this.props.catalog[key].length; i++) {
          if (user.superStatus === '1') {
            for (let j = 0; j <= this.props.catalog[key][i].vals.length; j++) {
              pathname = this.props.catalog[key][i].vals[j].url
              break;
            }
          } else if (this.props.catalog[key][i].superStatus === user.superStatus) {
            for (let j = 0; j <= this.props.catalog[key][i].vals.length; j++) {
              if (this.props.catalog[key][i].vals[j].superStatus === user.superStatus) {
                pathname = this.props.catalog[key][i].vals[j].url;
                break;
              }
            }
          }
          if (pathname !== '') break;
        }
      }


      this.setState({
        //默认选中的菜单
        current: pathname !== '' ? pathname :
          this.props.location.pathname === "/pers" ? "/rygl_ry" :
            this.props.location.pathname === "/att" ? "/kqsb_sb" :
              this.props.location.pathname === "/system" ? "/system_yh" :
                this.props.location.pathname,
        JumpUrl: this.props.location.pathname,
        JumpName: JumpName.name,
        JumpTitle: JumpName.key
      });
    }
    componentDidUpdate() {


    }

    catalogMapKey(_data, url, JumpName) {
      for (let key in _data) {
        if (_data[key].url === url) {
          JumpName.name = _data[key].name;
        }
        if (_data[key].vals && _data[key].vals.length > 0) {
          this.catalogMapKey(_data[key].vals, url, JumpName);
          if (JumpName.name !== "" && JumpName.key === "") {
            JumpName.key = _data[key].name;
          }
        }
      }
    }

    onCollapse = (collapsed) => {
      this.setState({ collapsed });
    }

    handleClick = (e) => {
      // console.log(e);

      this.setState({
        current: e.key,
        JumpUrl: e.item.props.url,
        JumpName: e.item.props.children,
        JumpTitle: e.keyPath[1]
      });
    }

    conditionQuery = (conditionQueryList) => {

      this.setState({ conditionQueryList: conditionQueryList })

    }


    render() {
      let Jurisdiction = false;
      let JumpTitle, str = "";
      if (this.props.url !== "") {
        str = this.props.url.substr(1)
        JumpTitle = this.state.JumpTitle === '' ? this.props.catalog[str][0].name : this.state.JumpTitle;
      }

      return (
        <div className="borders_menu" >
          <div className="dhx_cell_cont_no_borders">
            {
              str !== "" ?

                <Layout style={{ minHeight: '100%' }}>
                  <Sider
                    collapsible
                    collapsed={this.state.collapsed}
                    onCollapse={this.onCollapse}
                  >
                    <div className="logo" />

                    <Menu theme="dark"
                      onClick={this.handleClick.bind(this)}
                      selectedKeys={[this.state.current]}
                      defaultOpenKeys={[JumpTitle]}
                      mode="inline">
                      {
                        this.props.catalog[str].map((val, key) => {

                          Jurisdiction = false;
                          if (this.state.superStatus === '1') {
                            Jurisdiction = true;
                          } else {
                            if (this.state.superStatus === val.superStatus) {
                              Jurisdiction = true;
                            }
                          }
                          if (Jurisdiction)
                            return val.url ? <Menu.Item title={val.name} url={val.url} key={val.url}>{val.name}</Menu.Item> : <SubMenu
                              key={val.name}
                              title={<span><Icon type={val.icon} /><span>{val.name}</span></span>}
                            >
                              {
                                val.vals ? val.vals.map((val1, key1) => {

                                  if (this.state.superStatus === '1') {
                                    return <Menu.Item title={val1.name} url={val1.url} key={val1.url}>
                                      {val1.name}
                                    </Menu.Item>
                                  } else {
                                    if (this.state.superStatus === val1.superStatus) {
                                      return <Menu.Item title={val1.name} url={val1.url} key={val1.url}>
                                        {val1.name}
                                      </Menu.Item>
                                    }
                                  }
                                })
                                  :
                                  ''
                              }

                            </SubMenu>

                        })
                      }


                    </Menu>



                  </Sider>
                  <Layout>

                    <Content style={{ margin: '0 16px' }}>
                      <Breadcrumb style={{ marginTop: 10, height: 30 }}>
                        <Breadcrumb.Item><MyappedComponent /></Breadcrumb.Item>
                        <Breadcrumb.Item>{this.state.JumpTitle === '' ? this.props.catalog[str][0].name : this.state.JumpTitle}</Breadcrumb.Item>
                        <Breadcrumb.Item>{this.state.JumpName === '' ? this.props.catalog[str][0].vals[0].name : this.state.JumpName}</Breadcrumb.Item>
                      </Breadcrumb>
                      <div style={{ background: '#fff', minHeight: 790, paddingLeft: 10, paddingTop: 10 }}>
                        {/* {
                          RouterPageMap?<RouterPageMap {...this}/>:''
                        } */}
                        {/* <MyappedComponent {...this}/> */}
                        {
                          page(this.state.current)
                        }
                      </div>
                    </Content>
                    <Footer style={{ textAlign: 'center', padding: '8px 50px' }}>
                      ©2019 浙江控控科技股份有限公司
                </Footer>
                  </Layout>
                </Layout>
                :
                ''
            }
          </div>
        </div>
      );
    }
  }
}




export default BordersMenu;
