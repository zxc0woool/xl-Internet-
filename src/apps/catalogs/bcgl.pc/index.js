


import React, { Component } from 'react';
import { Input, Select, DatePicker, Checkbox, Row, Col, message, Button, Layout, Switch } from 'antd';
// import Information from '../../controls/information';
import DataTable from '../../controls/data.table';
import { SketchPicker } from 'react-color'
import ElasticFrame from '../../controls/elastic.frame';
import reactCSS from 'reactcss'
import moment from 'moment';
import Util from '../../../uilt/http.utils';
import './index.css';
let titleTextUserId = "";
let titleTextUserIdshiName = "";
const { Header } = Layout;
const Option = Select.Option;
let currentTimePeriod = {};
class BcglPc extends Component {
  constructor(props) {
    super(props);
    this.state = {
      titleText: "",
      number: "",
      testName: "",
      selectedRowKeys: [],
      data: { company: '1' },
      choiceData: {},
      timeScreenings: [],
      timeSlotData: [],
      timeSlotDataModel: [],
      selectedRows: [],
      detailTime: [],
      dayPeriodicUnit: {
        '1': {
          range: 99,
          visual: true,
          name: "日",
          val: 31
        },
        '2': {
          range: 15,
          visual: false,
          name: "周",
          val: 7
        },
        '3': {
          range: 12,
          visual: false,
          name: "月",
          val: 31
        }
      },
      displayColorPicker: false,
      color: {
        r: '241',
        g: '112',
        b: '19',
        a: '1',
      },
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
        { name: '新增', icon: 'file-add', company: '1' },
        { name: '删除', icon: 'close' }
      ],
      datalist: [],
      addDatalist: [],
      addDataColumns: [
        {
          title: '名称',
          dataIndex: 'slitName',
          width: 100,
        }, {
          title: '编号',
          dataIndex: 'slotNumber',
          width: 100,
        }, {
          title: '上班时间',
          dataIndex: 'startWork',
          width: 100,
        }, {
          title: '下班时间',
          dataIndex: 'endWork',
          width: 100,
        }
      ],
      dataColumns: [
        {
          title: '名称',
          dataIndex: 'shiName',
          width: 100,
        }, {
          title: '编号',
          dataIndex: 'shiNumber',
          width: 100,
        }, {
          title: '单位',
          dataIndex: 'company',
          width: 160,
          render: (e, _d) => {
            return (
              <div>
                {this.state.dayPeriodicUnit[_d.company].name}
              </div>

            )

          }
        }, {
          title: '周期',
          dataIndex: 'cycle',
          width: 160,
        }, {
          title: '操作',
          dataIndex: 'operation',
          key: 'operation',
          width: 160,
          render: (e, _d) => {
            return (
              <div className="kqsb-qy-operation">
                <a onClick={(e) => this.newlyPopup(_d, '编辑')}>编辑</a>
                <a onClick={() => this.newlyPopup(_d, '删除')}>删除</a>
                <a onClick={() => this.newlyPopup(_d, '清空时间段')}>清空时间段</a>
              </div>

            )

          },
        }
      ],


    }
  }

  warningHints = () => {

    let titleText = ''
    if (titleTextUserId !== "") {
      titleText = titleTextUserId
    } else if (titleTextUserIdshiName !== "") {
      titleText = titleTextUserIdshiName;
    } else if (!this.state.data.shiNumber) {
      titleText = '带 * 不得为空！'
    } else if (!this.state.data.shiName) {
      titleText = '带 * 不得为空！'
    } else if (!this.state.data.company) {
      titleText = '带 * 不得为空！'
    } else if (!this.state.data.cycle) {
      titleText = '带 * 不得为空！'
    } else if (titleTextUserId !== "") {
      titleText = titleTextUserId
    } else if (JSON.stringify(this.state.choiceData) === "{}") {
      titleText = '请选择时间段明细！'
    }

    this.setState({ titleText })
  }

  componentDidMount() {

    this.getFindAllTimeslot();
    this.getFindAllShifts(1, this.state.pagination.pageSize);
  }

  //班次内容
  getFindAllShifts = (current, pageSize, text) => {
    Util._httpPost("/project_war_exploded/shifts/findAllShifts.do", JSON.stringify({
      page: current,
      size: pageSize,
      shiName: this.state.testName,
      shiNumber: this.state.number
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
  //时间段内容
  getFindAllTimeslot = () => {

    Util._httpPost("/project_war_exploded/shifts/findTimeslot.do", JSON.stringify({
    })).then((params) => {
      let data = [];
      for (let key in params.data) {
        params.data[key].key = key;
        data[key] = params.data[key]
      }
      this.setState({
        addDatalist: data
      })

    }).catch((error) => {

    })

  }
  //删除时间段内容
  deleteBySimeSlot = (id) => {

    Util._httpPost("/project_war_exploded/shifts/deleteBySimeSlot.do", {
      shiNumber: id
    }).then((params) => {
      this.getFindAllShifts(1, this.state.pagination.pageSize);
      message.success(params.data.message)
    }).catch((error) => {

    })

  }
  //删除班次内容
  deleteShifts = (ids) => {
    if (ids === undefined) {
      for (let key in this.state.selectedRows) {
        if (ids == '') {
          ids += this.state.selectedRows[key].shiNumber
        } else {
          ids += ',' + this.state.selectedRows[key].shiNumber
        }
      }
    }

    Util._httpPost("/project_war_exploded/shifts/deleteShifts.do", {
      shiNumbers: ids
    }).then((params) => {
      this.getFindAllShifts(1, this.state.pagination.pageSize);
      if(params.data.flag){
        message.success(params.data.message)
      }else{
        message.error(params.data.message)
      }
      
    }).catch((error) => {

    })

  }
  //修改班次
  updataShifts = (_data) => {
    _data.simeSlot = "";

    let op = false;
    this.state.timeScreenings.map((_d) => {
      if (_data.simeSlot !== "") {
        _data.simeSlot += "/"
        op = true;
      }
      for (let i in this.state.timeSlotDataModel) {
        let slotNumber = "#";
        for (let key in this.state.choiceData) {
          if (parseInt(key.split("_")[1]) === parseInt(i) + 1) {
            if (key.split("_")[0] === _d.slotNumber) {
              slotNumber = this.state.choiceData[key].slotNumber
            }
          }
        }
        if (slotNumber !== "#") {
          if (_data.simeSlot === "" || op) {
            _data.simeSlot += slotNumber + '_' + 1;
            op = false;
          } else {
            _data.simeSlot += ',' + slotNumber + '_' + 1;
          }
        } else {
          if (_data.simeSlot === "" || op) {
            _data.simeSlot += slotNumber + '_' + 0;
            op = false;
          } else {
            _data.simeSlot += ',' + slotNumber + '_' + 0;
          }
        }
      }

    })


    _data.color = JSON.stringify(this.state.color)
    _data.slotNumbers = "";
    this.state.timeScreenings.map((_d) => {
      if (_data.slotNumbers === "") {
        _data.slotNumbers += _d.slotNumber
      } else {
        _data.slotNumbers += "," + _d.slotNumber
      }

    })

    // _data.startTime = _data.startTime ? (new Date(_data.startTime)).Format("yyyy-MM-dd") : _data.startTime;
    Util._httpPost("/project_war_exploded/shifts/updataShifts.do", JSON.stringify({
      ..._data
    })).then((params) => {

      this.getFindAllShifts(1, this.state.pagination.pageSize);
      message.success(params.data.message)

    }).catch((error) => {

    })

  }
  //添加班次
  addShifts = (_data) => {
    _data.simeSlot = "";
    let op = false;
    this.state.timeScreenings.map((_d) => {
      if (_data.simeSlot !== "") {
        _data.simeSlot += "/"
        op = true;
      }
      for (let i in this.state.timeSlotDataModel) {
        let slotNumber = "#";
        for (let key in this.state.choiceData) {
          if (parseInt(key.split("_")[1]) === parseInt(i) + 1) {

            if (key.split("_")[0] === _d.slotNumber) {
              slotNumber = this.state.choiceData[key].slotNumber
            }
          }
        }
        if (slotNumber !== "#") {
          if (_data.simeSlot === "" || op) {
            _data.simeSlot += slotNumber + '_' + 1;
            op = false;
          } else {
            _data.simeSlot += ',' + slotNumber + '_' + 1;
          }
        } else {
          if (_data.simeSlot === "" || op) {
            _data.simeSlot += slotNumber + '_' + 0;
            op = false;
          } else {
            _data.simeSlot += ',' + slotNumber + '_' + 0;
          }
        }
      }

    })

    _data.color = JSON.stringify(this.state.color)
    _data.slotNumbers = "";
    this.state.timeScreenings.map((_d) => {
      if (_data.slotNumbers === "") {
        _data.slotNumbers += _d.slotNumber
      } else {
        _data.slotNumbers += "," + _d.slotNumber
      }

    })

    _data.startTime = _data.startTime ? (new Date(_data.startTime)).Format("yyyy-MM-dd") : _data.startTime;
    Util._httpPost("/project_war_exploded/shifts/addShifts.do", JSON.stringify({
      ..._data
    })).then((params) => {

      this.getFindAllShifts(1, this.state.pagination.pageSize);
      message.success(params.data.message)

    }).catch((error) => {

    })

  }
  //更新数据
  toUpdate = () => {
    setTimeout(() => {
      this.setState({
        newlyPopup: { switch: false }
      })
    }, 0)
    this.getFindAllShifts(1, this.state.pagination.pageSize, "刷新成功");
  }
  onDetailed = (_d) => {
    if (!_d) return false
    let datalist = [];

    currentTimePeriod = _d;
    let id = 1;
    switch (this.state.dayPeriodicUnit[this.state.data.company].name) {
      case "日":
        id = 1;
        for (let i = 0; i <= parseInt(this.state.data.cycle) - 1; i++) {
          datalist.push({
            id: _d.slotNumber + '_' + id++,
            val: i + 1 + "天",
            data: _d.startWork + "-" + _d.endWork,
            knownData: [],
            choice: false,
            slotNumber: _d.slotNumber
          })
        }

        break
      case "周":
        id = 1;
        for (let i = 0; i <= parseInt(this.state.data.cycle) - 1; i++) {

          datalist.push({ id: _d.slotNumber + '_' + id++, val: "星期一", data: _d.startWork + "-" + _d.endWork, knownData: [], slotNumber: _d.slotNumber, choice: false })
          datalist.push({ id: _d.slotNumber + '_' + id++, val: "星期二", data: _d.startWork + "-" + _d.endWork, knownData: [], slotNumber: _d.slotNumber, choice: false })
          datalist.push({ id: _d.slotNumber + '_' + id++, val: "星期三", data: _d.startWork + "-" + _d.endWork, knownData: [], slotNumber: _d.slotNumber, choice: false })
          datalist.push({ id: _d.slotNumber + '_' + id++, val: "星期四", data: _d.startWork + "-" + _d.endWork, knownData: [], slotNumber: _d.slotNumber, choice: false })
          datalist.push({ id: _d.slotNumber + '_' + id++, val: "星期五", data: _d.startWork + "-" + _d.endWork, knownData: [], slotNumber: _d.slotNumber, choice: false })
          datalist.push({ id: _d.slotNumber + '_' + id++, val: "星期六", data: _d.startWork + "-" + _d.endWork, knownData: [], slotNumber: _d.slotNumber, choice: false })
          datalist.push({ id: _d.slotNumber + '_' + id++, val: "星期日", data: _d.startWork + "-" + _d.endWork, knownData: [], slotNumber: _d.slotNumber, choice: false })

        }
        break
      case "月":
        id = 1;
        for (let i = 0; i <= parseInt(this.state.data.cycle) - 1; i++) {
          for (let k = 0; k <= this.state.dayPeriodicUnit[this.state.data.company].val - 1; k++) {
            id++;
            datalist.push({
              id: _d.slotNumber + '_' + id,
              val: k + 1 + "天",
              data: _d.startWork + "-" + _d.endWork,
              knownData: [],
              choice: false,
              slotNumber: _d.slotNumber
            })
          }
        }
        break
    }
    let timeSlotData = [];

    for (let i in datalist) {
      datalist[i].choice = false;
    }

    for (let key in this.state.choiceData) {
      for (let i in datalist) {
        if (this.state.choiceData[key].id === datalist[i].id) {
          timeSlotData.push(this.state.choiceData[key].id)
        }
        if (datalist[i].id.split('_')[1] === this.state.choiceData[key].id.split('_')[1]) {
          if (this.state.choiceData[key].data.split('-')[1] > _d.startWork && this.state.choiceData[key].id.split('_')[0] !== _d.slotNumber) {

            if (_d.endWork > this.state.choiceData[key].data.split('-')[0]) {
              datalist[i].choice = true;
            }

          }

        }
      }
    }

    this.setState({
      timeSlotDataModel: datalist,
      timeSlotData
    })

  }

  timeScreening = (timeScreenings, selectedRowKeys) => {
    let choiceData = {}

    timeScreenings.map((_d) => {
      for (let key in this.state.choiceData) {

        if (this.state.choiceData[key].slotNumber === _d.slotNumber) {
          choiceData[key] = this.state.choiceData[key]
        } else {

        }
      }

    })
    // delete this.state.choiceData[key];
    this.setState({ timeScreenings, choiceData, selectedRowKeys }, () => {
      this.onDetailed(timeScreenings[timeScreenings.length - 1])
    });

  }

  whole = () => {
    let timeSlotData = new Array;
    let choiceData = this.state.choiceData

    let checkedValues = this.state.timeSlotDataModel

    let op = false;
    this.state.timeScreenings.map((_d) => {
      if (checkedValues[0].id.split('_')[0] === _d.slotNumber) {
        op = true;
      }
    })

    if (!op) {
      message.error("请先勾选左侧列表中与右侧当前显示时间一致的复选框")
    } else {

      if (currentTimePeriod) {
        checkedValues.map((val) => {
          if (!val.choice) {
            choiceData[val.id] = val;
          }
        })
      }
    }
    checkedValues.map((val) => {
      if (!val.choice) {
        timeSlotData.push(val.id);
      }

    })



    this.setState({ timeSlotData, choiceData })

  }

  notWhole = () => {
    this.setState({ timeSlotData: [], choiceData: [] })
  }

  newlyPopup = (_d, title) => {

    let choiceData = {};
    let timeScreenings = [];
    let selectedRowKeys = [];
    let timeSlotData = [];
    if (_d.simeSlot) {

      let datalist = [];
      let data = this.state.addDatalist[0];

      currentTimePeriod = _d;
      let id = 1;
      switch (this.state.dayPeriodicUnit[_d.company].name) {
        case "日":
          id = 1;
          for (let i = 0; i <= parseInt(_d.cycle) - 1; i++) {
            datalist.push({
              id: data.slotNumber + '_' + id++,
              val: i + 1 + "天",
              data: data.startWork + "-" + data.endWork,
              knownData: [],
              choice: false,
              slotNumber: data.slotNumber
            })
          }

          break
        case "周":
          id = 1;
          for (let i = 0; i <= parseInt(_d.cycle) - 1; i++) {

            datalist.push({ id: data.slotNumber + '_' + id++, val: "星期一", data: data.startWork + "-" + data.endWork, knownData: [], slotNumber: data.slotNumber, choice: false })
            datalist.push({ id: data.slotNumber + '_' + id++, val: "星期二", data: data.startWork + "-" + data.endWork, knownData: [], slotNumber: data.slotNumber, choice: false })
            datalist.push({ id: data.slotNumber + '_' + id++, val: "星期三", data: data.startWork + "-" + data.endWork, knownData: [], slotNumber: data.slotNumber, choice: false })
            datalist.push({ id: data.slotNumber + '_' + id++, val: "星期四", data: data.startWork + "-" + data.endWork, knownData: [], slotNumber: data.slotNumber, choice: false })
            datalist.push({ id: data.slotNumber + '_' + id++, val: "星期五", data: data.startWork + "-" + data.endWork, knownData: [], slotNumber: data.slotNumber, choice: false })
            datalist.push({ id: data.slotNumber + '_' + id++, val: "星期六", data: data.startWork + "-" + data.endWork, knownData: [], slotNumber: data.slotNumber, choice: false })
            datalist.push({ id: data.slotNumber + '_' + id++, val: "星期日", data: data.startWork + "-" + data.endWork, knownData: [], slotNumber: data.slotNumber, choice: false })

          }
          break
        case "月":
          id = 1;
          for (let i = 0; i <= parseInt(_d.cycle) - 1; i++) {
            for (let k = 0; k <= this.state.dayPeriodicUnit[this.state.data.company].val - 1; k++) {
              id++;
              datalist.push({
                id: data.slotNumber + '_' + id,
                val: k + 1 + "天",
                data: data.startWork + "-" + data.endWork,
                knownData: [],
                choice: false,
                slotNumber: data.slotNumber
              })
            }
          }
          break
      }


      let slotNumber = {};
      let timeSlotDataModelid = [];
      _d.simeSlot.split("/").map((_data) => {
        let simeSlotdatalist = _data.split(",");

        for (let key in simeSlotdatalist) {
          if (simeSlotdatalist[key].split("_")[0] !== "#") {
            slotNumber[simeSlotdatalist[key].split("_")[0]] = simeSlotdatalist[key].split("_")[0];
          }

          if (parseInt(simeSlotdatalist[key].split("_")[1]) === 1) {
            timeSlotDataModelid.push(
              {
                id: simeSlotdatalist[key].split("_")[0] + "_" + (parseInt(key) + 1),
                slotNumber: simeSlotdatalist[key].split("_")[0],
                val: parseInt(key) + 1,
                choice: true
              }
            )
          }
        }
      })

      for (let k in timeSlotDataModelid) {
        for (let i in this.state.addDatalist) {
          if (timeSlotDataModelid[k].slotNumber === this.state.addDatalist[i].slotNumber) {
            choiceData[timeSlotDataModelid[k].id] = {
              choice: true,
              data: this.state.addDatalist[i].startWork + "-" + this.state.addDatalist[i].endWork,
              id: timeSlotDataModelid[k].id,
              knownData: [],
              slotNumber: timeSlotDataModelid[k].slotNumber,
            }
          }
        }


      }


      for (let key in choiceData) {

        timeSlotData.push(choiceData[key].id);

      }

      this.state.addDatalist.map((_data) => {
        for (let k in slotNumber) {
          if (_data.slotNumber === k) {
            selectedRowKeys.push(_data.key)
            timeScreenings.push(_data)
            break;
          }
        }

      })

      this.setState({ timeSlotData, timeSlotDataModel: datalist, })

    }


    this.setState({
      color: _d.color ? JSON.parse(_d.color) : this.state.color,
      data: _d,
      titleText: "",
      choiceData,
      timeScreenings,
      selectedRowKeys,
      timeSlotData,
      newlyPopup: {
        title: title,
        switch: true
      }
    }, () => {
      
    })
    // this.warningHints();
  }

  render() {
    const { selectedRowKeys } = this.state;
    const styles = reactCSS({
      'default': {
        color: {
          width: '50px',
          height: '14px',
          borderRadius: '2px',
          background: `rgba(${this.state.color.r}, ${this.state.color.g}, ${this.state.color.b}, ${this.state.color.a})`,
        },
        swatch: {
          padding: '5px',
          background: '#fff',
          borderRadius: '1px',
          boxShadow: '0 0 0 1px #d9d9d9',
          display: 'inline-block',
          cursor: 'pointer',
          borderRadius: '4px'
        },
        popover: {
          position: 'absolute',
          zIndex: '2',
        },
        cover: {
          position: 'fixed',
          top: '0px',
          right: '0px',
          bottom: '0px',
          left: '0px',
        },
      },
    });
    const rowSelection = {
      selectedRowKeys,
      hideDefaultSelections: true,
    };
    return (
      <div className="bcgl-pc">
        <Header style={{ background: '#fff', padding: 0 }} >
          <div className="query_condition">
            <div>
              姓名：<Input value={this.state.testName}
              onKeyDown={(event) => {
                if (event.keyCode == 13) this.getFindAllShifts(1, this.state.pagination.pageSize)}} onChange={(e) => this.setState({ testName: e.target.value })} />
            </div>
            <div>
              编号：<Input value={this.state.number}
              onKeyDown={(event) => {
                if (event.keyCode == 13) this.getFindAllShifts(1, this.state.pagination.pageSize)}} onChange={(e) => this.setState({ number: e.target.value })} />
            </div>
            <div>
              <Button onClick={() => this.getFindAllShifts(1, this.state.pagination.pageSize)} icon="search">搜索</Button>
            </div>
            <Button>
              <a href={Util.htmlPreposition + "/project_war_exploded/shifts/export.do"}>导出</a>
            </Button>
          </div>
        </Header>
        <div className="bcgl-pc-data">

          <div className="bcgl-pc-data-datatable">
            <DataTable
              onRow={(_d) => {
                return {
                  onClick: (e, val) => {

                    let choiceData = {};
                    let timeScreenings = [];
                    let selectedRowKeys = [];
                    let timeSlotData = [];

                    let datalist = [];
                    let data = this.state.addDatalist[0];

                    currentTimePeriod = _d;
                    let id = 1;
                    switch (this.state.dayPeriodicUnit[_d.company].name) {
                      case "日":
                        id = 1;
                        for (let i = 0; i <= parseInt(_d.cycle) - 1; i++) {
                          datalist.push({
                            id: data.slotNumber + '_' + id++,
                            val: i + 1 + "天",
                            data: data.startWork + "-" + data.endWork,
                            knownData: [],
                            choice: false,
                            slotNumber: data.slotNumber
                          })
                        }

                        break
                      case "周":
                        id = 1;
                        for (let i = 0; i <= parseInt(_d.cycle) - 1; i++) {

                          datalist.push({ id: data.slotNumber + '_' + id++, val: "星期一", data: data.startWork + "-" + data.endWork, knownData: [], slotNumber: data.slotNumber, choice: false })
                          datalist.push({ id: data.slotNumber + '_' + id++, val: "星期二", data: data.startWork + "-" + data.endWork, knownData: [], slotNumber: data.slotNumber, choice: false })
                          datalist.push({ id: data.slotNumber + '_' + id++, val: "星期三", data: data.startWork + "-" + data.endWork, knownData: [], slotNumber: data.slotNumber, choice: false })
                          datalist.push({ id: data.slotNumber + '_' + id++, val: "星期四", data: data.startWork + "-" + data.endWork, knownData: [], slotNumber: data.slotNumber, choice: false })
                          datalist.push({ id: data.slotNumber + '_' + id++, val: "星期五", data: data.startWork + "-" + data.endWork, knownData: [], slotNumber: data.slotNumber, choice: false })
                          datalist.push({ id: data.slotNumber + '_' + id++, val: "星期六", data: data.startWork + "-" + data.endWork, knownData: [], slotNumber: data.slotNumber, choice: false })
                          datalist.push({ id: data.slotNumber + '_' + id++, val: "星期日", data: data.startWork + "-" + data.endWork, knownData: [], slotNumber: data.slotNumber, choice: false })

                        }
                        break
                      case "月":
                        id = 1;
                        for (let i = 0; i <= parseInt(_d.cycle) - 1; i++) {
                          for (let k = 0; k <= this.state.dayPeriodicUnit[this.state.data.company].val - 1; k++) {
                            id++;
                            datalist.push({
                              id: data.slotNumber + '_' + id,
                              val: k + 1 + "月",
                              data: data.startWork + "-" + data.endWork,
                              knownData: [],
                              choice: false,
                              slotNumber: data.slotNumber
                            })
                          }
                        }
                        break
                    }


                    let slotNumber = {};
                    let timeSlotDataModelid = [];
                    _d.simeSlot.split("/").map((_data) => {
                      let simeSlotdatalist = _data.split(",");

                      for (let key in simeSlotdatalist) {
                        if (simeSlotdatalist[key].split("_")[0] !== "#") {
                          slotNumber[simeSlotdatalist[key].split("_")[0]] = simeSlotdatalist[key].split("_")[0];
                        }

                        if (parseInt(simeSlotdatalist[key].split("_")[1]) === 1) {
                          timeSlotDataModelid.push(
                            {
                              id: simeSlotdatalist[key].split("_")[0] + "_" + (parseInt(key) + 1),
                              slotNumber: simeSlotdatalist[key].split("_")[0],
                              val: parseInt(key) + 1,
                              choice: true
                            }
                          )
                        }
                      }
                    })

                    for (let k in timeSlotDataModelid) {
                      for (let i in this.state.addDatalist) {
                        if (timeSlotDataModelid[k].slotNumber === this.state.addDatalist[i].slotNumber) {
                          choiceData[timeSlotDataModelid[k].id] = {
                            choice: true,
                            data: this.state.addDatalist[i].startWork + "-" + this.state.addDatalist[i].endWork,
                            id: timeSlotDataModelid[k].id,
                            knownData: [],
                            slotNumber: timeSlotDataModelid[k].slotNumber,
                          }
                        }
                      }


                    }


                    for (let key in choiceData) {

                      timeSlotData.push(choiceData[key].id);

                    }

                    this.state.addDatalist.map((_data) => {
                      for (let k in slotNumber) {
                        if (_data.slotNumber === k) {
                          selectedRowKeys.push(_data.key)
                          timeScreenings.push(_data)
                          break;
                        }
                      }

                    })
                    let detailTime = [];
                    datalist.map((_data) => {
                      let data = {};
                      data.name = _data.val;
                      data.dates = "";
                      for (let key in choiceData) {

                        if (_data.id.split('_')[1] === key.split('_')[1]) {

                          if (data.dates === "") {
                            data.dates += choiceData[key].data
                          } else {
                            data.dates += ` ` + choiceData[key].data
                          }
                        }
                      }
                      detailTime.push(data)
                      data = {};
                    })
                    this.setState({ detailTime });
                    // console.log(_d)
                  }
                };
              }}
              setSelectedRows={(selectedRows, selectedRowKeys) => {

                this.setState({ selectedRows })
              }}
              onNewlyPopup={this.newlyPopup} {...this.state} />
          </div>
          <div className="bcgl-pc-right-data-datatable">
            <div className="bcgl-pc-first-child">
              时间段明细
            </div>
            <div className="bcgl-pc-date-data-datatable">.
              {/* {
                this.state.detailTime.map((_d, key) => {
                  return <span key={key}>
                    <div>{_d.name}</div>
                    <span>{_d.dates}</span>
                  </span>
                })
              } */}
              <table width="100%">
                <tbody>
                  {
                    this.state.detailTime.map((_d, key) => {
                      return <tr key={key} height="30px">
                        <td width="30%" >
                          <span>{_d.name}</span>
                        </td>
                        <td width="70%">
                          <span >
                            {_d.dates}
                          </span>
                        </td>
                      </tr>
                    })
                  }

                </tbody>
              </table>

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
                  titleText={this.state.titleText}
                  ok={() => {
                    let title = this.state.newlyPopup.title;
                    this.setState({
                      newlyPopup: { switch: false }
                    }, () => {
                      if (title == "新增") {

                        this.addShifts(this.state.data, true)

                      } else if (title == "编辑") {

                        this.updataShifts(this.state.data, true)

                      }


                    })
                    // this.addPerson()
                  }}
                  renderDom={(props) => {
                    return (
                      <div className="bcgl-pc_newly_added">
                        <div className="bcgl-pc_tableStyle">
                          <table className="tableStyle">
                            <tbody>
                              <tr>
                                {/* <th>
                                  <label>班次类型</label><span className="required">*</span>
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
                                    <Option value='1'>规律班次</Option>
                                    <Option value='2'>弹性班次</Option>

                                  </Select>
                                </td> */}
                                <th><label>颜色</label><span className="required">*</span>
                                </th>
                                <td>
                                  <div>
                                    <div style={styles.swatch} onClick={() => this.setState({ displayColorPicker: !this.state.displayColorPicker })}>
                                      <div style={styles.color} />
                                    </div>
                                    {this.state.displayColorPicker ? <div style={styles.popover}>
                                      <div style={styles.cover} onClick={() => { this.setState({ displayColorPicker: false }) }} />
                                      <SketchPicker color={this.state.color} onChange={(color) => { this.setState({ color: color.rgb }) }} />
                                    </div> : null}
                                  </div>
                                </td>
                              </tr>
                              <tr>
                                <th>
                                  <label>编号</label><span className="required">*</span>
                                </th>
                                <td>
                                  <Input disabled={this.state.newlyPopup.title === "编辑"} placeholder={'建议以 S 开头，如 S01'} title={'建议以 S 开头，如 S01'} type="text" value={this.state.data.shiNumber} onChange={(e) => {
                                    this.setState({
                                      data: {
                                        ...this.state.data,
                                        shiNumber: e.target.value
                                      }
                                    }, () => {
                                      //编号是否重复
                                      Util._httpPost("/project_war_exploded/shifts/findShiftsByNumberAndName.do", JSON.stringify({
                                        shiNumber: this.state.data.shiNumber
                                      })).then((params) => {
                                        if (params.data.flag) {
                                          titleTextUserId = "";
                                        } else {
                                          titleTextUserId = params.data.message
                                        }
                                        this.warningHints();
                                      })

                                    })
                                  }} />
                                </td>
                                <th>
                                  <label>名称</label><span className="required">*</span>
                                </th>
                                <td>
                                  <Input placeholder={'建议以 S 开头或 班次 结尾'} title={'建议以 S 开头或 班次 结尾'} type="text" value={this.state.data.shiName} onChange={(e) => {
                                    this.setState({
                                      data: {
                                        ...this.state.data,
                                        shiName: e.target.value
                                      }
                                    }, () => {
                                      //名称是否重复
                                      Util._httpPost("/project_war_exploded/shifts/findShiftsByNumberAndName.do", JSON.stringify({
                                        shiName: this.state.data.shiName
                                      })).then((params) => {
                                        if (params.data.flag) {
                                          titleTextUserIdshiName = "";
                                        } else {
                                          titleTextUserIdshiName = params.data.message
                                        }
                                        this.warningHints();
                                      })

                                    })
                                  }} />
                                </td>
                              </tr>
                              <tr>
                                <th >
                                  <label>单位</label><span className="required">*</span>
                                </th>
                                <td >
                                  <Select value={this.state.data.company}
                                    onChange={(val) => this.setState({
                                      data: { ...this.state.data, company: val }
                                    }, () => {
                                      this.setState({
                                        data: {
                                          ...this.state.data,
                                          cycle: undefined
                                        }
                                      }, () => {
                                        this.warningHints();
                                      })
                                    })}>
                                    <Option value='1'>日</Option>
                                    <Option value='2'>周</Option>
                                    <Option value='3'>月</Option>
                                  </Select>
                                </td>
                                <th>
                                  <label>周期</label><span className="required">{"(1-" + this.state.dayPeriodicUnit[this.state.data.company].range + ")"}*</span>
                                </th>
                                <td>
                                  <Input placeholder={'周期'} title={'周期'} type="text" value={this.state.data.cycle} onChange={(e) => {
                                    let value = e.target.value
                                    value = value.replace(/[^0-9]/g, '')
                                    if (value <= this.state.dayPeriodicUnit[this.state.data.company].range) {
                                    } else {
                                      value = this.state.dayPeriodicUnit[this.state.data.company].range
                                    }
                                    this.setState({
                                      data: {
                                        ...this.state.data,
                                        cycle: value
                                      }
                                    }, () => {
                                      this.warningHints();
                                    })
                                  }} />
                                </td>
                              </tr>
                              <tr>
                                <td className="required">
                                  {this.state.titleText}
                                </td>
                              </tr>
                              {/* <tr style={!this.state.dayPeriodicUnit[this.state.data.company].visual ? { display: 'none' } : {}}>
                                 <th >
                                  <label>起始日期</label><span className="required">*</span>
                                </th>
                                <td>
                                  <DatePicker value={this.state.data.startTime ? moment(this.state.data.startTime) : this.state.data.startTime} onChange={(value) => {

                                    this.setState({
                                      data: { ...this.state.data, startTime: value }
                                    })
                                  }
                                  } placeholder="起始日期" />
                                </td> 
                                 <th >
                                  <label>是否月内轮班</label><span className="required">*</span>
                                </th>
                                <td colSpan="2">
                                  <Select value={this.state.data.idType}
                                    onChange={(val) => this.setState({
                                      data: { ...this.state.data, idType: val }
                                    })}>
                                    <Option value='1'>是</Option>
                                    <Option value='0'>否</Option>

                                  </Select>
                                </td> 
                              </tr> */}
                            </tbody>
                          </table>
                        </div>


                        <DataTable
                          style={{ height: 350, width: 560, float: 'left' }}
                          scroll={{ y: 315 }}
                          closePagination={true}
                          rowSelection={rowSelection}
                          onNewlyPopup={() => { }}
                          {...this.state}
                          selectedRowKeys={this.state.selectedRowKeys}
                          setSelectedRows={this.timeScreening}
                         
                          dataColumns={this.state.addDataColumns}
                          datalist={this.state.addDatalist}
                          titlelist={[]}
                          onRow={(record) => {
                            return {
                              onClick: (e, _d) => {
                                if (!this.state.data.cycle || this.state.data.cycle === "") {
                                  message.error("请填写周期单位和周期数")
                                } else {

                                  this.onDetailed(record)
                                }
                                // console.log(record)
                              }
                            };
                          }}
                        />
                        <div className="bcgl-pc-choice">
                          <table style={{ height: "350px", width: "100%" }} >
                            <tbody>
                              <tr height="34px">
                                <td style={{ borderBottom: '1px solid #dcdfe2 !important', verticalAlign: 'middle', textAlign: 'center' }}>
                                  <a onClick={this.whole}>全选</a>
                                  <strong id="period_no" style={{ fontWeight: 'bold' }}></strong>
                                  <strong style={{ fontWeight: 'bold' }}>时间段明细</strong>
                                  <a onClick={this.notWhole}>全不选</a>
                                </td>
                              </tr>
                              {/* <tr height="20px">
                                <td style={{ borderBottom: '1px solid #dcdfe2 !important', verticalAlign: 'middle', textAlign: 'center' }}>
                                  <strong style={{ fontWeight: 'bold' }}>{currentTimePeriod.slitName}</strong>
                                </td>
                              </tr> */}
                              <tr>
                                <td valign="top">
                                  <div style={{ height: 315, overflow: 'auto' }}>
                                    <Checkbox.Group
                                      value={this.state.timeSlotData}
                                      style={{ width: '100%', padding: 10 }}
                                      onChange={
                                        (checkedValues) => {
                                          let choiceData = this.state.choiceData;
                                          
                                          checkedValues.map((key) => {
                                            for(let k in choiceData){
                                              if (choiceData[k].id.split('_')[0] === key.split('_')[0]) {
                                                delete choiceData[choiceData[k].id];
                                                break;
                                              }
                                            }
                                          })

                                          let op = false;
                                          this.state.timeScreenings.map((_d) => {
                                            if (checkedValues.length === 0) {
                                              op = true;
                                            } else if (checkedValues[0].split('_')[0] === _d.slotNumber) {
                                              op = true;
                                            }

                                          })

                                          if (!op) {
                                            message.error("请先勾选左侧列表中与右侧当前显示时间一致的复选框")
                                          } else {

                                            if (currentTimePeriod) {
                                              this.state.timeSlotDataModel.map((_d) => {
                                                checkedValues.map((val) => {
                                                  if (val === _d.id) {
                                                    choiceData[_d.id] = _d
                                                  }else{
                                                    if(choiceData[_d.id] && val === _d.id){
                                                      delete choiceData[_d.id]
                                                    }
                                                  }
                                                })

                                                return _d
                                              })
                                            }
                                            this.warningHints();
                                            this.setState({
                                              timeSlotData: checkedValues,
                                              choiceData
                                            })
                                            console.log('checked = ', checkedValues);
                                          }

                                        }
                                      }>
                                      <Row>
                                        {
                                          this.state.timeSlotDataModel.map((val, key) => {
                                            return <Col key={key} span={24}>
                                              <Checkbox style={{ width: '100%' }} disabled={val.choice} value={val.id}>
                                                <span>{val.val}</span>
                                                <span style={{ float: 'right', marginLeft: 36 }}>{val.data}</span>
                                              </Checkbox>
                                            </Col>
                                          })

                                        }
                                      </Row>
                                    </Checkbox.Group>
                                  </div>


                                </td>
                              </tr>
                            </tbody></table>
                        </div>

                      </div>
                    )
                  }}
                /> : this.state.newlyPopup.title === "删除" ?
                  <ElasticFrame
                    style={{ width: 280, height: 150 }}
                    title={"提示"}
                    titleText={this.state.titleText}
                    close={() => {
                      this.setState({
                        newlyPopup: { switch: false }
                      })
                    }}
                    ok={() => {
                      this.deleteShifts(this.state.data.shiNumber);
                      this.setState({
                        newlyPopup: { switch: false },
                        selectedRows:[]
                      })
                    }}
                    renderDom={(props) => {
                      return (
                        <div className="">
                          你确定要执行删除操作吗？
                      </div>
                      )
                    }}
                  /> : this.state.newlyPopup.title === "清空时间段" ?
                    <ElasticFrame
                      style={{ width: 280, height: 150 }}
                      title={"提示"}
                      titleText={this.state.titleText}
                      close={() => {
                        this.setState({
                          newlyPopup: { switch: false }
                        })
                      }}
                      ok={() => {
                        this.deleteBySimeSlot(this.state.data.shiNumber);
                        this.setState({
                          newlyPopup: { switch: false }
                        })
                      }}
                      renderDom={(props) => {
                        return (
                          <div className="">
                            你确定要清空当前时间段吗？【{this.state.data.shiName}】
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
    );
  }
}

export default BcglPc;
