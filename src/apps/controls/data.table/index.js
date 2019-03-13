

import React, { Component } from 'react';
import { Icon, Table, Select, Input, TreeSelect  } from 'antd';

import './index.css';
const TreeNode = TreeSelect.TreeNode;

class DataTree extends Component {


  constructor(props) {
    super(props);
    this.state = {
     
    }

  }

  componentDidMount() {


  }

  componentDidUpdate() {

  }

  
  render() {
   
   

    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      }
    };



    
    return (
      <div className="data-table">
        <div className="first-child">
          {
            //操作按钮
            this.props.titlelist.map((_d,key)=>{
              return (
                <div key={key} className="dhx_toolbar_btn" onClick={(e) => this.props.onNewlyPopup(e, _d.name)} title={_d.name}>
                  <Icon type={_d.icon} />
                  <div className="dhxtoolbar_text">{_d.name}</div>
                </div>
              )
            })
          }

        </div>
        <div className="dhx_cell_layout">
          <Table loading={false} rowSelection={rowSelection} columns={this.props.dataColumns} dataSource={this.props.datalist} pagination={{ pageSize: 50 }} scroll={{ y: 590 }} />
        </div>

      </div>
    );
  }
}

export default DataTree;
