

import React, { Component } from 'react';
import { Select, Input, TreeSelect, Layout, Button, message, DatePicker } from 'antd';
import DataTree from '../../controls/data.tree';
import DataTable from '../../controls/data.table';
import Information from '../../controls/information';
import ElasticFrame from '../../controls/elastic.frame';
import EquipmentPersonnelManagement from '../../controls/equipment.personnel.management';
import './index.css';
import Util from '../../../uilt/http.utils';
const TreeNode = TreeSelect.TreeNode;
const Option = Select.Option;
const { TextArea } = Input;
const { Header } = Layout;

let personnel = {};
let titleTextUserId = "";
class RyglRy extends Component {

  constructor(props) {
    super(props);
    this.state = {
      localValue: '',
      data: {},
      testName:"",
      userName: "",
      titleText: "",
      pagination: {
        total: 0,  //数据总数量
        pageSize: 50, //显示几条一页
      },
      newlyPopup: {
        title: "",
        switch: true,
      },
      titlelist: [
        { name: '刷新', icon: 'redo' },
        { name: '新增', icon: 'file-add', idType:'6' },
        // { name: '离职', icon: 'user-delete' },
        // { name: '部门调整', icon: 'contacts' },
        { name: '设备人员管理', icon: 'audit' },
        // { name: '删除', icon: 'close' }
      ],
      datalist: [],
      dataColumns: [
        {
          title: '人员编号',
          dataIndex: 'perId',
          width: 160,
        }, {
          title: '姓名',
          dataIndex: 'perName',
          width: 150,
        }, {
          title: '部门名称',
          dataIndex: 'departName',
          width: 150,
        }, {
          title: '入职时间',
          dataIndex: 'entryDate',
          width: 160,
        }, {
          title: '操作',
          dataIndex: 'operation',
          key: 'operation',
          width: 280,
          render: (e, _d) => {
            return <div className="rygl-bm-operation">
              <a onClick={() => this.newlyPopup(_d, '编辑')}>编辑</a>
              <a onClick={() => this.newlyPopup(_d, '离职')}>离职</a>   
              <a onClick={() => this.newlyPopup(_d, '部门调整')}>部门调整</a>    
              <a onClick={() => this.newlyPopup(_d, '职位调整')}>职位调整</a>
              {/* <a onClick={() => this.newlyPopup(_d, '删除')}>删除</a> */}
            </div>
          },
        }
      ],
      selectedRows:[],
      leftDatalist: [],
      positionDatalist: [],
      departmentDatalist: [],
      
    }
  }

  

  componentDidMount() {

    this.getDepartment();
    this.getPosition();
    this.onGetData(1, this.state.pagination.pageSize);

  }

