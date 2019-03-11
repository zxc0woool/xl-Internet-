

import React, { Component } from 'react';
import { Icon, Table } from 'antd';
import ElasticFrame from '../elastic.frame';
import './index.css';


class DataTree extends Component {

 
  constructor(props) {
    super(props);
    this.state = {
      newlyPopup:{
        title:'',
        switch:false,
        data:{}
      },
      defaultExpandAll:true,
      toDefaultExpandAll:false,
      checkedKeys:[],
      datalist:[
       
      ]
    }

  }

  componentDidMount() {
    
  
  }

  componentDidUpdate(){
 
  }

  newlyPopup = (e,title) => {

    this.setState({
      newlyPopup:{
        title:title,
        switch:true,
      }
    })
  }

  render() {

    const columns = [
    {
      title: '人员编号',
      dataIndex: 'perId',
      width: 150,
    }, {
      title: '姓名',
      dataIndex: 'perName',
      width: 150,
    }, {
      title: '部门名称',
      dataIndex: 'departmentName',
      width: 150,
    },{
      title: '入职时间',
      dataIndex: 'entryDate',
      width: 160,
    }, {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      render: () => {
        return <a href="javascript:;">编辑</a>
      },
    }];
    
    const data = [];
    for (let i = 0; i < 1000; i++) {
      data.push({
        key: i + 1,
        perId: `编号 ${i + 1}`,
        perName: '姓名' + `小${i + 1}`,
        departmentName:'A'+i + 1+'部门',
        entryDate:'2019-3-11 13:20:12'
       
      });
    }
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      }
    };

    return (
      <div className="data-table">
        <div className="first-child">
          <div className="dhx_toolbar_btn" title="刷新">
            <Icon type="redo"/>
            <div className="dhxtoolbar_text">刷新</div>
          </div>
          <div className="dhx_toolbar_btn" onClick={(e)=>this.newlyPopup(e,'新增')} title="新增">
            <Icon type="file-add" />
            <div className="dhxtoolbar_text">新增</div>
          </div>
          <div className="dhx_toolbar_btn" title="离职">
            <Icon type="user-delete" />
            <div className="dhxtoolbar_text">离职</div>
          </div>
          <div className="dhx_toolbar_btn" title="部门调整">
            <Icon type="contacts"/>
            <div className="dhxtoolbar_text">部门调整</div>
          </div>
          <div className="dhx_toolbar_btn" title="职位调整">
            <Icon type="audit"/>
            <div className="dhxtoolbar_text">职位调整</div>
          </div>
          <div className="dhx_toolbar_btn" title="删除">
            <Icon type="close"/>
            <div className="dhxtoolbar_text">删除</div>
          </div>

        </div>
        <div className="dhx_cell_layout">
          <Table loading={false} rowSelection={rowSelection} columns={columns} dataSource={data} pagination={{ pageSize: 50 }} scroll={{ y: 590 }} />

        </div>
        {
      
          this.state.newlyPopup.switch?<ElasticFrame 
          title={this.state.newlyPopup.title}
          close={()=>{
            this.setState({
              newlyPopup:{switch:false}
            })
          }}
          renderDom={()=>{
            return <div>
                内容
              </div>
            }}
          />
          :
          ""
        }
        
      </div>
    );
  }
}

export default DataTree;
