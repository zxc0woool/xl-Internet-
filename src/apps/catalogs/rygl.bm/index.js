

import React, { Component } from 'react';
import { Input, TreeSelect, message, Button, Layout } from 'antd';
import DataTree from '../../controls/data.tree';
import DataTable from '../../controls/data.table';
import ElasticFrame from '../../controls/elastic.frame';
import Util from '../../../uilt/http.utils';
import cookie from '../../../uilt/cookie';
import './index.css';
const { Header } = Layout;
const TreeNode = TreeSelect.TreeNode;
let titleTextUserId = "";
let titleTextUserDepartId = "";
let titleTextUserIdDepartId = "";
class RyglBm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      testName: '',
      selectedRows: '',
      data: {},
      userName: "",
      titleText: "",
      superStatus:'',
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
        // { name: '删除', icon: 'close' }
      ],
      datalist: [],
      dataColumns: [
        {
          title: '部门编号',
          dataIndex: 'departId',
          width: 150,
        }, {
          title: '部门名称',
          dataIndex: 'departName',
          width: 150,
        }, {
          title: '上级部门编号',
          dataIndex: 'parentId',
          width: 150,
        }, {
          title: '上级部门',
          dataIndex: 'parentName',
          width: 160,
        }, {
          title: '操作',
          dataIndex: 'operation',
          key: 'operation',
          width: 100,
          render: (e, _d) => {
            return (
              <div className="rygl-bm-operation">
                <a onClick={(e) => this.newlyPopup(_d, '编辑')}>编辑</a>
                <a onClick={(e) => this.newlyPopup(_d, '删除')}>删除</a>
              </div>

            )

          },
        }
      ],
      leftDatalist: [],
      // leftDatalist:[
      //   {
      //     name: '部门名称',
      //     value: '部门名称',
      //     children: [
      //       {
      //         name: '市场部',
      //         value: '市场部',
      //         children: [
      //           { name: '采购部', value: '部门名称>市场部>采购部' }
      //         ]
      //       },
      //       { name: '研发部', value: '部门名称>研发部' },
      //       { name: '财务部', value: '部门名称>财务部' },
      //       { name: '维修部', value: '部门名称>维修部' },
      //       { name: '证卡部', value: '部门名称>证卡部' }
      //     ]
      //   },
      //   {
      //     name: '技术',
      //     value: '技术',
      //     children: [
      //       { name: '研发部', value: '技术>研发部' },
      //       { name: '维修部', value: '技术>维修部' }
      //     ]
      //   }
      // ],
      departmentDatalist: []
    }

  }

  warningHints = () => {

    let titleText = ''
    if (!this.state.data.departId) {
      titleText = '带 * 不得为空！'
    }
    if (!this.state.data.departName) {
      titleText = '带 * 不得为空！'
    }

    if(this.state.superStatus !== '1'){
      if (!this.state.data.parentId) {
        titleText = '带 * 不得为空！'
      }
    }

    if (titleTextUserIdDepartId !== "") {
      titleText = titleTextUserIdDepartId
    }

    if (titleTextUserDepartId !== "") {
      titleText = titleTextUserDepartId
    }

    if (titleTextUserId !== "") {
      titleText = titleTextUserId
    }

    this.setState({ titleText })
  }

  componentDidMount() {
    //获取用户信息
    let obj = JSON.parse(cookie.getCookie('user'));
    if (obj && obj.user) {
        let user = obj.user;
        this.setState({
          superStatus: user.superStatus // 是否超级用户
        });
    }

    this.getDepartments();
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
    }, () => {
      this.warningHints();
    })

  }
  getDepartments = (text) => {
    this.getDepartment() //部门内容
    this.findDepartmentAll(1, this.state.pagination.pageSize,text) //部门查询
  }

  //部门内容
  getDepartment = () => {
    Util._httpPost("/project_war_exploded/department/selecttree.do", JSON.stringify({
    })).then((params) => {
      this.setState({
        leftDatalist: params.data.rows,
        departmentDatalist: params.data.rows
      })
    }).catch((error) => {

    })
  }

  //部门查询
  findDepartmentAll = (current, pageSize,text) => {

    Util._httpPost("/project_war_exploded/department/findDepartmentAll.do", JSON.stringify({
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
        datalist: params.data.rows,
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

  //部门新增
  addDepartment = (_data) => {
    Util._httpPost("/project_war_exploded/department/addDepartment.do", JSON.stringify({
      departId: _data.departId,
      departName: _data.departName,
      parentId: !_data.parentId ? '0' : _data.parentId
    })).then((params) => {

      if (params.data.flag) {
        this.getDepartments();
        message.success(params.data.message);
      } else {
        message.error(params.data.message);
      }

    }).catch((error) => {

    })
  }
  //部门编辑
  updateDepartment = (_data) => {
    Util._httpPost("/project_war_exploded/department/updateDepartment.do", JSON.stringify({
      departId: _data.departId,
      departName: _data.departName,
      parentId: !_data.parentId ? '0' : _data.parentId
    })).then((params) => {

      if (params.data.flag) {
        this.getDepartments();
        message.success(params.data.message);
      } else {
        message.error(params.data.message);
      }

    }).catch((error) => {

    })
  }
  //部门删除
  deleteDepartment = (departId) => {
    Util._httpPost("/project_war_exploded/department/deleteDepartment.do", JSON.stringify({
      departId: departId
    })).then((params) => {

      if (params.data.flag) {
        this.getDepartments();
        message.success(params.data.message);
      } else {
        message.error(params.data.message);
      }

    }).catch((error) => {

    })
  }

  //更新数据
  toUpdate = () => {
    this.setState({
      newlyPopup: { switch: false }
    })
    this.getDepartments("刷新成功");
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
  setSelectedRows = (selectedRows) => {
    this.setState({ selectedRows })
  }

  render() {

    return (
      <div className="rygl-bm">
        <Header style={{ background: '#fff', padding: 0 }} >
          <div className="query_condition">
            <div>
              部门名称：<Input value={this.state.testName} onKeyDown={(event) => {
                if (event.keyCode == 13) this.findDepartmentAll(1, this.state.pagination.pageSize)}} onChange={(e) => this.setState({ testName: e.target.value })} />
            </div>
            <div>
              <Button onClick={() => this.findDepartmentAll(1, this.state.pagination.pageSize)} icon="search">搜索</Button>
            </div>
          </div>
        </Header>
        <div className="rygl-bm-data">
          <div className="rygl-bm-data-datatree">
            <DataTree {...this.state} />
          </div>

          <div className="rygl-bm-data-datatable">
            <DataTable setSelectedRows={this.setSelectedRows} onGetData={this.findDepartmentAll} onNewlyPopup={this.newlyPopup} {...this.state} />
          </div>
          {
            //弹出框
            this.state.newlyPopup.switch ?
              this.state.newlyPopup.title === "新增" || this.state.newlyPopup.title === "编辑" ?
                <ElasticFrame
                  style={{ width: 500, height: 270 }}
                  title={this.state.newlyPopup.title}
                  titleText={this.state.titleText}
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

                      if (this.state.data.departId && this.state.data.departId !== "" && this.state.data.departName && this.state.data.departName !== "") {
                        if (title === '新增') {
                          this.addDepartment(this.state.data);
                        } else if (title === '编辑') {
                          this.updateDepartment(this.state.data);
                        }

                      } else {
                        this.setState({
                          titleText: '带 * 不得为空！'
                        });
                        message.info("带 * 不得为空！")
                        this.newlyPopup(this.state.data, title)
                      }

                    })


                  }}
                  renderDom={(props) => {
                    return (
                      <div className="rygl_bm_newly_added">

                        <div className="rygl_bm_tableStyle">

                          <div className="rygl_bm_tableStyle_div"><label>部门编号 <span className="required">*</span></label>
                            <Input type="text" disabled={this.state.newlyPopup.title === "编辑"} value={this.state.data.departId} onChange={(e) => {
                              this.setState({
                                data: { ...this.state.data, departId: e.target.value }
                              }, () => {
                                //departId查询是否重复
                                Util._httpPost("/project_war_exploded/department/departIdCount.do", JSON.stringify({
                                  departId: this.state.data.departId
                                })).then((params) => {
                                  if (params.data.flag) {
                                    titleTextUserDepartId = "";
                                  } else {
                                    titleTextUserDepartId = params.data.message
                                  }
                                  this.warningHints()
                                })


                              })
                            }} className="valid" />
                          </div>

                          <div className="rygl_bm_tableStyle_div"><label>部门名称 <span className="required">*</span></label>
                            <Input type="text" value={this.state.data.departName} onChange={(e) => {

                              this.setState({
                                data: { ...this.state.data, departName: e.target.value }
                              }, () => {
                                //部门名称查询是否重复
                                Util._httpPost("/project_war_exploded/department/departNameCount.do", JSON.stringify({
                                  departId: this.state.data.departId,
                                  departName: this.state.data.departName
                                })).then((params) => {
                                  if (params.data.flag) {
                                    titleTextUserId = "";
                                  } else {
                                    titleTextUserId = params.data.message
                                  }
                                  this.warningHints()
                                })

                              })
                            }} className="valid" />
                          </div>

                          {/* <div className="rygl_bm_tableStyle_div"><label>排序</label>
                            <Input type="text" className="valid" />
                          </div> */}


                          <div className="rygl_bm_tableStyle_div">
                            <label>上级部门{this.state.superStatus !== '1'?<span className="required">*</span>:''}</label>
                            <TreeSelect
                              showSearch
                              style={{ width: 300 }}
                              value={this.state.data.parentId}
                              dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
                              placeholder="调动到的部门"
                              allowClear
                              treeDefaultExpandAll
                              onChange={(value) => {
                                if (this.state.data.departId === value) {
                                  titleTextUserIdDepartId = '上级部门不得选择自己！'
                                } else {
                                  titleTextUserIdDepartId = "";
                                  let todata = false;
                                  let datas = [];
                                  let mydata = (children, d) => {
                                    children.map((_d) => {
                                      mydata(_d.children, d);
                                      if (!todata) {
                                        if (_d.id === value) {
                                          datas.push(d)
                                          datas.push(_d)
                                          todata = true
                                        }
                                      } else {
                                        datas.push(_d)
                                      }
                                     
                                    })
                                  }

                                  this.state.departmentDatalist.map((_d, index) => {
                                    if (!todata) {
                                      mydata(_d.children, _d);
                                    } else {

                                    }
                                  })

                                  for (let key in datas) {
                                    if (datas[key].id === this.state.data.departId) {
                                      if (datas[key - 1] && datas[key - 1].parentId === datas[key].parentId) {

                                      } else {
                                        titleTextUserIdDepartId = '不能选择自己的下级部门！';
                                      }

                                      break;
                                    }
                                  }
                                  
                                }
                                this.setState({
                                  data: {
                                    ...this.state.data,
                                    parentId: value
                                  }
                                }, () => {
                                  this.warningHints()
                                })
                              }}
                            >
                              {
                                this.TreeNode(this.state.departmentDatalist)
                              }
                            </TreeSelect>
                          </div>
                          <div className="rygl_bm_tableStyle_div required">
                            {
                              this.state.titleText
                            }
                          </div>
                        </div>
                      </div>
                    )
                  }}
                /> : this.state.newlyPopup.title === "删除" ?
                  <ElasticFrame
                    style={{ width: 280, height: 150 }}
                    titleText={this.state.titleText}
                    title={"提示"}
                    close={() => {
                      this.setState({
                        newlyPopup: { switch: false }
                      })
                    }}
                    ok={() => {
                      this.deleteDepartment(this.state.data.departId);
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

export default RyglBm;
