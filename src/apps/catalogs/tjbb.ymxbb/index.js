

import React, { Component } from 'react';
import DataTree from '../../controls/data.tree';
import DataTable from '../../controls/data.table';
import Util from '../../../uilt/http.utils';
import { Input, Select, DatePicker, Checkbox, Row, Col, message, Button, Layout, Switch } from 'antd';
import './index.css';
import moment from 'moment';

const { Header } = Layout;
class TjbbYmxbb extends Component {



  constructor(props) {
    super(props);
    this.state = {
      localValue: '',
      startTime: moment(new Date(), "YYYY-MM"),
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
          width: 100,
        }, {
          title: '姓名',
          dataIndex: 'perName',
          width: 100,
        }, {
          title: '部门编号',
          dataIndex: 'departmentName',
          width: 100,
        }, {
          title: '部门名称',
          dataIndex: 'entryDate',
          width: 100,
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
 
    this.maxValue(this.state.startTime);

    this.getDepartment();
  }

  maxValue = (dateval) => {

    function getWeek(dateString) {

      var dateArray = dateString.split("-");
      var date = new Date(dateArray[0], parseInt(dateArray[1] - 1), dateArray[2]);

      return "日一二三四五六".charAt(date.getDay());
    };
    let dataColumns = [
      {
        title: '人员编号',
        dataIndex: 'perId',
        width: 100,
      }, {
        title: '姓名',
        dataIndex: 'perName',
        width: 100,
      }, {
        title: '部门编号',
        dataIndex: 'departmentName',
        width: 100,
      }, {
        title: '部门名称',
        dataIndex: 'entryDate',
        width: 100,
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
        dataIndex: 'date' + _d.lastday,
        width: 20,
      })
    })
    this.setState({dataColumns})
  }


  monthlyDetailedReport = (current, pageSize, departmentId, text) => {

    Util._httpPost("/project_war_exploded/reportForm/monthlyDetailedReport.do", JSON.stringify({

      departmentId: departmentId,
      page: current,
      size: pageSize,
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
              人员名称<Input value={this.state.userName} onChange={(e) => this.setState({ userName: e.target.value })} />
            </div>
            <div>
              <Button onClick={() => {this.maxValue(this.state.startTime)}} icon="search">搜索</Button>
            </div>
          </div>
        </Header>
        <div className="tjbb-ymxbb-data">
          <div className="tjbb-ymxbb-data-datatree">
            <DataTree {...this.state} />
          </div>

          <div className="tjbb-ymxbb-data-datatable">
            <DataTable onNewlyPopup={() => { }} {...this.state} />
          </div>
        </div>

      </div>
    );
  }
}

export default TjbbYmxbb;
