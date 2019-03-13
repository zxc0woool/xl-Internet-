

import React, { Component } from 'react';
import { Layout, Menu, Breadcrumb, Icon } from 'antd';
import { NavLink } from 'react-router-dom'
import './index.css';
import RouterMap from '../catalogs/router'
const { Header, Content, Footer, Sider } = Layout;
const SubMenu = Menu.SubMenu;


function BordersMenu(MyappedComponent) {
  return class BordersMenu extends Component {

    constructor(props) {
      super(props);
      this.state = {
        collapsed: false,
        current: '/pers/rygl_ry',
        Url: '',
        JumpUrl: '',
        JumpName: '',
        JumpTitle: ''
      };

    }

    componentDidMount() {

      this.setState({ current: this.props.location.pathname});
    }
   
 
    onCollapse = (collapsed) => {
      this.setState({ collapsed });
    }

    handleClick = (e) => {
      console.log(e);
     
      this.setState({
        current: e.key,
        JumpUrl: e.item.props.url,
        JumpName: e.item.props.children,
        JumpTitle: e.keyPath[1]
      });
    }




    render() {

      let str = "";
      if (this.props.url !== "") {
        str = this.props.url.substr(1);
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
                      defaultOpenKeys={[this.props.catalog[str][0].name,this.props.catalog[str][0].key]}
                      mode="inline">
                      {
                        this.props.catalog[str].map((val, key) => {

                          return <SubMenu
                            key={val.name}
                            title={<span><Icon type={val.icon} /><span>{val.name}</span></span>}
                          >
                            {
                              val.vals ? val.vals.map((val1, key1) => {
                                return <Menu.Item title={val1.name} url={val1.url} key={val1.url}>
                                        <NavLink to={val1.url}>
                                          {val1.name}
                                        </NavLink>
                                
                                       </Menu.Item>
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
                    <Header style={{ background: '#fff', padding: 0 }} />
                    <Content style={{ margin: '0 16px' }}>
                      <Breadcrumb style={{height: 30, borderBottom: '1px solid #e8e8e8' }}>
                        <Breadcrumb.Item><MyappedComponent /></Breadcrumb.Item>
                        <Breadcrumb.Item>{this.state.JumpTitle === ''?this.props.catalog[str][0].name:this.state.JumpTitle}</Breadcrumb.Item>
                        <Breadcrumb.Item>{this.state.JumpName === ''?this.props.catalog[str][0].vals[0].name:this.state.JumpName}</Breadcrumb.Item>
                      </Breadcrumb>
                      <div style={{ background: '#fff', minHeight: 730 }}>
                          <RouterMap />
                     
                      </div>
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>
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