  //更新数据
  toUpdate = () => {
    setTimeout(()=>{
      this.setState({
        newlyPopup: { switch: false }
      })
    },0)
  
    this.onGetData(1, this.state.pagination.pageSize,"刷新成功");
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
  onGetData = (current, pageSize,text) => {

    Util._httpPost("/project_war_exploded/person/findPage.do", JSON.stringify({
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
      if(text){
        message.success(text,0.5)
      }
    
    }).catch((error) => {

    })

  }

  //人員添加
  addPerson = (_data, op) => {

    if (op) {
      _data.birthDate = _data.birthDate?(new Date(_data.birthDate)).Format("yyyy-MM-dd"):_data.birthDate;
      _data.entryDate = _data.entryDate?(new Date(_data.entryDate)).Format("yyyy-MM-dd"):_data.entryDate;
      //project_war_exploded/person/addPerson.do
      Util._httpPost("/project_war_exploded/person/addPerson.do", {
        ..._data
      }).then((params) => {
        this.onGetData(1, this.state.pagination.pageSize);
        message.success(params.data.message)
      }).catch((error) => {

      })
    }

  }
  //人員编辑
  setPerson = (_data, op) => {

    if (op) {
      _data.birthDate = _data.birthDate?(new Date(_data.birthDate)).Format("yyyy-MM-dd"):_data.birthDate;
      _data.entryDate = _data.entryDate?(new Date(_data.entryDate)).Format("yyyy-MM-dd"):_data.entryDate;
      //project_war_exploded/person/addPerson.do
      Util._httpPost("/project_war_exploded/person/updatePerson.do", {
        ..._data
      }).then((params) => {
        this.onGetData(1, this.state.pagination.pageSize);
        message.success(params.data.message)
      }).catch((error) => {

      })
    }

  }
  //人員删除
  deletePerson = (ids) => {
      //project_war_exploded/person/addPerson.do
      for(let key in this.state.selectedRows){
        if(ids == ""){
          ids += this.state.selectedRows[key].id
        }else{
          ids += ',' + this.state.selectedRows[key].id
        }
        
      }
      
      Util._httpPost("/project_war_exploded/person/deletePerson.do", {
        ids:ids
      }).then((params) => {
        this.onGetData(1, this.state.pagination.pageSize);
        message.success(params.data.message)
      }).catch((error) => {

      })

  } 
  //人員离职
  quitPerson = (_data) => {
      _data.quitDate = _data.quitDate?(new Date(_data.quitDate)).Format("yyyy-MM-dd"):_data.quitDate;
      Util._httpPost("/project_war_exploded/person/quitPerson.do", {
        perId:_data.perId,
        quitDate:_data.quitDate,
        quitType:_data.quitType,
        quitText:_data.quitText
      }).then((params) => {
        this.onGetData(1, this.state.pagination.pageSize);
    
        message.success(params.data.message)
        
        
      }).catch((error) => {

      })

  }
  onWillUnmount = (_data, titleText) => {

    this.setState({
      titleText
    })
    personnel = _data;

  }

  onTreeNodeChange = (localValue) => {

    this.setState({ localValue });
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
        leftDatalist: params.data.rows,
        departmentDatalist:params.data.rows
      })
    }).catch((error) => {

    })
  }
  //部门调整
  adjustPersonByDepartment = (_data) => {

    Util._httpPost("/project_war_exploded/person/adjustPersonByDepartment.do", JSON.stringify({
      perId:_data.perId,
      departmentId: _data.departmentId,
      transferText:_data.transferText
    })).then((params) => {
      this.onGetData(1, this.state.pagination.pageSize);
      message.success(params.data.message)
        
    }).catch((error) => {

    })
  }
  //职位调整
  adjustPersonByPosition = (_data) => {

    Util._httpPost("/project_war_exploded/person/adjustPersonByPosition.do", JSON.stringify({
      perId:_data.perId,
      positionId: _data.positionId,
      positionText:_data.positionText
    })).then((params) => {
      this.onGetData(1, this.state.pagination.pageSize);
      message.success(params.data.message)
        
    }).catch((error) => {

    })
  }
  setSelectedRows = (selectedRows) => {
    this.setState({ selectedRows })
  }
  //通过部门查询人员
  getfindAllByDepartment = (_d) => {
    Util._httpPost("/project_war_exploded/person/findAllByDepartment.do", JSON.stringify({
      departId: parseInt(_d.id),
      page: 1,
      size: this.state.pagination.pageSize
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
          pageSize: this.state.pagination.pageSize, //显示几条一页
        }
      })
    }).catch((error) => {

    })
  }

// START 设备人员管理

//部门调整
  // adjustPersonByDepartment = (_data) => {

  //   Util._httpPost("http://设备 IP:8090/person/create ", JSON.stringify({
  //     perId:_data.perId,
  //     departmentId: _data.departmentId,
  //     transferText:_data.transferText
  //   })).then((params) => {
  //     this.onGetData(1, this.state.pagination.pageSize);
  //     message.success(params.data.message)
        
  //   }).catch((error) => {

  //   })
  // }



