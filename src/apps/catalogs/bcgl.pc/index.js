


import React, { Component } from 'react';
import { Input, Select, DatePicker, Checkbox, Row, Col } from 'antd';
// import Information from '../../controls/information';
import DataTable from '../../controls/data.table';
import { SketchPicker } from 'react-color'
import ElasticFrame from '../../controls/elastic.frame';
import reactCSS from 'reactcss'
import moment from 'moment';
import './index.css';


const Option = Select.Option;
class BcglPc extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: '',
      timeSlotData: [],
      timeSlotDataModel: [
        {
          value: "id1",
          name: '星期一',
          data: '09:00-18:00'
        },
        {
          value: "id2",
          name: '星期二',
          data: '09:00-18:00'
        },
        {
          value: "id3",
          name: '星期三',
          data: '09:00-18:00'
        }
      ],
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
        { name: '新增', icon: 'file-add' },
        { name: '删除', icon: 'close' }
      ],
      datalist: [],
      addDatalist: [],
      addDataColumns: [
        {
          title: '名称',
          dataIndex: 'perId',
          width: 100,
        }, {
          title: '编号',
          dataIndex: 'perName',
          width: 100,
        }, {
          title: '上班时间',
          dataIndex: 'departmentName',
          width: 100,
        }, {
          title: '下班时间',
          dataIndex: 'entryDate',
          width: 100,
        }, {
          title: '记为工作日',
          dataIndex: 'entryDate1',
          width: 100,
        }
      ],
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
          title: '班次类型',
          dataIndex: 'departmentName',
          width: 100,
        }, {
          title: '单位',
          dataIndex: 'entryDate',
          width: 160,
        }, {
          title: '周期',
          dataIndex: 'entryDate1',
          width: 160,
        }, {
          title: '起始日期',
          dataIndex: 'entryDate2',
          width: 160,
        }, {
          title: '是否月内轮班',
          dataIndex: 'entryDate3',
          width: 160,
        }, {
          title: '操作',
          dataIndex: 'operation',
          key: 'operation',
          width: 160,
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


    const datalist = [];
    for (let i = 0; i < 100; i++) {
      datalist.push({
        key: 1 + i,
        perId: `赛飞`,
        perName: `S01`,
        departmentName: '规律班次',
        entryDate: `周`,
        entryDate1: '1',
        entryDate2: '2019-02-28',
        entryDate3: '是'
      });
    }
    this.setState({ datalist });

    
  }

  whole = () => {
    let timeSlotData = new Array;
    for (let key in this.state.timeSlotDataModel) {
      timeSlotData.push(this.state.timeSlotDataModel[key].value)
    }
    this.setState({ timeSlotData })
  }

  notWhole = () => {
    this.setState({ timeSlotData:[] })
  }

  newlyPopup = (e, title) => {

    this.setState({
      newlyPopup: {
        title: title,
        switch: true,
      }
    })
  }

  onTreeNodeChange = (localValue) => {
    console.log(localValue);
    this.setState({ localValue });
  }
  render() {
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

    return (
      <div className="bcgl-pc">
        <div className="bcgl-pc-data">

          <div className="bcgl-pc-data-datatable">
            <DataTable onNewlyPopup={this.newlyPopup} {...this.state} />
          </div>
          <div className="bcgl-pc-right-data-datatable">
            <div className="bcgl-pc-first-child">
              时间段明细
            </div>
            <div className="bcgl-pc-date-data-datatable">
              <span>
                <div>星期一</div>
                <div>09:00-18:00</div>
              </span>
              <span>
                <div>星期二</div>
                <div>09:00-18:00</div>
              </span>
              <span>
                <div>星期三</div>
                <div>09:00-18:00</div>
              </span>
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
                  renderDom={(props) => {
                    return (
                      <div className="bcgl-pc_newly_added">
                        <div className="bcgl-pc_tableStyle">
                          <table className="tableStyle">
                            <tbody>
                              <tr>
                                <th>
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
                                </td>
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
                                  <Input placeholder={'建议以 S 开头，如 S01'} title={'建议以 S 开头，如 S01'} type="text" defaultValue={''} className="valid" />
                                </td>
                                <th>
                                  <label>名称</label><span className="required">*</span>
                                </th>
                                <td>
                                  <Input placeholder={'建议以 S 开头或 班次 结尾'} title={'建议以 S 开头或 班次 结尾'} type="text" defaultValue={''} className="valid" />
                                </td>
                              </tr>
                              <tr>
                                <th >
                                  <label>单位</label><span className="required">*</span>
                                </th>
                                <td >
                                  <Select value={this.state.data.idType}
                                    onChange={(val) => this.setState({
                                      data: { ...this.state.data, idType: val }
                                    })}>
                                    <Option value='1'>日</Option>
                                    <Option value='2'>周</Option>
                                    <Option value='3'>月</Option>
                                  </Select>
                                </td>
                                <th>
                                  <label>周期</label><span className="required">*</span>
                                </th>
                                <td>
                                  <Input placeholder={'周期'} title={'周期'} type="text" defaultValue={''} className="valid" />
                                </td>
                              </tr>
                              <tr>
                                <th >
                                  <label>起始日期</label><span className="required">*</span>
                                </th>
                                <td>
                                  <DatePicker value={this.state.data.birthDate ? moment(this.state.data.birthDate) : this.state.data.birthDate} onChange={(value) => this.setState({
                                    data: { ...this.state.data, birthDate: value }
                                  })} placeholder="起始日期" />
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
                              </tr>
                            </tbody>
                          </table>
                        </div>


                        <DataTable
                          style={{ height: 350, width: 560, float: 'left' }}
                          scroll={{ y: 315 }}
                          closePagination={true}
                          onNewlyPopup={() => { }}
                          {...this.state}
                          dataColumns={this.state.addDataColumns}
                          titlelist={[]}
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
                              <tr>
                                <td valign="top">
                                  <Checkbox.Group
                                    value={this.state.timeSlotData}
                                    style={{ width: '100%' }}
                                    onChange={
                                      (checkedValues) => {
                                        this.setState({
                                          timeSlotData: checkedValues
                                        })
                                        console.log('checked = ', checkedValues);
                                      }
                                    }>
                                    <Row>
                                      {
                                        this.state.timeSlotDataModel.map((val, key) => {
                                          return <Col key={key} span={24}>
                                            <Checkbox value={val.value}>
                                              <span>{val.name}</span>
                                              <span style={{ float: 'right', marginLeft: 36 }}>{val.data}</span>
                                            </Checkbox>
                                          </Col>
                                        })

                                      }
                                    </Row>
                                  </Checkbox.Group>

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

export default BcglPc;
