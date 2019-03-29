
import React, { Component } from 'react';
import { Input, TreeSelect } from 'antd';
import Information from '../../controls/information';
import DataTable from '../../controls/data.table';

import ElasticFrame from '../../controls/elastic.frame';
import './index.css';

const TreeNode = TreeSelect.TreeNode;

class KqsbQy extends Component {
  constructor(props) {
    super(props);
    this.state = {
      localValue: '',
      newlyPopup: {
        title: "",
        switch: true,
      },
      pagination:{
        total:0,  //数据总数量
        pageSize:50, //显示几条一页
      },
      titlelist: [
        { name: '刷新', icon: 'redo' },
        { name: '新增', icon: 'file-add' },
        { name: '删除', icon: 'close' }
      ],
      datalist: [],
      dataColumns: [
        {
          title: '区域编号',
          dataIndex: 'perId',
          width: 100,
        }, {
          title: '区域姓名',
          dataIndex: 'perName',
          width: 100,
        }, {
          title: '上级区域编号',
          dataIndex: 'departmentName',
          width: 100,
        }, {
          title: '上级区域名称',
          dataIndex: 'entryDate',
          width: 160,
        }, {
          title: '备注',
          dataIndex: 'entryDate1',
          width: 160,
        }, {
          title: '操作',
          dataIndex: 'operation',
          key: 'operation',
          width: 100,
          render: () => {
            return (
              <div className="kqsb-qy-operation">
                <a onClick={(e) => this.newlyPopup(e, '编辑')}>编辑</a>
                <a onClick={()=>{}}>删除</a>
              </div>

            )

          },
        }
      ],
      departmentDatalist:[
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



    const datalist = [
      {
        key: 1,
        perId: `1`,
        perName: `小李`,
        departmentName: '董事部',

        entryDate: `2019-3-13 13:54:14`,
        entryDate1: '2019-3-13 13:54:14'
      },
      {
        key: 2,
        perId: `2`,
        perName: `李明`,
        departmentName: '董事部',

        entryDate: `2019-3-13 13:54:14`,
        entryDate1: '2019-3-13 13:54:14'
      },
      {
        key: 3,
        perId: `3`,
        perName: `周庄`,
        departmentName: '董事部',

        entryDate: `2019-3-13 13:54:14`,
        entryDate1: '2019-3-13 13:54:14'
      },
      {
        key: 4,
        perId: `4`,
        perName: `张飞`,
        departmentName: '董事部',

        entryDate: `2019-3-13 13:54:14`,
        entryDate1: '2019-3-13 13:54:14'

      }

    ];
    this.setState({ datalist });
  }
  newlyPopup = (e, title) => {

    this.setState({
      newlyPopup: {
        title: title,
        switch: true,
      }
    })
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
  render() {

    return (
      <div className="kqsb-qy">
        <div className="kqsb-qy-data">

          <div className="kqsb-qy-data-datatable">
            <DataTable onNewlyPopup={this.newlyPopup} {...this.state} />
          </div>
          {
            //弹出框
            this.state.newlyPopup.switch ?
            this.state.newlyPopup.title === "新增" || this.state.newlyPopup.title === "编辑" ?
                <ElasticFrame
                  style={{ width: 500, height: 270 }}
                  title={this.state.newlyPopup.title}
                  close={() => {
                    this.setState({
                      newlyPopup: { switch: false }
                    })
                  }}
                  renderDom={(props) => {
                    return (
                      <div className="kqsb-qy_newly_added">

                        <div className="kqsb-qy_tableStyle">

                          <div className="kqsb-qy_tableStyle_div"><label>区域编号 <span className="required">*</span></label><Input type="text" className="valid" /></div>
                          <div className="kqsb-qy_tableStyle_div"><label>区域名称 <span className="required">*</span></label><Input type="text" className="valid" /></div>

                          <div className="kqsb-qy_tableStyle_div">
                            <label>上级区域 <span className="required">*</span></label>
                            <TreeSelect
                              showSearch
                              style={{ width: 300 }}
                              value={this.state.localValue}
                              dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
                              placeholder="上级区域"
                              allowClear
                              treeDefaultExpandAll
                              onChange={this.onTreeNodeChange}
                            >
                              {
                                this.TreeNode(this.state.departmentDatalist)
                              }
                            </TreeSelect>

                          </div>

                          <div className="kqsb-qy_tableStyle_div"><label>备注</label><Input type="text" className="valid" /></div>


                        </div>
                      </div>
                    )
                  }}
                /> : this.state.newlyPopup.title === "复职" ?
                  <ElasticFrame
                    style={{ width: 900, height: 650 }}
                    title={this.state.newlyPopup.title}
                    close={() => {
                      this.setState({
                        newlyPopup: { switch: false }
                      })
                    }}
                    renderDom={(props) => {
                      return <Information toUserID={false}  {...props} {...this.props} />
                    }}
                  /> :this.state.newlyPopup.title === "删除"?
                  <ElasticFrame
                    style={{ width: 280,height: 150}}
                    title={"提示"}
                    close={() => {
                      this.setState({
                        newlyPopup: { switch: false }
                      })
                    }}
                    renderDom={(props) => {
                      return (
                        <div className="">
                           你确定要执行删除操作吗？ 
                        </div>
                        )
                    }}
                  />:""
              :
              ""
          }
        </div>


      </div>
    );
  }
}

export default KqsbQy;
