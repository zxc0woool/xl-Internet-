

import React, { Component } from 'react';
import DataTree from '../../controls/data.tree';
import DataTable from '../../controls/data.table';
import ElasticFrame from '../../controls/elastic.frame';
import { Select, DatePicker } from 'antd';
import moment from 'moment';
import Util from '../../../uilt/http.utils';
import $ from '../../../js/calendar/index';

import './index.css';
const Option = Select.Option;
class BcglBmpb extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: '',
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
      addDataColumns: [
        {
          title: '班次类型',
          dataIndex: 'perId',
          width: 100,
        }, {
          title: '编号',
          dataIndex: 'perName',
          width: 100,
        }, {
          title: '名称',
          dataIndex: 'departmentName',
          width: 100,
        }
      ],
      dataColumns: [
        {
          title: '部门编号',
          dataIndex: 'perId',
          width: 100,
        }, {
          title: '部门名称',
          dataIndex: 'perName',
          width: 100,
        }, {
          title: '排班类型',
          dataIndex: 'departmentName',
          width: 100,
        }, {
          title: '班次名称',
          dataIndex: 'entryDate',
          width: 100,
        }, {
          title: '开始时间',
          dataIndex: 'entryDate1',
          width: 100,
        }, , {
          title: '结束时间',
          dataIndex: 'entryDate2',
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

    const datalist = [];
    for (let i = 0; i < 100; i++) {
      datalist.push({
        key: i + 1,
        perId: `编号 ${i + 1}`,
        perName: '姓名' + `小${i + 1}`,
        departmentName: 'A' + i + 1 + '部门',
        entryDate: '2019-3-11 13:20:12'

      });
    }
    this.setState({ datalist });
    var data = [
      { startDate: "2018-6-10", name: "事件1" },
      { startDate: "2018-7-10", name: "事件1" },
      { startDate: "2018-8-10", name: "事件1" },
      { startDate: "2018-9-10", name: "事件1" },
      { startDate: "2018-10-10", name: "事件1" },
      { startDate: "2018-11-1", name: "事件2" },
      { startDate: "2018-11-1", name: "事件11" },
      { startDate: "2018-12-1", name: "事件12" },
      { startDate: "2018-12-1", name: "事件13" },
      { startDate: "2018-12-1", name: "事14" },
      { startDate: "2019-1-10", name: "事件14" },
      { startDate: "2019-2-10", name: "事件14" },
      { startDate: "2019-3-10", name: "事件14" },
      { startDate: "2019-4-10", name: "事件14" },
      { startDate: "2019-5-10", name: "事件14" },
      { startDate: "2019-6-10", name: "事件14" },
      { startDate: "2019-7-10", name: "事件14" },
      { startDate: "2019-8-10", name: "事件14" },
      { startDate: "2019-9-10", name: "事件14" },
      { startDate: "2019-10-10", name: "事件14" },
      { startDate: "2019-11-10", name: "事件14" },
      { startDate: "2019-12-10", name: "事件14" },
      { startDate: "2020-1-10", name: "事件14" },
      { startDate: "2020-2-10", name: "事件14" },
    ]

    $(".calendar").calendar({
      data: data,
      mode: "month",
      //  maxEvent: 2,
      showModeBtn: false,
      //  newDate: "2018-04-1",
      cellClick: function (events) {
        //viewCell的事件列表
      },
    })
    this.getDepartment();
  }
  newlyPopup = (e, title) => {

    this.setState({
      newlyPopup: {
        title: title,
        switch: true,
      }
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
      <div className="bcgl_bmpb">
        <div className="bcgl_bmpb-data">
          <div className="bcgl_bmpb-data-datatree">
            <DataTree  {...this.state} />
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
                    close={() => {
                      this.setState({
                        newlyPopup: { switch: false }
                      })
                    }}
                    renderDom={(props) => {
                      let title = this.state.newlyPopup.title
                      let schedulingType = [
                        {value:"0",name:'普通排班'},
                        {value:"1",name:'智能排班'}
                      ];
                      if(title === "新增临时排班"){
                        schedulingType=[{value:"0",name:'普通排班'}];
                      }
                      return (
                        <div className="bcgl-pc_newly_added">
                          <div className="bcgl_bmpb-data-datatree">
                            <DataTree style={{ height: 460 }}  {...this.state} />
                          </div>
                          <table className="tableStyle">
                            <tbody>
                              <tr>
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
                                      schedulingType.map((_d,key)=>{
                                        return <Option key={key} value={_d.value}>{_d.name}</Option>
                                      })
                                    }

                                  </Select>
                                </td>

                              </tr>
                              <tr>
                                <th>
                                  <label>开始时间</label><span className="required">*</span>
                                </th>
                                <td>
                                  <DatePicker value={this.state.data.birthDate ? moment(this.state.data.birthDate) : this.state.data.birthDate} onChange={(value) => this.setState({
                                    data: { ...this.state.data, birthDate: value }
                                  })} placeholder="开始时间" />
                                </td>
                              </tr>
                              <tr>
                                <th>
                                  <label>结束时间</label>{title === "新增临时排班"?<span className="required">*</span>:''}
                                </th>
                                <td>
                                  <DatePicker value={this.state.data.birthDate ? moment(this.state.data.birthDate) : this.state.data.birthDate} onChange={(value) => this.setState({
                                    data: { ...this.state.data, birthDate: value }
                                  })} placeholder="结束时间" />
                                </td>
                              </tr>
                            </tbody>
                          </table>
                          <DataTable
                            style={{ height: 350, width: 620, float: 'left', marginTop: 64 }}
                            scroll={{ y: 315 }}
                            closeTitle={true}
                            closePagination={true}
                            onNewlyPopup={() => {}}
                            {...this.state}
                            dataColumns={this.state.addDataColumns}
                            titlelist={[]}
                          />
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
      </div>
    );
  }
}

export default BcglBmpb;
