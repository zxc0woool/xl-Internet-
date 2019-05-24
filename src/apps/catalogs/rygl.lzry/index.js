import React, { Component } from 'react';
import { Select, Input, DatePicker, message } from 'antd';
import Information from '../../controls/information';
import DataTable from '../../controls/data.table';
import Util from '../../../uilt/http.utils';
import ElasticFrame from '../../controls/elastic.frame';
import './index.css';
import moment from 'moment';
const Option = Select.Option;
const { TextArea } = Input;

let personnel = {};
class RyglLzry extends Component {
  constructor(props) {
    super(props);
    this.state = {
      testName: '',
      selectedRows: '',
      data: {},
      userName: "",
      titleText: "",

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
        { name: '删除', icon: 'close' }
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
          title: '部门',
          dataIndex: 'departName',
          width: 100,
        }, {
          title: '入职时间',
          dataIndex: 'entryDate',
          width: 160,
        }, {
          title: '离职时间',
          dataIndex: 'quitDate',
          width: 160,
        }, {
          title: '离职类型',
          dataIndex: 'quitType',
          width: 160,
        }, {
          title: '离职原因',
          dataIndex: 'quitText',
          width: 160,
        }, {
          title: '操作',
          dataIndex: 'operation',
          key: 'operation',
          width: 160,
          render: (e, _d) => {
            return (
              <div className="rygl-bm-operation">
                <a onClick={(e) => this.newlyPopup(_d, '编辑')}>编辑</a>
                <a onClick={(e) => this.newlyPopup(_d, '复职')}>复职</a>
                <a onClick={(e) => this.newlyPopup(_d, '删除')}>删除</a>
              </div>

            )

          },
        }
      ],
      positionDatalist: [],
      departmentDatalist: [],

    }
  }

  componentDidMount() {

    this.findQuitPerson(1, this.state.pagination.pageSize);
    this.getPosition();
    this.getDepartment();
  }
  componentDidCatch(){

  }
  onWillUnmount = (_data, titleText) => {
    this.setState({
      titleText
    })
    personnel = _data;

  }

  //职位查询
  findQuitPerson = (current, pageSize,text) => {
    Util._httpPost("/project_war_exploded/person/findQuitPerson.do", JSON.stringify({
      page: current,
      size: pageSize,
      name: this.state.testName
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
      if(text){
        message.success(text,0.5);
      }
    }).catch((error) => {

    })
  }
  //离职人员编辑
  updateQuitPerson = (_data) => {
    _data.quitDate = _data.quitDate?(new Date(_data.quitDate)).Format("yyyy-MM-dd"):_data.quitDate;
    //project_war_exploded/person/addPerson.do
    Util._httpPost("/project_war_exploded/person/updateQuitPerson.do", {
      ..._data
    }).then((params) => {
      this.findQuitPerson(1, this.state.pagination.pageSize);
      message.success(params.data.message)
    }).catch((error) => {

    })
  }

  //职位内容
  getPosition = () => {
    Util._httpPost("/project_war_exploded/position/selecttree.do", JSON.stringify({
    })).then((params) => {
      this.setState({
        positionDatalist: params.data.rows
      })
    }).catch((error) => {

    })
  }
  //部门内容
  getDepartment = () => {
    Util._httpPost("/project_war_exploded/department/selecttree.do", JSON.stringify({
    })).then((params) => {
      this.setState({
        departmentDatalist: params.data.rows
      })
    }).catch((error) => {

    })
  }
  //离职人员复职
  rehabQuitPerson = (_data) => {
    _data.birthDate = _data.birthDate?(new Date(_data.birthDate)).Format("yyyy-MM-dd"):_data.birthDate;
    _data.entryDate = _data.entryDate?(new Date(_data.entryDate)).Format("yyyy-MM-dd"):_data.entryDate;
    Util._httpPost("/project_war_exploded/person/rehabQuitPerson.do", JSON.stringify({
      ..._data
    })).then((params) => {
      this.findQuitPerson(1, this.state.pagination.pageSize);
      message.success(params.data.message)
    }).catch((error) => {

    })
  }
  //删除离职人员
  deleteQuitPerson = (ids) => {

    for(let key in this.state.selectedRows){
      if(ids == ""){
        ids += this.state.selectedRows[key].perId
      }else{
        ids += ',' + this.state.selectedRows[key].perId
      }
      
    }
    Util._httpPost("/project_war_exploded/person/deleteQuitPerson.do", JSON.stringify({
      ids:ids
    })).then((params) => {
      this.findQuitPerson(1, this.state.pagination.pageSize);
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

    this.findQuitPerson(1, this.state.pagination.pageSize, "刷新成功");
  }
  newlyPopup = (_d, title) => {

    this.setState({
      data: _d,
      titleText: "",
      newlyPopup: {
        title: title,
        switch: true
      }
    })
  }
  setSelectedRows = (selectedRows) => {
    this.setState({ selectedRows })
  }
  render() {

    return (
      <div className="rygl-lzry">
        <div className="rygl-lzry-data">

          <div className="rygl-lzry-data-datatable">
            <DataTable setSelectedRows={this.setSelectedRows} onGetData={this.findQuitPerson} onNewlyPopup={this.newlyPopup} {...this.state} />
          </div>
          {
            //弹出框
            this.state.newlyPopup.switch ?
              this.state.newlyPopup.title === "编辑" ?
                <ElasticFrame
                  style={{ width: 500, height: 270 }}
                  title={this.state.newlyPopup.title}
                  close={() => {
                    this.setState({
                      newlyPopup: { switch: false }
                    })
                  }}
                  titleText={this.state.titleText}
                  ok={() => {
                    this.setState({
                      newlyPopup: { switch: false }
                    }, () => {
                      this.updateQuitPerson(this.state.data, true)

                    })
                    // this.addPerson()
                  }}
                  renderDom={(props) => {
                    return (
                      <div className="rygl_bm_newly_added">

                        <div className="rygl_bm_tableStyle">

                          <div className="rygl_bm_tableStyle_div"><label>离职日期</label>

                            <DatePicker value={this.state.data.quitDate ? moment(this.state.data.quitDate) : this.state.data.quitDate} onChange={(value) => this.setState({
                              data: { ...this.state.data, quitDate: value }
                            })} placeholder="离职日期" />
                          </div>

                          <div className="rygl_bm_tableStyle_div">
                            <label>离职类型</label>
                            <Select value={this.state.data.quitType} onChange={(value) => this.setState({
                              data: { ...this.state.data, quitType: value }
                            })} id="certType">
                              <Option value='1'>自离</Option>
                              <Option value='2'>辞职</Option>
                              <Option value='3'>辞退</Option>
                              <Option value='4'>调离</Option>
                            </Select>
                          </div>

                          <div className="rygl_bm_tableStyle_div">
                            <label>离职原因</label>
                            <TextArea value={this.state.data.quitText} onChange={(e) => {
                              this.setState({
                                data: {
                                  ...this.state.data,
                                  quitText: e.target.value
                                }
                              })
                            }} style={{ width: 250, minHeight: 90 }}>
                            </TextArea>
                          </div>

                        </div>
                      </div>
                    )
                  }}
                /> : this.state.newlyPopup.title === "复职" ?
                  <ElasticFrame
                    style={{ width: 900, height: 650 }}
                    title={this.state.newlyPopup.title}
                    close={() => {
                      this.setState({
                        newlyPopup: { switch: false }
                      })
                    }}
                    titleText={this.state.titleText}
                    ok={() => {
                    this.setState({
                      newlyPopup: { switch: false }
                    }, () => {
                      if(personnel){
                        this.rehabQuitPerson(personnel)
                      }
                     

                    })
                  }}
                    renderDom={(props) => {
                      return <Information
                        departmentDatalist={this.state.departmentDatalist}
                        positionDatalist={this.state.positionDatalist}
                        onWillUnmount={this.onWillUnmount}
                        data={this.state.data}
                        toUserID={true}
                        {...props}
                        {...this.props}
                      />
                    }}
                  /> : this.state.newlyPopup.title === "删除" ?
                    <ElasticFrame
                      style={{ width: 280, height: 150 }}
                      title={"提示"}
                      close={() => {
                        this.setState({
                          newlyPopup: { switch: false },
                          selectedRows:[]
                        })
                      }}
                      titleText={this.state.titleText}
                      ok={() => {
                        this.deleteQuitPerson(this.state.data.perId);
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
                      : ''
              :
              ""
          }
        </div>


      </div>
    );
  }
}

export default RyglLzry;
