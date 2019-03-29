

import React, { Component } from 'react';
import { Icon, Input, Select, Checkbox, TreeSelect, TimePicker } from 'antd';
import Information from '../../controls/information';
import DataTable from '../../controls/data.table';
import ElasticFrame from '../../controls/elastic.frame';
import moment from 'moment';
import './index.css';

const Option = Select.Option;
class BcglSjd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      localValue: '',
      data: {},
      newlyPopup: {
        title: "",
        switch: true,
      },
      pagination: {
        total: 0,  //数据总数量
        pageSize: 50, //显示几条一页
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
          width: 100,
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
                  style={{ width: 600, height: 340 }}
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
                          <table className="tableStyle">
                            <tbody>
                              <tr>
                                <th>
                                  <label>编号</label><span className="required">*</span>
                                </th>
                                <td>
                                  <Input placeholder={'建议以 T 开头，如 T01'} title={'建议以 T 开头，如 T01'} type="text" defaultValue={''} className="valid" />
                                </td>
                                <th><label>名称</label><span className="required">*</span>
                                </th>
                                <td>
                                  <div>
                                    {/* <Checkbox /> */}
                                    <Input placeholder={'建议以 T 开头或 时间段 结尾'} title={'建议以 T 开头或 时间段 结尾'} type="text" defaultValue={''} className="valid" />
                                  </div>
                                </td>
                              </tr>
                              <tr>
                                <th>
                                  <label>开始签到时间</label><span className="required">*</span>
                                </th>
                                <td>
                                  <TimePicker format={'HH:mm'} value={this.state.data.birthDate ? moment(this.state.data.birthDate, 'HH:mm') : this.state.data.birthDate} onChange={(value) => this.setState({
                                    data: { ...this.state.data, birthDate: value }
                                  })} placeholder="开始签到时间" />
                                </td>
                                <th>
                                  <label>开始签退时间</label><span className="required">*</span>
                                </th>
                                <td>
                                  <TimePicker format={'HH:mm'} value={this.state.data.birthDate ? moment(this.state.data.birthDate, 'HH:mm') : this.state.data.birthDate} onChange={(value) => this.setState({
                                    data: { ...this.state.data, birthDate: value }
                                  })} placeholder="开始签退时间" />
                                </td>
                              </tr>
                              <tr>
                                <th >
                                  <label>上班时间</label><span className="required">*</span>
                                </th>
                                <td >
                                  <TimePicker format={'HH:mm'} value={this.state.data.birthDate ? moment(this.state.data.birthDate, 'HH:mm') : this.state.data.birthDate} onChange={(value) => this.setState({
                                    data: { ...this.state.data, birthDate: value }
                                  })} placeholder="上班时间" />
                                </td>
                                <th>
                                  <label>下班时间</label><span className="required">*</span>
                                </th>
                                <td>
                                  <TimePicker format={'HH:mm'} value={this.state.data.birthDate ? moment(this.state.data.birthDate, 'HH:mm') : this.state.data.birthDate} onChange={(value) => this.setState({
                                    data: { ...this.state.data, birthDate: value }
                                  })} placeholder="下班时间" />
                                </td>
                              </tr>
                              <tr>
                                <th >
                                  <label>结束签到时间</label><span className="required">*</span>
                                </th>
                                <td>
                                  <TimePicker format={'HH:mm'} value={this.state.data.birthDate ? moment(this.state.data.birthDate, 'HH:mm') : this.state.data.birthDate} onChange={(value) => this.setState({
                                    data: { ...this.state.data, birthDate: value }
                                  })} placeholder="结束签到时间" />
                                </td>
                                <th >
                                  <label>结束签退时间</label><span className="required">*</span>
                                </th>
                                <td colSpan="2">
                                  <TimePicker format={'HH:mm'} value={this.state.data.birthDate ? moment(this.state.data.birthDate, 'HH:mm') : this.state.data.birthDate} onChange={(value) => this.setState({
                                    data: { ...this.state.data, birthDate: value }
                                  })} placeholder="结束签退时间" />
                                </td>
                              </tr>
                              <tr>
                                <th><label>允许迟到分钟数</label></th>
                                <td>
                                  <Input type="text" maxLength={30} />
                                </td>

                                <th>
                                  <label>允许早退分钟数</label>
                                </th>
                                <td colSpan="2">
                                  <Input type="text" maxLength={30} />
                                </td>
                              </tr>
                              <tr>
                                <th><label>提前是否计加班</label><span className="required">*</span></th>
                                <td>
                                  <Select value={this.state.data.idType}
                                    onChange={(val) => this.setState({
                                      data: { ...this.state.data, idType: val }
                                    })}>
                                    <Option value='1'>是</Option>
                                    <Option value='0'>否</Option>

                                  </Select>

                                </td>
                                <th><label>延后是否计加班</label><span className="required">*</span></th>
                                <td>
                                  <Select value={this.state.data.idType}
                                    onChange={(val) => this.setState({
                                      data: { ...this.state.data, idType: val }
                                    })}>
                                    <Option value='1'>是</Option>
                                    <Option value='0'>否</Option>

                                  </Select>
                                </td>

                              </tr>

                              <tr>
                                <th><label>签到早于时间</label><span className="required">*</span></th>
                                <td>
                                  <TimePicker format={'HH:mm'} value={this.state.data.birthDate ? moment(this.state.data.birthDate, 'HH:mm') : this.state.data.birthDate} onChange={(value) => this.setState({
                                    data: { ...this.state.data, birthDate: value }
                                  })} placeholder="签到早于时间" />

                                </td>
                                <th><label>签退晚于时间</label><span className="required">*</span></th>
                                <td>
                                  <TimePicker format={'HH:mm'} value={this.state.data.birthDate ? moment(this.state.data.birthDate, 'HH:mm') : this.state.data.birthDate} onChange={(value) => this.setState({
                                    data: { ...this.state.data, birthDate: value }
                                  })} placeholder="签退晚于时间" />

                                </td>

                              </tr>

                            </tbody>
                          </table>

                        </div>
                      </div>
                    )
                  }}
                /> : this.state.newlyPopup.title === "删除" ?
                  <ElasticFrame
                    style={{ width: 280, height: 150 }}
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
