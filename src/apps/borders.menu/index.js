

import React, { Component } from 'react';
import { Layout, Menu, Breadcrumb, Icon } from 'antd';
import './index.css';

const { Header, Content, Footer, Sider } = Layout;
const SubMenu = Menu.SubMenu;

function BordersMenu(MyappedComponent) {
  return class BordersMenu extends MyappedComponent{

    constructor(props) {
      super(props);
      this.state = {
        collapsed: false,
        current:'0',
        catalog:[{
              name:'人员管理',
              key:'user',
              vals:[
                {name:'人员',url:'administration_user_ry'},
                {name:'部门',url:'administration_user_bm'},
                {name:'职位',url:'administration_user_zw'},
                {name:'离职人员',url:'administration_user_lzry'}
              ]
            }],
        Url:""
      };

    }

    componentDidMount() {
     
    }
    onCollapse = (collapsed) => {
      this.setState({ collapsed });
    }

    handleClick = (e) => {
      this.setState({
        current: e.key,
      });
    }

   


    render() {

      let str = "";
      if(this.props.url !== ""){
        str = this.props.url.substr(1);
      }

      return (
        <div className="borders_menu" >
          <div className="dhx_cell_cont_no_borders">

            <Layout style={{ minHeight: '100%' }}>
              <Sider
                collapsible
                collapsed={this.state.collapsed}
                onCollapse={this.onCollapse}
              >
                <div className="logo" />
                <Menu theme="dark"
                onClick={this.handleClick}
                selectedKeys={[this.state.current]} 
                defaultOpenKeys={['user']} 
                mode="inline">
                  {
                    str !== ""?this.props.catalog[str].map((val,key)=>{
                      
                      return <SubMenu
                              key={val.key}
                              title={<span><Icon type={val.key} /><span>{val.name}</span></span>}
                            >
                              {
                                   val.vals ? val.vals.map((val,key)=>{
                                        return <Menu.Item key={key}>{val.name}</Menu.Item>
                                    })
                                    :
                                    ''
                              }
 
                            </SubMenu>

                    }):''
                  }
                  
                 
                </Menu>
              </Sider>
              <Layout>
                <Header style={{ background: '#fff', padding: 0 }} />
                <Content style={{ margin: '0 16px' }}>
                  <Breadcrumb style={{ margin: '16px 0' }}>
                    <Breadcrumb.Item><MyappedComponent /></Breadcrumb.Item>
                    <Breadcrumb.Item>人员管理</Breadcrumb.Item>
                    <Breadcrumb.Item>人员</Breadcrumb.Item>
                  </Breadcrumb>
                    <div style={{ background: '#fff', minHeight: 730 }}>

                    </div>
                </Content>
                <Footer style={{ textAlign: 'center' }}>
                  ©2019 浙江控控科技股份有限公司
                </Footer>
              </Layout>
            </Layout>

          </div>
        </div>
      );
    }
  }
}




export default BordersMenu;
