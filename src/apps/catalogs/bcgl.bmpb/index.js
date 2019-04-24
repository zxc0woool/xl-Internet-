

import React, { Component } from 'react';
import DataTree from '../../controls/data.tree';
import DataTable from '../../controls/data.table';
import ElasticFrame from '../../controls/elastic.frame';
import { Select, DatePicker, TreeSelect, message } from 'antd';
import moment from 'moment';
import Util from '../../../uilt/http.utils';
import $ from '../../../js/calendar/index';

import './index.css';
const TreeNode = TreeSelect.TreeNode;
const Option = Select.Option;

class BcglBmpb extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: {},
      titleText:'',
      treeSelectValue: undefined,
      setSelectedRows: [],
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
        { name: '新增', icon: 'file-add'},
        { name: '删除', icon: 'close' },
        { name: '新增临时排班', icon: 'file-add' },
      ],
      datalist: [],
      addDatalist: [],
      addDataColumns: [
        {
          title: '编号',
          dataIndex: 'shiNumber',
          width: 100,
        }, {
          title: '名称',
          dataIndex: 'shiName',
          width: 100,
        }
      ],
      dataColumns: [
        {
          title: '部门编号',
          dataIndex: 'departId',
          width: 100,
        }, {
          title: '部门名称',
          dataIndex: 'departName',
          width: 100,
        }, {
          title: '班次名称',
          dataIndex: 'shiName',
          width: 100,
        }, {
          title: '开始时间',
          dataIndex: 'startTime',
          width: 100,
        }, , {
          title: '结束时间',
          dataIndex: 'endTime',
          width: 100,
        }, {
          title: '操作',
          dataIndex: 'operation',
          key: 'operation',
          width: 80,
          render: (e, _d) => {
            return <div className="rygl-bm-operation">
              <a onClick={() => this.newlyPopup(_d, '编辑')}>编辑</a>
              <a onClick={() => this.newlyPopup(_d, '删除')}>删除</a>
            </div>
          },
        }
      ],
      leftDatalist: [],

    }

  }

  componentDidMount() {

    // const datalist = [];
    // for (let i = 0; i < 100; i++) {
    //   datalist.push({
    //     key: i + 1,
    //     perId: `编号 ${i + 1}`,
    //     perName: '姓名' + `小${i + 1}`,
    //     departmentName: 'A' + i + 1 + '部门',
    //     entryDate: '2019-3-11 13:20:12'

    //   });
    // }
    // this.setState({ datalist });

    this.getFindAllShifts();

    this.calendar(null, new Date().Format("yyyy-MM-dd"))

    this.getDepartment();
  }

  calendar = (data, date) => {

    if (!data) {
      data = [];
      // data = [
      //   { startDate: "2018-6-10", name: "事件1" },
      //   { startDate: "2018-7-10", name: "事件1" },
      //   { startDate: "2018-8-10", name: "事件1" },
      //   { startDate: "2018-9-10", name: "事件1" },
      //   { startDate: "2018-10-10", name: "事件1" },
      //   { startDate: "2018-11-1", name: "事件2" },
      //   { startDate: "2018-11-2", name: "事件11" },
      //   { startDate: "2018-12-1", name: "事件12" },
      //   { startDate: "2018-12-1", name: "事件13" },
      //   { startDate: "2018-12-1", name: "事14" },
      //   { startDate: "2019-1-10", name: "事件14" },
      //   { startDate: "2019-2-10", name: "事件14" },
      //   { startDate: "2019-3-10", name: "事件14" },
      //   { startDate: "2019-4-10", name: "事件14" },
      //   { startDate: "2019-5-10", name: "事件14" },
      //   { startDate: "2019-6-10", name: "事件14" },
      //   { startDate: "2019-7-10", name: "事件14" },
      //   { startDate: "2019-8-10", name: "事件14" },
      //   { startDate: "2019-9-10", name: "事件14" },
      //   { startDate: "2019-10-10", name: "事件14" },
      //   { startDate: "2019-11-10", name: "事件14" },
      //   { startDate: "2019-12-10", name: "事件14" },
      //   { startDate: "2020-1-10", name: "事件14" },
      //   { startDate: "2020-2-10", name: "事件14" },
      // ]

    }
    // $(".calendar").html("");
    $(".calendar").calendar({
      data: data,
      mode: "month",
      //  maxEvent: 2,
      showModeBtn: false,
      newDate: date,
      cellClick: function (events) {
        //viewCell的事件列表

      },
      onTimeChange: (date) => {

        this.getWhetherHoliday(this.state.datalist, new Date(date).Format("yyyy-MM-dd"))

      }
    })
  }

  //班次内容
  getFindAllShifts = () => {
    Util._httpPost("/project_war_exploded/shifts/findALLShifts.do", JSON.stringify({

    })).then((params) => {
      let data = [];
      for (let key in params.data) {
        params.data[key].key = key;
        data[key] = params.data[key]
      }
      this.setState({
        addDatalist: data,
      })

    }).catch((error) => {

    })
  }
  //部门排班详情日历展示
  getWhetherHoliday = (datalist, date) => {
    Util._httpPost("/project_war_exploded/Scheduling/getWhetherHoliday.do", JSON.stringify({
      datalist: datalist,
      date: date
    })).then((params) => {

      this.calendar(params.data, date)

    }).catch((error) => {

    })
  }

  //删除部门排班
  deleteDepartmentalScheduling = (ids) => {

    for (let key in this.state.setSelectedRows) {
      if (ids == "") {
        ids += this.state.setSelectedRows[key].schedulingId
      } else {
        ids += ',' + this.state.setSelectedRows[key].schedulingId
      }

    }

    Util._httpPost("/project_war_exploded/Scheduling/deleteDepartmentalScheduling.do", JSON.stringify({
      departIds: ids
    })).then((params) => {
      message.success(params.data.message)
    }).catch((error) => {

    })
  }
  warningHints = () => {
    let { treeSelectValue, setSelectedRows } = this.state
    let titleText = ''
   

    if (!(setSelectedRows.length > 0)) {

      titleText = "普通排班 只能选择一个班次！";

    } else if (treeSelectValue && treeSelectValue.length < 1) {

      titleText = "部门未选择！";

    }
    if (!this.state.data.startTime) {
      titleText = '带 * 不得为空！'
    }

    // if (titleTextUserIdposiId !== "") {
    //   titleText = titleTextUserIdposiId
    // }
    // if (titleTextUserId !== "") {
    //   titleText = titleTextUserId
    // }

    this.setState({ titleText })
  }

  TreeNode = (datalist) => {
    return datalist.map((_d) => {
      return (
        <TreeNode value={_d.id} title={_d.name} key={_d.id}>
          {

            _d.children ? this.TreeNode(_d.children) : ''

          }
        </TreeNode>
      )
    })

  }
  newlyPopup = (_d, title) => {
    // _d.

    this.setState({
      data: _d,
      titleText: "",
      newlyPopup: {
        title: title,
        switch: true
      }
    },()=>{
      this.warningHints()
    })
  }

  //添加部门排班
  addDepartmentalScheduling = (_data) => {
    let { treeSelectValue, setSelectedRows } = this.state

    if (!(setSelectedRows.length > 0)) {
      this.setState({
        titleText: "普通排班 只能选择一个班次！",
        newlyPopup: {
          title: "新增",
          switch: true
        }
      })
      return false;
    }
    if (!treeSelectValue || treeSelectValue.length < 0) {
      this.setState({
        titleText: "选择的部门不得少于一个！",
        newlyPopup: {
          title: "新增",
          switch: true
        }
      })
      return false;
    }

    _data.startTime = _data.startTime ? (new Date(_data.startTime)).Format("yyyy-MM-dd") : _data.startTime;
    _data.endTime = _data.endTime ? (new Date(_data.endTime)).Format("yyyy-MM-dd") : _data.endTime;
    _data.departIds = treeSelectValue;
    _data.shiftsId = setSelectedRows[0].id;


    Util._httpPost("/project_war_exploded/Scheduling/addDepartmentalScheduling.do", JSON.stringify({
      ..._data
    })).then((params) => {
      // this.onGetData(1, this.state.pagination.pageSize);
      message.success(params.data.message)
    }).catch((error) => {

    })
  }
  //部门内容
  getDepartment = () => {
    Util._httpPost("/project_war_exploded/department/selecttree.do", JSON.stringify({
    })).then((params) => {
      this.setState({
        leftDatalist: params.data.rows
      })
    }).catch((error) => {

    })
  }



  //部门排班查询
  findAllScheduling = (_d) => {
    Util._httpPost("/project_war_exploded/Scheduling/findAllScheduling.do", JSON.stringify({
      departId: _d.id
    })).then((params) => {
      let data = [];
      for (let key in params.data.rows) {
        params.data.rows[key].key = key;
        data[key] = params.data.rows[key]
      }

      this.setState({
        datalist: data,
      })
      this.getWhetherHoliday(data, new Date().Format("yyyy-MM-dd"))
      // this.calendar(data);

    }).catch((error) => {

    })
  }

  render() {

    return (
      <div className="bcgl_bmpb">
        <div className="bcgl_bmpb-data">
          <div className="bcgl_bmpb-data-datatree">
            <DataTree {...this.state} ongetfindAllByDepartment={this.findAllScheduling} />
          </div>

          <div className="bcgl_bmpb-data-datatable">
            <DataTable style={{ height: 202 }} scroll={{ y: 167 }} closePagination={true} onNewlyPopup={this.newlyPopup} {...this.state} />
            <div className="calendar">

            </div>
            {
              //弹出框
              this.state.newlyPopup.switch ?
                this.state.newlyPopup.title === "新增" || this.state.newlyPopup.title === "编辑" || this.state.newlyPopup.title === "新增临时排班" ?
                  <ElasticFrame
                    style={{ width: 800, height: 600 }}
                    title={this.state.newlyPopup.title}
                    titleText={this.state.titleText}
                    ok={() => {
                      let title = this.state.newlyPopup.title;
                      this.setState({
                        newlyPopup: { switch: false }
                      }, () => {
                        if (title == "新增") {

                          this.addDepartmentalScheduling(this.state.data, true)

                        } else if (title == "编辑") {

                          // this.setPerson(personnel, true)

                        } else if (title == "新增临时排班") {

                          // this.setPerson(personnel, true)

                        }


                      })
                      // this.addPerson()
                    }}
                    close={() => {
                      this.setState({
                        newlyPopup: { switch: false }
                      })
                    }}
                    renderDom={(props) => {
                      let title = this.state.newlyPopup.title
                      let schedulingType = [
                        { value: "0", name: '普通排班' },
                        // { value: "1", name: '智能排班' }
                      ];
                      if (title === "新增临时排班") {
                        schedulingType = [{ value: "0", name: '普通排班' }];
                      }
                      return (
                        <div className="bcgl-pc_newly_added">
                          <div className="bcgl_bmpb-data-datatree" style={this.state.newlyPopup.title === '编辑' ? { display: 'none' } : {}}>
                            部门选择
                            <TreeSelect
                              showSearch
                              style={{ width: 300 }}
                              value={this.state.treeSelectValue}
                              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                              placeholder="点击输入框 选择部门"
                              allowClear
                              multiple
                              treeDefaultExpandAll
                              onChange={(treeSelectValue) => {
                                console.log(treeSelectValue);

                                this.setState({ treeSelectValue },()=>{
                                  this.warningHints()
                                });
                              }}

                            >
                              {
                                this.TreeNode(this.state.leftDatalist)
                              }
                            </TreeSelect>
                            {/* <DataTree style={{ height: 460 }}  {...this.state} /> */}
                          </div>
                          <table className="tableStyle">
                            <tbody>
                              {/* <tr>
                                <th>
                                  <label>排班类型</label>
                                </th>
                                <td>
                                  <Select value={this.state.data.idType}
                                    onChange={(val) => {
                                      this.setState({
                                        data: {
                                          ...this.state.data,
                                          idType: val
                                        }
                                      })
                                    }}>
                                    {
                                      schedulingType.map((_d, key) => {
                                        return <Option key={key} value={_d.value}>{_d.name}</Option>
                                      })
                                    }

                                  </Select>
                                </td>

                              </tr> */}
                              <tr>
                                <th>
                                  <label>开始时间</label><span className="required">*</span>
                                </th>
                                <td>
                                  <DatePicker value={this.state.data.startTime ? moment(this.state.data.startTime) : this.state.data.startTime} onChange={(value) => this.setState({
                                    data: { ...this.state.data, startTime: value }
                                  })} placeholder="开始时间" />
                                </td>
                              </tr>
                              <tr>
                                <th>
                                  <label>结束时间</label>{title === "新增临时排班" ? <span className="required">*</span> : ''}
                                </th>
                                <td>
                                  <DatePicker value={this.state.data.endTime ? moment(this.state.data.endTime) : this.state.data.endTime} onChange={(value) => this.setState({
                                    data: { ...this.state.data, endTime: value }
                                  })} placeholder="结束时间" />
                                </td>
                              </tr>
                              <tr>
                                <th>
                                  <label className="required">{this.state.titleText}</label>
                                </th>
                                <td>
                                 
                                </td>
                              </tr>

                            </tbody>
                          </table>
                          <DataTable
                            style={{ height: 350, width: 620, float: 'left', marginTop: 64 }}
                            scroll={{ y: 315 }}
                            closeTitle={true}
                            closePagination={true}
                            onNewlyPopup={() => { }}
                            {...this.state}
                            setSelectedRows={(_d) => {
                              this.setState({ setSelectedRows: _d },()=>{
                                this.warningHints()
                              })
                            }}
                            dataColumns={this.state.addDataColumns}
                            datalist={this.state.addDatalist}
                            titlelist={[]}
                          />
                        </div>
                      )
                    }}
                  /> : this.state.newlyPopup.title === "删除" ?
                    <ElasticFrame
                      style={{ width: 280, height: 150 }}
                      title={"提示"}
                      titleText={''}
                      close={() => {
                        this.setState({
                          newlyPopup: { switch: false }
                        })
                      }}
                      ok={() => {
                        this.deleteDepartmentalScheduling(this.state.data.schedulingId);
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
      </div>
    );
  }
}

export default BcglBmpb;
