

import React, { Component } from 'react';
import { Input, TreeSelect } from 'antd';
import DataTree from '../../controls/data.tree';
import DataTable from '../../controls/data.table';
import ElasticFrame from '../../controls/elastic.frame';
import './index.css';

const TreeNode = TreeSelect.TreeNode;

class RyglBm extends Component {
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
          title: '部门编号',
          dataIndex: 'perId',
          width: 150,
        }, {
          title: '部门名称',
          dataIndex: 'perName',
          width: 150,
        }, {
          title: '上级部门编号',
          dataIndex: 'departmentName',
          width: 150,
        }, {
          title: '上级部门',
          dataIndex: 'entryDate',
          width: 160,
        }, {
          title: '操作',
          dataIndex: 'operation',
          key: 'operation',
          render: () => {
            return (
              <div className="rygl-bm-operation">
                <a onClick={(e) => this.newlyPopup(e, '编辑')}>编辑</a>
                <a onClick={() => { }}>删除</a>
              </div>

            )

          },
        }
      ],
      leftDatalist:[
        {
          name: '部门名称',
          value: '部门名称',
          children: [
            {
              name: '市场部',
              value: '市场部',
              children: [
                { name: '采购部', value: '部门名称>市场部>采购部' }
              ]
            },
            { name: '研发部', value: '部门名称>研发部' },
            { name: '财务部', value: '部门名称>财务部' },
            { name: '维修部', value: '部门名称>维修部' },
            { name: '证卡部', value: '部门名称>证卡部' }
          ]
        },
        {
          name: '技术',
          value: '技术',
          children: [
            { name: '研发部', value: '技术>研发部' },
            { name: '维修部', value: '技术>维修部' }
          ]
        }
      ],
      departmentDatalist: [
        {
          name: '部门名称',
          value: '部门名称',
          children: [
            {
              name: '市场部',
              value: '市场部',
              children: [
                { name: '采购部', value: '部门名称>市场部>采购部' }
              ]
            },
            { name: '研发部', value: '部门名称>研发部' },
            { name: '财务部', value: '部门名称>财务部' },
            { name: '维修部', value: '部门名称>维修部' },
            { name: '证卡部', value: '部门名称>证卡部' }
          ]
        },
        {
          name: '技术',
          value: '技术',
          children: [
            { name: '研发部1', value: '技术>研发部1' },
            { name: '维修部1', value: '技术>维修部1' }
          ]
        }
      ]
    }

  }


  componentDidMount() {

    const datalist = [];
    for (let i = 0; i < 100; i++) {
      datalist.push({
        key: i + 1,
        perId: `编号 ${i + 1}`,
        perName: `AS${i + 1}部`,
        departmentName: '45' + i + 1 + '3',

        entryDate: `AW${i + 1 + i}部`

      });
    }
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
      <div className="rygl-bm">
        <div className="rygl-bm-data">
          <div className="rygl-bm-data-datatree">
            <DataTree {...this.state} />
          </div>

          <div className="rygl-bm-data-datatable">
            <DataTable onNewlyPopup={this.newlyPopup} {...this.state} />
          </div>
          {
            //弹出框
            this.state.newlyPopup.switch ?
              this.state.newlyPopup.title === "新增" || this.state.newlyPopup.title === "编辑"?
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
                      <div className="rygl_bm_newly_added">

                        <div className="rygl_bm_tableStyle">

                          <div className="rygl_bm_tableStyle_div"><label>部门编号 <span className="required">*</span></label><Input type="text" className="valid" /></div>
                 
                          <div className="rygl_bm_tableStyle_div"><label>部门名称 <span className="required">*</span></label><Input type="text" className="valid" /></div>
                         

                          <div className="rygl_bm_tableStyle_div"><label>排序</label> <Input type="text" className="valid" /></div>


                          <div className="rygl_bm_tableStyle_div">
                            <label>上级部门</label>
                            <TreeSelect
                              showSearch
                              style={{ width: 300 }}
                              value={this.state.localValue}
                              dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
                              placeholder="调动到的部门"
                              allowClear
                              treeDefaultExpandAll
                              onChange={this.onTreeNodeChange}
                            >
                              {
                                this.TreeNode(this.state.departmentDatalist)
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

export default RyglBm;
