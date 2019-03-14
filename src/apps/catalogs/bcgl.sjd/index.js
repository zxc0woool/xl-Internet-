

import React, { Component } from 'react';
import { Input, TreeSelect } from 'antd';
import Information from '../../controls/information';
import DataTable from '../../controls/data.table';

import ElasticFrame from '../../controls/elastic.frame';
import './index.css';


class BcglSjd extends Component {
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
          title: '时段类型',
          dataIndex: 'departmentName',
          width: 100,
        }, {
          title: '开始签到时间',
          dataIndex: 'entryDate',
          width: 100,
        }, {
          title: '上班时间',
          dataIndex: 'entryDate1',
          width: 100,
        }, {
          title: '下班时间',
          dataIndex: 'entryDate2',
          width: 100,
        }, {
          title: '结束签退时间',
          dataIndex: 'entryDate3',
          width: 100,
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
        perId: `班`,
        perName: `班`,
        departmentName: '正常时间段',
        entryDate: `06:00`,
        entryDate1: '09:00',
        entryDate2: '18:00',
        entryDate3: '23:00'
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
      <div className="bcgl-sjd">
        <div className="bcgl-sjd-data">

          <div className="bcgl-sjd-data-datatable">
            <DataTable onNewlyPopup={this.newlyPopup} {...this.state} />
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
                      <div className="bcgl-sjd_newly_added">
                        <div className="bcgl-sjd_tableStyle">



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

export default BcglSjd;
