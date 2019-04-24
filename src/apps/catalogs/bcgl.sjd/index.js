

import React, { Component } from 'react';
import { Icon, Input, Select, Checkbox, message, TimePicker, Button, Layout } from 'antd';
import { NavLink,Link } from 'react-router-dom'
import Information from '../../controls/information';
import DataTable from '../../controls/data.table';
import ElasticFrame from '../../controls/elastic.frame';
import moment from 'moment';
import Util from '../../../uilt/http.utils';
import './index.css';

const Option = Select.Option;
const { Header } = Layout;
let titleTextUserId = "";
class BcglSjd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      localValue: '',
      number: "",
      testName: "",
      titleText: '',
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
        { name: '删除', icon: 'close' },
        // { name: '导出', icon: 'cloud-download' }
      ],
      datalist: [],
      dataColumns: [
        {
          title: '名称',
          dataIndex: 'slitName',
          width: 100,
        }, {
          title: '编号',
          dataIndex: 'slotNumber',
          width: 100,
        }, {
          title: '开始签到时间',
          dataIndex: 'startSign',
          width: 100,
        }, {
          title: '上班时间',
          dataIndex: 'startWork',
          width: 100,
        }, {
          title: '下班时间',
          dataIndex: 'endWork',
          width: 100,
        }, {
          title: '结束签到时间',
          dataIndex: 'endSign',
          width: 100,
        }, {
          title: '操作',
          dataIndex: 'operation',
          key: 'operation',
          width: 100,
          render: (e, _d) => {
            return (
              <div className="kqsb-qy-operation">
                <a onClick={(e) => this.newlyPopup(_d, '编辑')}>编辑</a>
                <a onClick={() => this.newlyPopup(_d, '删除')}>删除</a>
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
      ],
      selectedRows: [],

    }
  }

  componentDidMount() {

    this.getFindAllTimeslot(1, this.state.pagination.pageSize);

  }
  //更新数据
  toUpdate = () => {
    setTimeout(() => {
      this.setState({
        newlyPopup: { switch: false }
      })
    }, 0)

    this.getFindAllTimeslot(1, this.state.pagination.pageSize, "刷新成功");
  }
  setSelectedRows = (selectedRows) => {
    this.setState({ selectedRows })
  }
  //删除时间段
  deleteTimeslot = (ids) => {
    //project_war_exploded/person/addPerson.do
    ids = ids === undefined ? "" : ids;
    for (let key in this.state.selectedRows) {
      if (ids == "") {
        ids += this.state.selectedRows[key].slotNumber
      } else {
        ids += ',' + this.state.selectedRows[key].slotNumber
      }

    }

    Util._httpPost("/project_war_exploded/timeslot/deleteTimeslot.do", {
      slotNumbers: ids
    }).then((params) => {
      this.getFindAllTimeslot(1, this.state.pagination.pageSize);
      message.success(params.data.message)
    }).catch((error) => {

    })

  }
  //时间段内容
  getFindAllTimeslot = (current, pageSize, text) => {

    Util._httpPost("/project_war_exploded/timeslot/findAllTimeslot.do", JSON.stringify({
      page: current,
      size: pageSize,
      slitName: this.state.testName,
      slotNumber: this.state.number
    })).then((params) => {
      let data = [];
      for (let key in params.data.rows) {
        params.data.rows[key].key = key;
        data[key] = params.data.rows[key]
      }
      this.setState({
        datalist: data,
        pagination: {
          total: params.data.total,  //数据总数量
          pageSize: pageSize, //显示几条一页
        }
      })
      if (text) {
        message.success(text,0.5)
      }

    }).catch((error) => {

    })

  }
  //时间段内容修改
  updataTimeslotByNumber = (_data) => {

    _data.advanceTime = typeof _data.advanceTime === "object" ? (new Date(_data.advanceTime)).Format("hh:mm") : _data.advanceTime;
    _data.postponeTime = typeof _data.postponeTime === "object" ? (new Date(_data.postponeTime)).Format("hh:mm") : _data.postponeTime;
    _data.endSign = typeof _data.endSign === "object" ? (new Date(_data.endSign)).Format("hh:mm") : _data.endSign;
    _data.endWork = typeof _data.endWork === "object" ? (new Date(_data.endWork)).Format("hh:mm") : _data.endWork;
    _data.endBack = typeof _data.endBack === "object" ? (new Date(_data.endBack)).Format("hh:mm") : _data.endBack;
    _data.startBack = typeof _data.startBack === "object" ? (new Date(_data.startBack)).Format("hh:mm") : _data.startBack;
    _data.startSign = typeof _data.startSign === "object" ? (new Date(_data.startSign)).Format("hh:mm") : _data.startSign;
    _data.startWork = typeof _data.startWork === "object" ? (new Date(_data.startWork)).Format("hh:mm") : _data.startWork;

    Util._httpPost("/project_war_exploded/timeslot/updataTimeslotByNumber.do", JSON.stringify({
      ..._data
    })).then((params) => {

      this.getFindAllTimeslot(1, this.state.pagination.pageSize);
      message.success(params.data.message)


    }).catch((error) => {

    })

  }


  // onWillUnmount = (_data, titleText) => {

  //   this.setState({
  //     titleText
  //   })
  //   // personnel = _data;

  // }

  //时间段添加
  addTimeslot = (_data, op) => {
    if (op) {
      _data.advanceTime = typeof _data.advanceTime === "object" ? (new Date(_data.advanceTime)).Format("hh:mm") : _data.advanceTime;
      _data.postponeTime = typeof _data.postponeTime === "object" ? (new Date(_data.postponeTime)).Format("hh:mm") : _data.postponeTime;
      _data.endSign = typeof _data.endSign === "object" ? (new Date(_data.endSign)).Format("hh:mm") : _data.endSign;
      _data.endWork = typeof _data.endWork === "object" ? (new Date(_data.endWork)).Format("hh:mm") : _data.endWork;

      _data.endBack = typeof _data.endBack === "object" ? (new Date(_data.endBack)).Format("hh:mm") : _data.endBack;
      _data.startBack = typeof _data.startBack === "object" ? (new Date(_data.startBack)).Format("hh:mm") : _data.startBack;
      _data.startSign = typeof _data.startSign === "object" ? (new Date(_data.startSign)).Format("hh:mm") : _data.startSign;
      _data.startWork = typeof _data.startWork === "object" ? (new Date(_data.startWork)).Format("hh:mm") : _data.startWork;

      Util._httpPost("/project_war_exploded/timeslot/addTimeslot.do", {
        ..._data
      }).then((params) => {
        this.getFindAllTimeslot(1, this.state.pagination.pageSize);
        message.success(params.data.message)
      }).catch((error) => {

      })
    }

  }
  // export = () => {
  //   Util._httpPost("/project_war_exploded/timeslot/export.do", {
  //   }).then((params) => {
  //     message.success(params.data.message)
  //   }).catch((error) => {

  //   })
  // }

  newlyPopup = (_d, title) => {
    

    this.setState({
      data: _d,
      titleText: "",
      newlyPopup: {
        title: title,
        switch: true
      }
    }, () => {
      this.warningHints();
    })
  }

  onTreeNodeChange = (localValue) => {
    console.log(localValue);
    this.setState({ localValue });
  }

  warningHints() {

    let titleText = ''
    if (!this.state.data.advance) {
      titleText = '带 * 不得为空！'
    } else
      if (!this.state.data.advanceTime) {
        titleText = '带 * 不得为空！'
      } else
        if (!this.state.data.endBack) {
          titleText = '带 * 不得为空！'
        } else
          if (!this.state.data.endSign) {
            titleText = '带 * 不得为空！'
          } else
            if (!this.state.data.endWork) {
              titleText = '带 * 不得为空！'
            } else
              if (!this.state.data.postpone) {
                titleText = '带 * 不得为空！'
              } else
                if (!this.state.data.postponeTime) {
                  titleText = '带 * 不得为空！'
                } else
                  if (!this.state.data.slitName) {
                    titleText = '带 * 不得为空！'
                  } else
                    if (!this.state.data.slotNumber) {
                      titleText = '带 * 不得为空！'
                    } else
                      if (!this.state.data.startBack) {
                        titleText = '带 * 不得为空！'
                      } else
                        if (!this.state.data.startSign) {
                          titleText = '带 * 不得为空！'
                        } else
                          if (!this.state.data.startWork) {
                            titleText = '带 * 不得为空！'
                          }
    if (titleTextUserId !== "") {
      titleText = titleTextUserId
    }

    this.setState({ titleText })
  }

  render() {

    return (
      <div className="bcgl-sjd">
        <Header style={{ background: '#fff', padding: 0 }} >
          <div className="query_condition">
            <div>
              姓名：<Input value={this.state.testName} onChange={(e) => this.setState({ testName: e.target.value })} />
            </div>
            <div>
              编号：<Input value={this.state.number} onChange={(e) => this.setState({ number: e.target.value })} />
            </div>
            <div>
              <Button onClick={() => this.getFindAllTimeslot(1, this.state.pagination.pageSize)} icon="search">搜索</Button>
            </div>
            <div>
              <Button>
                <a href={Util.htmlPreposition + "/project_war_exploded/timeslot/export.do"}>导出</a>
              </Button>
            </div>
          </div>
        </Header>
        <div className="bcgl-sjd-data">

          <div className="bcgl-sjd-data-datatable">
            <DataTable setSelectedRows={this.setSelectedRows} onNewlyPopup={this.newlyPopup} {...this.state} />
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
                  ok={() => {
                    let title = this.state.newlyPopup.title;
                    this.setState({
                      newlyPopup: { switch: false }
                    }, () => {
                      if (title == "新增") {
                        this.addTimeslot(this.state.data, true)
                      } else if (title == "编辑") {
                        this.updataTimeslotByNumber(this.state.data, true)
                      }
                    })

                  }}
                  titleText={this.state.titleText}
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
                                  <Input disabled={this.state.newlyPopup.title === "编辑"} placeholder={'建议以 T 开头，如 T01'} title={'建议以 T 开头，如 T01'} type="text"
                                    value={this.state.data.slotNumber} onChange={(e) => {
                                      let value = e.target.value.replace(/[^\u4e00-\u9fa5\w]/g,''); //过滤特殊字符
                            
                                      if(/[~'!@#$%^&*()-+_=:]/.test(value)){
                                        value = value.replace(/[~'!@#$%^&*()-+_=:]/,"")
                                      }
                                      this.setState({
                                        data: {
                                          ...this.state.data,
                                          slotNumber: value
                                        }
                                      }, () => {
                                        Util._httpPost("/project_war_exploded/timeslot/findTimeslotByNumberOrName.do", JSON.stringify({
                                          slotNumber: this.state.data.slotNumber
                                        })).then((params) => {
                                          if (params.data.flag) {
                                            titleTextUserId = "";
                                          } else {
                                            titleTextUserId = params.data.message
                                          }
                                          this.warningHints()
                                        })
                                      })
                                    }} />
                                </td>
                                <th><label>名称</label><span className="required">*</span>
                                </th>
                                <td>
                                  <div>
                                    {/* <Checkbox /> */}
                                    <Input placeholder={'建议以 T 开头或 时间段 结尾'} title={'建议以 T 开头或 时间段 结尾'} type="text"
                                      value={this.state.data.slitName} onChange={(e) => {
                                        this.setState({
                                          data: {
                                            ...this.state.data,
                                            slitName: e.target.value
                                          }
                                        }, () => {
                                          Util._httpPost("/project_war_exploded/timeslot/findTimeslotByNumberOrName.do", JSON.stringify({
                                            slitName: this.state.data.slitName
                                          })).then((params) => {
                                            if (params.data.flag) {
                                              titleTextUserId = "";
                                            } else {
                                              titleTextUserId = params.data.message
                                            }
                                            this.warningHints()
                                          })
                                        })
                                      }} />
                                  </div>
                                </td>
                              </tr>
                              <tr>
                                <th>
                                  <label>开始签到时间</label><span className="required">*</span>
                                </th>
                                <td>
                                  <TimePicker format={'HH:mm'} value={this.state.data.startSign ? moment(this.state.data.startSign, 'HH:mm') : this.state.data.startSign} onChange={(value) => this.setState({
                                    data: { ...this.state.data, startSign: value }
                                  }, () => {
                                    this.warningHints();
                                  })} placeholder="开始签到时间" />
                                </td>
                                <th>
                                  <label>开始签退时间</label><span className="required">*</span>
                                </th>
                                <td>
                                  <TimePicker format={'HH:mm'} value={this.state.data.startBack ? moment(this.state.data.startBack, 'HH:mm') : this.state.data.startBack} onChange={(value) => this.setState({
                                    data: { ...this.state.data, startBack: value }
                                  }, () => {
                                    this.warningHints();
                                  })} placeholder="结束签退时间" />
                                </td>
                              </tr>
                              <tr>
                                <th >
                                  <label>上班时间</label><span className="required">*</span>
                                </th>
                                <td >
                                  <TimePicker format={'HH:mm'} value={this.state.data.startWork ? moment(this.state.data.startWork, 'HH:mm') : this.state.data.startWork} onChange={(value) => this.setState({
                                    data: { ...this.state.data, startWork: value }
                                  }, () => {
                                    this.warningHints();
                                  })} placeholder="上班时间" />
                                </td>
                                <th>
                                  <label>下班时间</label><span className="required">*</span>
                                </th>
                                <td>
                                  <TimePicker format={'HH:mm'} value={this.state.data.endWork ? moment(this.state.data.endWork, 'HH:mm') : this.state.data.endWork} onChange={(value) => this.setState({
                                    data: { ...this.state.data, endWork: value }
                                  }, () => {
                                    this.warningHints();
                                  })} placeholder="下班时间" />
                                </td>
                              </tr>
                              <tr>
                                <th >
                                  <label>结束签到时间</label><span className="required">*</span>
                                </th>
                                <td>
                                  <TimePicker format={'HH:mm'} value={this.state.data.endSign ? moment(this.state.data.endSign, 'HH:mm') : this.state.data.endSign} onChange={(value) => this.setState({
                                    data: { ...this.state.data, endSign: value }
                                  }, () => {
                                    this.warningHints();
                                  })} placeholder="结束签到时间" />
                                </td>
                                <th >
                                  <label>结束签退时间</label><span className="required">*</span>
                                </th>
                                <td colSpan="2">
                                  <TimePicker format={'HH:mm'} value={this.state.data.endBack ? moment(this.state.data.endBack, 'HH:mm') : this.state.data.endBack} onChange={(value) => this.setState({
                                    data: { ...this.state.data, endBack: value }
                                  }, () => {
                                    this.warningHints();
                                  })} placeholder="结束签退时间" />
                                </td>
                              </tr>
                              <tr>
                                <th><label>允许迟到分钟数</label></th>
                                <td>
                                  <Input type="text" value={this.state.data.late} onChange={(e) => {
                                    this.setState({
                                      data: {
                                        ...this.state.data,
                                        late: e.target.value
                                      }
                                    })
                                  }} />
                                </td>

                                <th>
                                  <label>允许早退分钟数</label>
                                </th>
                                <td colSpan="2">
                                  <Input type="text" value={this.state.data.leaveEarly} onChange={(e) => {
                                    this.setState({
                                      data: {
                                        ...this.state.data,
                                        leaveEarly: e.target.value
                                      }
                                    })
                                  }} />
                                </td>
                              </tr>
                              <tr>
                                <th><label>提前是否计加班</label><span className="required">*</span></th>
                                <td>
                                  <Select value={this.state.data.advance}
                                    onChange={(val) => this.setState({
                                      data: { ...this.state.data, advance: val }
                                    }, () => {
                                      this.warningHints();
                                    })}>
                                    <Option value='1'>是</Option>
                                    <Option value='0'>否</Option>

                                  </Select>

                                </td>
                                <th><label>延后是否计加班</label><span className="required">*</span></th>
                                <td>
                                  <Select value={this.state.data.postpone}
                                    onChange={(val) => this.setState({
                                      data: { ...this.state.data, postpone: val }
                                    }, () => {
                                      this.warningHints();
                                    })}>
                                    <Option value='1'>是</Option>
                                    <Option value='0'>否</Option>

                                  </Select>
                                </td>

                              </tr>

                              <tr>
                                <th><label>签到早于时间</label><span className="required">*</span></th>
                                <td>
                                  <TimePicker format={'HH:mm'} value={this.state.data.advanceTime ? moment(this.state.data.advanceTime, 'HH:mm') : this.state.data.advanceTime} onChange={(value) => this.setState({
                                    data: { ...this.state.data, advanceTime: value }
                                  }, () => {
                                    this.warningHints();
                                  })} placeholder="签到早于时间" />

                                </td>
                                <th><label>签退晚于时间</label><span className="required">*</span></th>
                                <td>
                                  <TimePicker format={'HH:mm'} value={this.state.data.postponeTime ? moment(this.state.data.postponeTime, 'HH:mm') : this.state.data.postponeTime} onChange={(value) => this.setState({
                                    data: { ...this.state.data, postponeTime: value }
                                  }, () => {
                                    this.warningHints();
                                  })} placeholder="签退晚于时间" />

                                </td>

                              </tr>
                              <tr>
                                <th><span className="required">{this.state.titleText}</span></th>
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
                    titleText={""}
                    close={() => {
                      this.setState({
                        newlyPopup: { switch: false }
                      })
                    }}
                    ok={() => {
                      this.deleteTimeslot(this.state.data.slotNumber);
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
                  /> : this.state.newlyPopup.title === "刷新" ?
                    this.toUpdate()
                    : this.state.newlyPopup.title === "导出" ?
                      this.export()
                      : ""
              :
              ""
          }
        </div>


      </div>
    );
  }
}

export default BcglSjd;
