

import React, { Component } from 'react';
import { Input, TreeSelect  } from 'antd';
import DataTree from '../../controls/data.tree';
import DataTable from '../../controls/data.table';

import ElasticFrame from '../../controls/elastic.frame';
import './index.css';

const TreeNode = TreeSelect.TreeNode;

class RyglZw extends Component {
  constructor(props) {
    super(props);
    this.state = {
      localValue: '',
      newlyPopup: {
        title: "",
        switch: true,
      },
      titlelist: [
        { name: '刷新', icon: 'redo' },
        { name: '新增', icon: 'file-add' },
        { name: '删除', icon: 'close' }
      ],
      datalist: [],
      dataColumns: [
        {
          title: '职位编号',
          dataIndex: 'perId',
          width: 150,
        }, {
          title: '职位名称',
          dataIndex: 'perName',
          width: 150,
        }, {
          title: '上级职位编号',
          dataIndex: 'departmentName',
          width: 150,
        }, {
          title: '上级职位',
          dataIndex: 'entryDate',
          width: 160,
        }, {
          title: '操作',
          dataIndex: 'operation',
          key: 'operation',
          render: () => {
            return (
              <div className="rygl-bm-operation">
                <a  onClick={(e)=>this.newlyPopup(e,'编辑')}>编辑</a>
                <a onClick={() => { }}>删除</a>
              </div>

            )

          },
        }
      ],
      leftDatalist:[
        {
          name: '人事部',
          value: '人事部',
          children: [
      
          ]
        },
        {
          name: '董事部',
          value: '董事部',
          children: [
            { name: '经理', value: '董事部>经理' },
            { name: '营销员', value: '董事部>营销员' }
          ]
        }
      ],
      positionDatalist:[
        {
          name: '人事部',
          value: '人事部',
          children: [
      
          ]
        },
        {
          name: '董事部',
          value: '董事部',
          children: [
            { name: '经理', value: '董事部>经理' },
            { name: '营销员', value: '董事部>营销员' }
          ]
        }
      ],
    }

  }

  componentDidMount() {

    const datalist = [
      {
        key:1,
        perId: `1`,
        perName: `人事部`,
        departmentName: '',
  
        entryDate: ``
      },
      {
        key:2,
        perId: `2`,
        perName: `董事部`,
        departmentName: '',
  
        entryDate: ``
      },
      {
        key:3,
        perId: `3`,
        perName: `经理`,
        departmentName: '2',
  
        entryDate: `董事部`
      },
      {
        key:4,
        perId: `4`,
        perName: `营销员`,
        departmentName: '2',
  
        entryDate: `董事部`
      }
    
    ];
  
    this.setState({ datalist });
  }

  TreeNode = (datalist) => {
    return datalist.map((_d) => {
      return (
        <TreeNode value={_d.name} title={_d.name} key={_d.value}>
          {
            _d.children ? this.TreeNode(_d.children) : ''

          }
        </TreeNode>
      )
    })

  }

  onTreeNodeChange = (localValue) => {
    console.log(localValue);
    this.setState({ localValue });
  }
  newlyPopup = (e, title) => {

    this.setState({
      newlyPopup: {
        title: title,
        switch: true,
      }
    })
  }
  render() {
 
    return (
      <div className="rygl-zw">
        <div className="rygl-zw-data">
          <div className="rygl-zw-data-datatree">
            <DataTree {...this.state} />
          </div>

          <div className="rygl-zw-data-datatable">
            <DataTable onNewlyPopup={this.newlyPopup} {...this.state} />
          </div>
          {
            //弹出框
            this.state.newlyPopup.switch ?
              this.state.newlyPopup.title === "新增" ||  this.state.newlyPopup.title === "编辑"?
                <ElasticFrame
                  style={{ width: 500, height: 270 }}
                  title={this.state.newlyPopup.title}
                  close={() => {
                    this.setState({
                      newlyPopup: { switch: false }
                    })
                  }}
                  renderDom={() => {
                    return (
                      <div className="rygl_zw_newly_added">

                        <div className="rygl_zw_tableStyle">

                          <div className="rygl_bm_tableStyle_div"><label>职位编号 <span className="required">*</span></label><Input type="text" defaultValue={'1'} className="valid" /></div>
                 
                          <div className="rygl_bm_tableStyle_div"><label>职位名称 <span className="required">*</span></label><Input type="text" className="valid" /></div>
                         
                          <div className="rygl_bm_tableStyle_div"><label>排序编号</label> <Input type="text" className="valid" /></div>

                          <div className="rygl_bm_tableStyle_div">
                            <label>上级职位</label>
                            <TreeSelect
                              showSearch
                              style={{ width: 300 }}
                              value={this.state.localValue}
                              dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
                              placeholder="上级职位"
                              allowClear
                              treeDefaultExpandAll
                              onChange={this.onTreeNodeChange}
                            >
                              {
                                this.TreeNode(this.state.positionDatalist)
                              }
                            </TreeSelect>
                          </div>

                        </div>
                      </div>
                    )
                  }}
                /> : ""
              :
              ""
          }
        </div>
      
      
      </div>
    );
  }
}

export default RyglZw;
