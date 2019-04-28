

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
      mydata: {},
      titleText: '',
      treeSelectValue: undefined,
      setSelectedRows: [],
      selectedRowKeys: [],
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

    this.getFindAllShifts();

    // this.calendar(null, new Date().Format("yyyy-MM-dd"))

    this.getDepartment();

    this.findAllScheduling(this.state.leftDatalist[0])
  }

  calendar = (data, date) => {

    if (!data) {
      data = [];
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


    if (setSelectedRows.length !== 1) {

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
    let {addDatalist } = this.state;

    let SelectedRows = [];
    let selectedRowKey=[];
    for (let k in addDatalist) {
      if (addDatalist[k].id === _d.id) {
        SelectedRows.push(addDatalist[k]);
        selectedRowKey.push(addDatalist[k].key)
        break;

      }
    }

    this.setState({
      data: _d,
      titleText: "",
      setSelectedRows:SelectedRows,
      selectedRowKeys:selectedRowKey,
      newlyPopup: {
        title: title,
        switch: true
      }
    }, () => {
      this.warningHints()
    })
  }
  //编辑部门排班
  updateScheduling = (_data) => {
    let { setSelectedRows } = this.state

    if (setSelectedRows.length !== 1) {
      this.setState({
        titleText: "普通排班 只能选择一个班次！",
        newlyPopup: {
          title: "新增",
          switch: true
        }
      })
      return false;
    }

    _data.startTime = _data.startTime ? (new Date(_data.startTime)).Format("yyyy-MM-dd") : _data.startTime;
    _data.endTime = _data.endTime ? (new Date(_data.endTime)).Format("yyyy-MM-dd") : _data.endTime;
    _data.shiftsId = setSelectedRows[0].id;

    Util._httpPost("/project_war_exploded/Scheduling/updateScheduling.do", JSON.stringify({
      ..._data
    })).then((params) => {
      // this.onGetData(1, this.state.pagination.pageSize);
      this.findAllScheduling(this.state.mydata)
     
      message.success(params.data.message)
    }).catch((error) => {

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
      this.findAllScheduling(this.state.mydata)
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
  findAllScheduling = (_d, text) => {
    if (!_d) {
      return false;
    }
    if (!_d.id) {
      return false;
    }
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
        mydata: _d
      })
      this.getWhetherHoliday(data, new Date().Format("yyyy-MM-dd"))
      // this.calendar(data);
      if (text) {
        message.success(text)
      }
    }).catch((error) => {

    })
  }

  //更新数据
  toUpdate = () => {
    setTimeout(() => {
      if(this.state.newlyPopup.switch){
        this.findAllScheduling(this.state.mydata, "刷新成功")
      }
      this.setState({
        newlyPopup: { switch: false }
      })
     
      
    }, 0)
  
  }


  render() {
    const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      hideDefaultSelections: true,
    };
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

                          this.updateScheduling(this.state.data, true)

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

                                this.setState({ treeSelectValue }, () => {
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
                            rowSelection={rowSelection}
                            closePagination={true}
                            onNewlyPopup={() => { }}
                            {...this.state}
                            setSelectedRows={(setSelectedRows) => {
                              let selectedRowKeys = [];
                              for (let key in setSelectedRows) {
                                selectedRowKeys.push(setSelectedRows[key].key);
                              }

                              this.setState({ setSelectedRows, selectedRowKeys }, () => {
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
                        },()=>{
                          this.findAllScheduling(this.state.mydata)
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
                      : ""
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