// END  设备人员管理



  render() {

    return (
      <div className="rygl-ry">
        <Header style={{ background: '#fff', padding: 0 }} >
          <div className="query_condition">
            <div>
              姓名：<Input value={this.state.userName} onChange={(e) => this.setState({ userName: e.target.value })} />
            </div>
            <div>
              <Button onClick={() => this.onGetData(1, this.state.pagination.pageSize)} icon="search">搜索</Button>
            </div>
          </div>
        </Header>

        <div className="rygl-ry-data">

          <div className="rygl-ry-data-datatree">
            <DataTree ongetfindAllByDepartment={this.getfindAllByDepartment} {...this.state} />
          </div>

          <div className="rygl-ry-data-datatable">
            <DataTable setSelectedRows={this.setSelectedRows}  onGetData={this.onGetData} onNewlyPopup={this.newlyPopup} {...this.state} />

            {
              //弹出框
              this.state.newlyPopup.switch ?
                this.state.newlyPopup.title === "新增" || this.state.newlyPopup.title === "编辑" ?
                  <ElasticFrame
                    style={{ width: 900, height: 480 }}
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
                        if(title == "新增"){
                          if (personnel) {
                            this.addPerson(personnel, true)
                          } else {
                            this.newlyPopup(personnel, title)
                          }
                        }else if(title == "编辑"){
                          if (personnel) {
                            this.setPerson(personnel, true)
                          } else {
                            this.newlyPopup(personnel, title)
                          }
                        }
                       

                      })
                      // this.addPerson()
                    }}
                    renderDom={(props) => {
                      return <Information
                      departmentDatalist={this.state.departmentDatalist} 
                      positionDatalist={this.state.positionDatalist} 
                      onWillUnmount={this.onWillUnmount} 
                      newlyPopup={this.newlyPopup}
                      data={this.state.data} 
                      toUserID={this.state.newlyPopup.title === "编辑"}
                      {...props} 
                      {...this.props} 
                      />
                    }}
                  /> :
                  this.state.newlyPopup.title === "离职" ?
                    <ElasticFrame
                      style={{ width: 500, height: 270 }}
                      title={'填写离职信息:' + this.state.data.perName}
                      titleText={this.state.titleText}
                      onWillUnmount={this.onWillUnmount} 
                      close={() => {
                        this.setState({
                          newlyPopup: { switch: false }
                        })
                      }}
                      ok={()=>{
                        let title = this.state.newlyPopup.title;
                        this.setState({
                          newlyPopup: { switch: false }
                        }, () => {

                          if (this.state.data.quitDate && this.state.data.quitDate !== "" && this.state.data.quitType && this.state.data.quitType !== "") {
                            this.quitPerson(this.state.data);
                          } else {
                            this.setState({
                              titleText:'带 * 不得为空！'
                            });
                            message.info("带 * 不得为空！")
                            this.newlyPopup(this.state.data, title)
                          }

                        })
                      

                      }}
                      renderDom={(props) => {
                        return (
                          <div className="content_div">
                            <table className="tableStyle">
                              <tbody><tr>
                                <th><label>离职日期</label><span className="required">*</span></th>
                                <td>
                                  <DatePicker format="YYYY-MM-DD" value={this.state.data.quitDate} onChange={(value) => {this.setState({
                                    data: { ...this.state.data, quitDate: value }
                                  })}} placeholder="离职日期" />
                                </td>
                              </tr>
                                <tr>
                                  <th><label>离职类型</label><span className="required">*</span></th>
                                  <td>
                                    <Select value={this.state.data.quitType} onChange={(value) => this.setState({ data:{
                                      ...this.state.data,
                                      quitType:value
                                    }})} >
                                      <Option value='1'>自离</Option>
                                      <Option value='2'>辞职</Option>
                                      <Option value='3'>辞退</Option>
                                      <Option value='4'>调离</Option>
                                    </Select>
                                  </td>
                                </tr>
                                <tr>
                                  <th><label>离职原因</label></th>
                                  <td>
                                    <TextArea value={this.state.data.quitText} onChange={(e) => {this.setState({ data:{
                                      ...this.state.data,
                                      quitText:e.target.value
                                    }})}}  style={{ width: 250, minHeight: 90 }}>
                                    </TextArea>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        )
                      }}
                    /> : this.state.newlyPopup.title === "部门调整" ?
                      <ElasticFrame
                        style={{ width: 500, height: 270 }}
                        title={this.state.newlyPopup.title}
                        titleText={this.state.titleText}
                        onWillUnmount={this.onWillUnmount}
                        close={() => {
                          this.setState({
                            newlyPopup: { switch: false }
                          })
                        }}
                        ok={() => {
                          let title = this.state.newlyPopup.title;
                          this.setState({
                            newlyPopup: { switch: false }
                          }, () => {

                            if (this.state.data.departmentId && this.state.data.departmentId !== "") {
                              this.adjustPersonByDepartment(this.state.data);
                            } else {
                              this.setState({
                                titleText:'带 * 不得为空！'
                              });
                              message.info("带 * 不得为空！")
                              this.newlyPopup(this.state.data, title)
                            }
  
                          })
                        }}
                        renderDom={(props) => {
                          return (
                            <div className="">
                              <table className="tableStyle">
                                <tbody><tr>
                                  <th><label>选择人员</label></th>
                                  <td>
                                    {/* <TextArea readOnly defaultValue={'52216621'} style={{ width: 250, minHeight: 45 }}>

                                    </TextArea> */}
                                    {
                                      this.state.data.perName
                                    }
                                  </td>
                                </tr>
                                  <tr>
                                    <th><label>调动到的部门</label><span className="required">*</span></th>
                                    <td>
                                      <TreeSelect
                                        showSearch
                                        style={{ width: 300 }}
                                        value={this.state.data.departmentId}
                                        dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
                                        placeholder="调动到的部门"
                                        allowClear
                                        treeDefaultExpandAll
                                        onChange={(value) => this.setState({ data:{
                                          ...this.state.data,
                                          departmentId:value
                                        }})}
                                      >
                                        {
                                          this.TreeNode(this.state.departmentDatalist)
                                        }
                                      </TreeSelect>
                                    </td>
                                  </tr>
                                  <tr>
                                    <th><label>调动原因</label></th>
                                    <td>
                                      <TextArea value={this.state.data.transferText} onChange={(e) => this.setState({ data:{
                                            ...this.state.data,
                                            transferText:e.target.value
                                          }})} style={{ width: 250, minHeight: 90 }}>
                                      </TextArea>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>


                            </div>
                          )
                        }}
                      /> : this.state.newlyPopup.title === "职位调整" ?
                        <ElasticFrame
                          style={{ width: 500, height: 270 }}
                          title={this.state.newlyPopup.title}
                          close={() => {
                            this.setState({
                              newlyPopup: { switch: false }
                            })
                          }}
                          titleText={this.state.titleText}
                        onWillUnmount={this.onWillUnmount}
                        close={() => {
                          this.setState({
                            newlyPopup: { switch: false }
                          })
                        }}
                        ok={() => {
                          let title = this.state.newlyPopup.title;
                          this.setState({
                            newlyPopup: { switch: false }
                          }, () => {

                            if (this.state.data.positionId && this.state.data.positionId !== "") {
                              this.adjustPersonByPosition(this.state.data);
                            } else {
                              this.setState({
                                titleText:'带 * 不得为空！'
                              });
                              message.info("带 * 不得为空！")
                              this.newlyPopup(this.state.data, title)
                            }
  
                          })
                        }}
                          renderDom={(props) => {
                            return (
                              <div className="">
                                <table className="tableStyle">
                                  <tbody><tr>
                                    <th><label>选择人员</label></th>
                                    <td>
                                      {
                                        this.state.data.perName
                                      }
                                    </td>
                                  </tr>
                                    <tr>
                                      <th><label>调动到的职位</label><span className="required">*</span></th>
                                      <td>
                                        <TreeSelect
                                          showSearch
                                          style={{ width: 300 }}
                                          value={this.state.data.positionId}
                                          dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
                                          placeholder="调动到的职位"
                                          allowClear
                                          treeDefaultExpandAll
                                          onChange={(value) => this.setState({ data:{
                                            ...this.state.data,
                                            positionId:value
                                          }})}
                                        >
                                          {
                                            this.TreeNode(this.state.positionDatalist)
                                          }
                                        </TreeSelect>
                                      </td>
                                    </tr>
                                    <tr>
                                      <th><label>调动原因</label></th>
                                      <td>
                                        <TextArea value={this.state.data.positionText} onChange={(e) => this.setState({ data:{
                                            ...this.state.data,
                                            positionText:e.target.value
                                          }})} style={{ width: 250, minHeight: 90 }}>
                                        </TextArea>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
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
                                this.deletePerson(this.state.data.id);
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
                            : this.state.newlyPopup.title === "设备人员管理" ?
                            <ElasticFrame
                              style={{ width: 1250, height: 670 }}
                              title={this.state.newlyPopup.title}
                              // titleText={this.state.titleText}
                              close={() => {
                                this.setState({
                                  newlyPopup: { switch: false }
                                })
                              }}
                              ok={() => {
                                  // this.deletePerson(this.state.data.id);
                                  this.setState({
                                    newlyPopup: { switch: false }
                                  })
                                }}
                              renderDom={(props) => {
                                return (
                                 <div>
                                   <EquipmentPersonnelManagement />
                                 </div>
                                )
                              }}
                            /> :''
                :
                ""
            }
          </div>
        </div>


      </div>
    );
  }
}

export default RyglRy;