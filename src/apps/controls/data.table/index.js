

import React, { Component } from 'react';
import { Icon, Table, Select, Input, TreeSelect } from 'antd';

import './index.css';
const TreeNode = TreeSelect.TreeNode;

class DataTree extends Component {


  constructor(props) {
    super(props);
    this.state = {
      count: '100'

    }

  }

  componentDidMount() {


  }

  componentDidUpdate() {

  }


  render() {

    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        this.props.setSelectedRows(selectedRows);
        // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      }
    };

    let _this = this;


    return (
      <div className="data-table">
        <div className="first-child" style={this.props.closeTitle?{display:'none'}:{}}>
          {
            this.props.titlelist?
            //操作按钮
            this.props.titlelist.map((_d, key) => {
              return (
                <div key={key} className="dhx_toolbar_btn" onClick={(e) => this.props.onNewlyPopup(_d, _d.name)} title={_d.name}>
                  <Icon type={_d.icon} />
                  <div className="dhxtoolbar_text">{_d.name}</div>
                </div>
              )
            })
            :
            ''
          }

        </div>
        <div className="dhx_cell_layout" style={this.props.style}>
          {
            this.props.container ? this.props.container(this.props) :
              <Table
                bordered
               
                loading={false}
                rowSelection={rowSelection}
                columns={this.props.dataColumns}
                dataSource={this.props.datalist}
                scroll={{ y: 590, ...this.props.scroll }}
                pagination={!this.props.closePagination?{  //分页
                  total: _this.props.pagination.total, //数据总数量
                  pageSize: _this.props.pagination.pageSize,  //显示几条一页
                  // defaultPageSize: this.state.queryInfo.pageSize, //默认显示几条一页
                  showSizeChanger: true,  //是否显示可以设置几条一页的选项
                  onShowSizeChange(current, pageSize) {  //当几条一页的值改变后调用函数，current：改变显示条数时当前数据所在页；pageSize:改变后的一页显示条数
                    _this.props.onGetData(current, pageSize); //这边已经设置了self = this
                  },
                  onChange(current) {  //点击改变页数的选项时调用函数，current:将要跳转的页数
                    _this.props.onGetData(current, _this.props.pagination.pageSize);
                  },
                  showTotal: function () {  //设置显示一共几条数据
                    return '共 ' + _this.props.pagination.total + ' 条数据';
                  }
                }:false}
              />
          }

        </div>

      </div>
    );
  }
}

export default DataTree;
