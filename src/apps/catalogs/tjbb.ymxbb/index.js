

import React, { Component } from 'react';
import DataTree from '../../controls/data.tree';
import DataTable from '../../controls/data.table';
import Util from '../../../uilt/http.utils';
import { Input, Select, DatePicker, Checkbox, Row, Col, message, Button, Layout, Switch } from 'antd';
import './index.css';
import moment from 'moment';

const { Header } = Layout;
let memoryDepartmentId = "1";
class TjbbYmxbb extends Component {

  constructor(props) {
    super(props);
    this.state = {
      localValue: '',
      startTime: new Date().Format('yyyy-MM'),
      perId: "",
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
          // width: 100,
          render: text => <div style="width: 100px">{text}+++</div>,
        }, {
          title: '姓名',
          dataIndex: 'perName',
          render: text => <div style="width: 100px">{text}+++</div>,
        }, {
          title: '部门编号',
          dataIndex: 'departmentId',
          width: 100,
        }, {
          title: '部门名称',
          dataIndex: 'departName',
          width: 100,
        }
      ],
      leftDatalist: [],

    }

  }

  componentDidMount() {

    this.maxValue(this.state.startTime);
    let I = setInterval(() => {
      if (this.state.leftDatalist[0]) {
        this.monthlyDetailedReport(1, this.state.pagination.pageSize, this.state.perId, this.state.leftDatalist[0].id, this.state.startTime)
        clearInterval(I);
      }
    }, 0)

    this.getDepartment();
  }

  maxValue = (dateval) => {

    function getWeek(dateString) {

      var dateArray = dateString.split("-");
      var date = new Date(dateArray[0], parseInt(dateArray[1] - 1), dateArray[2]);

      return "日一二三四五六".charAt(date.getDay());
    };
    let datatest = {
      '1':'√',
      '2':'◑',
      '3':'◐',
      '4':'△',
      '5':'×',
      '6':'☒'
    }
    let dataColumns = [
      {
        title: '人员编号',
        dataIndex: 'perId',
        render: text => {
          return <div style={{wordWrap: 'break-word', wordBreak: 'break-all', width: 60 }}>{text}</div>
        },
      }, {
        title: '姓名',
        dataIndex: 'perName',
        width: 100,
        render: text => {
          return <div style={{ width: 60 }}>{text}</div>
        },
      }, {
        title: '部门编号',
        dataIndex: 'departmentId',
        width: 100,
        render: text => {
          return <div style={{ width: 60 }}>{text}</div>
        },
      }, {
        title: '部门名称',
        dataIndex: 'departName',
        width: 100,
        render: text => {
          return <div style={{ width: 60 }}>{text}</div>
        },
      }
    ];
    let _d = new Date(dateval);

    let year = _d.getFullYear();;
    let month = _d.getMonth() + 1;
    let date = new Date(year, month, 1);
    let lastday = new Date(date.getTime() - 1000 * 60 * 60 * 24).getDate();

    let datelist = []
    for (let i = 0; i <= lastday - 1; i++) {
      datelist.push(
        { lastday: i + 1, week: getWeek(year + "-" + month + "-" + (i + 1)) }
      )
    }

    datelist.map((_d) => {
      dataColumns.push({
        title: () => {
          return <div>{_d.lastday}<br />{_d.week}</div>
        },
        dataIndex: new Date(this.state.startTime).Format('yyyy-MM') + '-' + (_d.lastday < 10 ? '0' + _d.lastday : _d.lastday),
        // width: 20,
        render: text => {
          return <div style={{ width: 20 }}>{datatest[text]}</div>
        },
      })
    })

    if (this.state.leftDatalist[0]) {
      this.monthlyDetailedReport(1, this.state.pagination.pageSize, this.state.perId, this.state.leftDatalist[0].id, this.state.startTime)

    }

    this.setState({ dataColumns })
  }

  /**
   * @current 当前页数
   * @pageSize 显示几条一页
   * @perId 人员id
   * @departmentId 部门id
   * @text
   */
  monthlyDetailedReport = (current, pageSize, perId, departmentId, startTime, text) => {
    memoryDepartmentId = departmentId;
    Util._httpPost("/project_war_exploded/reportForm/monthlyDetailedReport.do", JSON.stringify({
      page: current,
      size: pageSize,
      month: new Date(startTime).Format('yyyy-MM'),
      perId: perId,
      departmentId: departmentId
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
        message.success(text, 0.5)
      }

    }).catch((error) => {

    })

  }

  //更新数据
  toUpdate = () => {
    setTimeout(() => {
      if(this.state.newlyPopup.switch){
        this.monthlyDetailedReport(1, this.state.pagination.pageSize, this.state.perId, memoryDepartmentId, this.state.startTime,'刷新成功')
      }
      this.setState({
        newlyPopup: { switch: false }
      })
    }, 0)
  
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
      <div className="tjbb-ymxbb">
        <Header style={{ background: '#fff', padding: 0 }} >
          <div className="query_condition">
            <div>
              <DatePicker format="YYYY-MM" value={this.state.startTime ? moment(this.state.startTime, "YYYY-MM") : this.state.startTime} onChange={(value) => {
                this.setState({
                  startTime: value
                })
              }} />
            </div>

            <div>
              人员编号<Input value={this.state.perId} onChange={(e) => this.setState({ perId: e.target.value })} />
            </div>
            <div>
              <Button onClick={() => { this.maxValue(this.state.startTime) }} icon="search">搜索</Button>
            </div>
            <span style={{float:'right',color: '#693be6'}}>正常: √ 迟到: ◑ 早退: ◐ 休息: △ 旷工: × 上班或下班未打卡: ☒</span>
          </div>
        </Header>
        <div className="tjbb-ymxbb-data">
          <div className="tjbb-ymxbb-data-datatree">
            <DataTree ongetfindAllByDepartment={(_d) => this.monthlyDetailedReport(1, this.state.pagination.pageSize, this.state.perId, _d.id, this.state.startTime)} {...this.state} />
          </div>

          <div className="tjbb-ymxbb-data-datatable">
            <DataTable scroll={{ x: '120%' }} onNewlyPopup={() => { }} {...this.state} />
          </div>
        </div>
        {
          this.state.newlyPopup.title === "刷新" ?
          this.toUpdate()
          : ""
        }
      </div>
    );
  }
}

export default TjbbYmxbb;
