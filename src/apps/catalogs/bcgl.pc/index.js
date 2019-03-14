


import React, { Component } from 'react';
// import { Input, TreeSelect } from 'antd';
// import Information from '../../controls/information';
import DataTable from '../../controls/data.table';

import ElasticFrame from '../../controls/elastic.frame';
import './index.css';


class BcglPc extends Component {
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
          title: '名称',
          dataIndex: 'perId',
          width: 100,
        }, {
          title: '编号',
          dataIndex: 'perName',
          width: 100,
        }, {
          title: '班次类型',
          dataIndex: 'departmentName',
          width: 100,
        }, {
          title: '单位',
          dataIndex: 'entryDate',
          width: 160,
        }, {
          title: '周期',
          dataIndex: 'entryDate1',
          width: 160,
        }, {
          title: '起始日期',
          dataIndex: 'entryDate2',
          width: 160,
        }, {
          title: '是否月内轮班',
          dataIndex: 'entryDate3',
          width: 160,
        }, {
          title: '操作',
          dataIndex: 'operation',
          key: 'operation',
          render: () => {
            return (
              <div className="kqsb-qy-operation">
                <a onClick={(e) => this.newlyPopup(e, '编辑')}>编辑</a>
                <a onClick={() => { }}>删除</a>
              </div>

            )

          },
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



    const datalist = [
      {
        key: 1,
        perId: `赛飞`,
        perName: `S01`,
        departmentName: '规律班次',
        entryDate: `周`,
        entryDate1: '1',
        entryDate2: '2019-02-28',
        entryDate3: '是'
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
  // TreeNode = (datalist) => {
  //   return datalist.map((_d) => {
  //     return (
  //       <TreeNode value={_d.name} title={_d.name} key={_d.value}>
  //         {

  //           _d.children ? this.TreeNode(_d.children) : ''

  //         }
  //       </TreeNode>
  //     )
  //   })

  // }
  onTreeNodeChange = (localValue) => {
    console.log(localValue);
    this.setState({ localValue });
  }
  render() {

    return (
      <div className="bcgl-pc">
        <div className="bcgl-pc-data">

          <div className="bcgl-pc-data-datatable">
            <DataTable onNewlyPopup={this.newlyPopup} {...this.state} />
          </div>
          <div className="bcgl-pc-right-data-datatable">
            <div className="bcgl-pc-first-child">
              时间段明细
            </div>
            <div className="bcgl-pc-date-data-datatable">
              <span>
                <div>星期一</div>
                <div>09:00-18:00</div>
              </span>
              <span>
                <div>星期二</div>
                <div>09:00-18:00</div>
              </span>
              <span>
                <div>星期三</div>
                <div>09:00-18:00</div>
              </span>
            </div>
          </div>
          
          {
            //弹出框
            this.state.newlyPopup.switch ?
              this.state.newlyPopup.title === "新增" || this.state.newlyPopup.title === "编辑" ?
                <ElasticFrame
                  style={{ width: 800, height: 600 }}
                  title={this.state.newlyPopup.title}
                  close={() => {
                    this.setState({
                      newlyPopup: { switch: false }
                    })
                  }}
                  renderDom={(props) => {
                    return (
                      <div className="bcgl-pc_newly_added">
                        <div className="bcgl-pc_tableStyle">



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

export default BcglPc;
