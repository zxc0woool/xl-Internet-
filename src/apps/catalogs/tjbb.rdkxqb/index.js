

import React, { Component } from 'react';
import DataTree from '../../controls/data.tree';
import DataTable from '../../controls/data.table';
import Util from '../../../uilt/http.utils';
import { Input, Select, DatePicker, Checkbox, Row, Col, message, Button, Layout, Switch } from 'antd';
import './index.css';
import moment from 'moment';

const { Header } = Layout;
class TjbbRdkxqb extends Component {

  constructor(props) {
    super(props);
    this.state = {
      localValue: '',
      startTime: new Date(),
      endTime: new Date(),
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
      ],
      datalist: [],
      dataColumns: [
        {
          title: '人员编号',
          dataIndex: 'perId',
          width: 80,
        }, {
          title: '姓名',
          dataIndex: 'perName',
          width: 100,
        }, {
          title: '部门编号',
          dataIndex: 'departmentId',
          width: 80,
        }, {
          title: '部门名称',
          dataIndex: 'departName',
          width: 100,
        }, {
          title: '打卡日期',
          dataIndex: 'date',
          width: 100,
        }, {
          title: '打卡次数',
          dataIndex: 'count',
          width: 80,
        }, {
          title: '最早时间',
          dataIndex: 'startTime',
          width: 80,
        }, {
          title: '最晚时间',
          dataIndex: 'endTime',
          width: 80,
        }, {
          title: '打卡时间',
          dataIndex: 'Record',

          render: (e, _d) => {
            return <div style={{width:200 }}className="rygl-bm-operation">
              {_d.Record.toString()}
            </div>
          },
        //   render: (record, text) =>{
        //     let snArray=[];
        //     snArray=text.Record;

        //     let br=<br></br>;
        //     let result=null;
        //     if(snArray.length<5){
        //         return text.Record.toString();
        //     }

        //     for(let i=0;i<snArray.length;i++){
        //         if(i==0){
        //             result=snArray[i];
        //         }else{
        //             result=<span>{result}{br}{snArray[i]}</span>;
        //         }
        //     }
        //     return <div>{result}</div>;
        // }

        }
      ],
      leftDatalist: [],
    }

  }

  componentDidMount() {
    var d = new Date();
    d.setMonth(d.getMonth() - 1);
    d.setHours(0);
    d.setMinutes(0);
    d.setSeconds(0);

    // const datalist = [];sec min hour millisec
    // for (let i = 0; i < 100; i++) {
    //   datalist.push({
    //     key: i + 1,
    //     perId: `编号 ${i + 1}`,
    //     perName: '姓名' + `小${i + 1}`,
    //     departmentName: 'A' + i + 1 + '部门',
    //     entryDate: '2019-3-11 13:20:12'

    //   });
    // }
    this.setState({ startTime: d }, () => {
      this.selectReportForm(1, this.state.pagination.pageSize);
    });
    this.getDepartment();
    // this.selectReportForm(1, this.state.pagination.pageSize);
  }

  selectReportForm = (current, pageSize, departmentId, text) => {

    let startTime = this.state.startTime ? (new Date(this.state.startTime)).Format("yyyy-MM-dd hh:mm:ss") : this.state.startTime;
    let endTime = this.state.endTime ? (new Date(this.state.endTime)).Format("yyyy-MM-dd hh:mm:ss") : this.state.endTime;
    Util._httpPost("/project_war_exploded/reportForm/selectReportForm.do", JSON.stringify({
      startTime: startTime,
      endTime: endTime,
      departmentId: departmentId,
      page: current,
      size: pageSize,
      name: this.state.userName
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
  //更新数据
  toUpdate = () => {
    setTimeout(() => {
      this.setState({
        newlyPopup: { switch: false }
      })
    }, 0)

    this.selectReportForm(1, this.state.pagination.pageSize,undefined, "刷新成功");
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
    })
  }

  //导出打卡数据
  onAClick = () => {

    let a = document.createElement('a');
    a.target = "_blank";
    a.href = Util.htmlPreposition +
    "/project_war_exploded/reportForm/export.do?startTime=" +
    (this.state.startTime ? (new Date(this.state.startTime)).Format("yyyy-MM-dd") : this.state.startTime) + 
    '&endTime=' + 
    (this.state.endTime ? (new Date(this.state.endTime)).Format("yyyy-MM-dd") : this.state.endTime);
    a.click();
  }
  

  //拉取设备打卡数据
  updateReportForm = () => {
    Util._httpPost("/project_war_exploded/reportForm/updateReportForm.do", JSON.stringify({
    })).then((params) => {

      if (params.data.flag) {
        this.selectReportForm(1, this.state.pagination.pageSize);
        message.success(params.data.message)
      } else {
        message.error(params.data.message)
      }

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

  render() {

    return (
      <div className="tjbb-rdkxqb">
        <Header style={{ background: '#fff', padding: 0 }} >
          <div className="query_condition">
            <div>
              时间 从
              <DatePicker format="YYYY-MM-DD HH:mm:ss" value={this.state.startTime ? moment(this.state.startTime, "YYYY-MM-DD HH:mm:ss") : this.state.startTime} onChange={(value) => {
                this.setState({
                  startTime: value
                })
              }} placeholder="开始时间" showTime />
            </div>
            <div>
              到
              <DatePicker format="YYYY-MM-DD HH:mm:ss" value={this.state.endTime ? moment(this.state.endTime, "YYYY-MM-DD HH:mm:ss") : this.state.endTime} onChange={(value) => {
                this.setState({
                  endTime: value
                })
              }} placeholder="结束时间" showTime />
            </div>
            <div>
              人员名称<Input value={this.state.userName} onChange={(e) => this.setState({ userName: e.target.value })} />
            </div>
            <div>
              <Button onClick={() => this.selectReportForm(1, this.state.pagination.pageSize)} icon="search">搜索</Button>
            </div>
            <div>
              <Button onClick={() => this.updateReportForm()}>拉取设备打卡数据</Button>
            </div>

            <div>
              <Button onClick={this.onAClick}>
                导出
              </Button>
            </div>
            
          </div>
        </Header>
        <div className="tjbb-rdkxqb-data">
          <div className="tjbb-rdkxqb-data-datatree">
            <DataTree ongetfindAllByDepartment={(_d) => this.selectReportForm(1, this.state.pagination.pageSize, _d.id)} {...this.state} />
          </div>

          <div className="tjbb-rdkxqb-data-datatable">
            <DataTable scroll={{ x: 1300 }} onGetData={this.selectReportForm} onNewlyPopup={this.newlyPopup} {...this.state} />
          </div>
          {
            //弹出框
            this.state.newlyPopup.switch ?
              this.state.newlyPopup.title === "刷新" ?
                this.toUpdate()
                : ""
              : ""
          }
        </div>
      </div>
    );
  }
}

export default TjbbRdkxqb;
