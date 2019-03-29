

import React, { Component } from 'react';
import DataTree from '../../controls/data.tree';
import DataTable from '../../controls/data.table';
import ElasticFrame from '../../controls/elastic.frame';
import { Input, Select, DatePicker } from 'antd';
import Util from '../../../uilt/http.utils';
import $ from '../../../js/calendar/index';

import moment from 'moment';
import './index.css';
const Option = Select.Option;
class BcglRypb extends Component {

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
        { name: '新增临时排班', icon: 'file-add' },
      ],
      datalist: [],
      dataColumns: [
        {
          title: '班次类型',
          dataIndex: 'perId',
          width: 100,
        }, {
          title: '编号',
          dataIndex: 'perName',
          width: 100,
        }, {
          title: '姓名',
          dataIndex: 'departmentName',
          width: 100,
        }
      ],
      addDataColumns: [
        {
          title: '部门名称',
          dataIndex: 'perId',
          width: 120,
        }, {
          title: '人员编号',
          dataIndex: 'perName',
          width: 120,
        }, {
          title: '姓名',
          dataIndex: 'departmentName',
          width: 80,
        }, {
          title: '性别',
          dataIndex: 'entryDate1',
          width: 50,
        }, {
          title: '卡号',
          dataIndex: 'entryDate4',
          width: 100,
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
  }
  newlyPopup = (e, title) => {

    this.setState({
      newlyPopup: {
        title: title,
        switch: true,
      }
    })
  }
  
  render() {
    return (
      <div className="bcgl_rypb">
        <div className="bcgl_rypb-data">

          <div className="bcgl_rypb-data-datatree">
            <DataTree  {...this.state} />
          </div>

          <div className="bcgl_rypb-data-datatable">
            <DataTable onNewlyPopup={this.newlyPopup} container={() => {
              return <div className="calendar">

              </div>
            }} {...this.state} />

            {
              //弹出框
              this.state.newlyPopup.switch ?
                this.state.newlyPopup.title === "新增临时排班" ?
                  <ElasticFrame
                    style={{ width: 1140, height: 600 }}
                    title={this.state.newlyPopup.title}
                    close={() => {
                      this.setState({
                        newlyPopup: { switch: false }
                      })
                    }}
                    renderDom={(props) => {

                      return (
                        <div className="bcgl_rypb_newly_added">
                          <div className="bcgl_rypb-head">
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
                                      <Option value='1'>普通排班</Option>
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
                                    <label>结束时间</label><span className="required">*</span>
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
                              style={{ height: 194, width: 540, float: 'left' }}
                              scroll={{ y: 159 }}
                              closeTitle={true}
                              closePagination={true}
                              onNewlyPopup={() => { }}
                              {...this.state}
                              dataColumns={this.state.dataColumns}
                              titlelist={[]}
                            />
                          </div>
                          <div className="bcgl-rypb-screen">
                            <div className="search-box">
                              模糊查询<Input type="text" defaultValue={''} className="valid" />
                            </div>
                            <DataTable
                              style={{ height: 265, width: 540, float: 'left' }}
                              scroll={{ y: 230 }}
                              closeTitle={true}
                              closePagination={true}
                              onNewlyPopup={() => { }}
                              {...this.state}
                              dataColumns={this.state.addDataColumns}
                              titlelist={[]}
                            />
                            <div className="bcgl-rypb-data-choice">
                              <div className="multiSelectDiv" id="gridAddAll">
                                <div className="dhxform_btn tag_dir" ><div className="dhxform_btn_txt" >&gt;&gt;</div></div>
                              </div>
                              <div className="multiSelectDiv" id="gridAddAll">
                                <div className="dhxform_btn tag_dir" ><div className="dhxform_btn_txt" >&gt;</div></div>
                              </div>
                              <div className="multiSelectDiv" id="gridAddAll">
                                <div className="dhxform_btn tag_dir" ><div className="dhxform_btn_txt" >&lt;</div></div>
                              </div>
                              <div className="multiSelectDiv" id="gridAddAll">
                                <div className="dhxform_btn tag_dir" ><div className="dhxform_btn_txt" >&lt;&lt;</div></div>
                              </div>
                            </div>
                            <DataTable
                              style={{ height: 265, width: 540, float: 'right' }}
                              scroll={{ y: 230 }}
                              closeTitle={true}
                              closePagination={true}
                              onNewlyPopup={() => { }}
                              {...this.state}
                              dataColumns={this.state.addDataColumns}
                              titlelist={[]}
                            />


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
      </div>
    );
  }
}

export default BcglRypb;
