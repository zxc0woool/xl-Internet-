

import React, { Component } from 'react';
import { Input, TreeSelect, Button, message, Layout } from 'antd';
import DataTree from '../../controls/data.tree';
import DataTable from '../../controls/data.table';

import ElasticFrame from '../../controls/elastic.frame';
import Util from '../../../uilt/http.utils';
import './index.css';

const TreeNode = TreeSelect.TreeNode;
const { Header } = Layout;
let titleTextUserId = "";
let titleTextUserIdposiId = "";
class RyglZw extends Component {
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
        { name: '新增', icon: 'file-add' },
        // { name: '删除', icon: 'close' }
      ],
      datalist: [],
      dataColumns: [
        {
          title: '职位编号',
          dataIndex: 'posiId',
          width: 150,
        }, {
          title: '职位名称',
          dataIndex: 'posiName',
          width: 150,
        }, {
          title: '上级职位编号',
          dataIndex: 'parentId',
          width: 150,
        }, {
          title: '上级职位',
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
      positionDatalist: [],
    }

  }
  warningHints = () => {

    let titleText = ''
    if (!this.state.data.posiId) {
      titleText = '带 * 不得为空！'
    }
    if (!this.state.data.posiName) {
      titleText = '带 * 不得为空！'
    }
    if (titleTextUserIdposiId !== "") {
      titleText = titleTextUserIdposiId
    }
    if (titleTextUserId !== "") {
      titleText = titleTextUserId
    }

    this.setState({ titleText })
  }


  componentDidMount() {

    this.getDepartments();
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
  getDepartments = (text) => {
    this.selecttree() //部门内容
    this.findPositionAll(1, this.state.pagination.pageSize, text) //部门查询

  }
  //职位内容
  selecttree = () => {
    Util._httpPost("/project_war_exploded/position/selecttree.do", JSON.stringify({
    })).then((params) => {
      this.setState({
        positionDatalist: params.data.rows,
        leftDatalist: params.data.rows
      })
    }).catch((error) => {

    })
  }

  //职位查询
  findPositionAll = (current, pageSize,text) => {
    Util._httpPost("/project_war_exploded/position/findPositionAll.do", JSON.stringify({
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


  //职位新增
  addPosition = (_data) => {
    Util._httpPost("/project_war_exploded/position/addPosition.do", JSON.stringify({
      posiId: _data.posiId,
      parentId: !_data.parentId ? '0' : _data.parentId,
      posiName: _data.posiName
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

  //职位编辑
  updatePosition = (_data) => {
    Util._httpPost("/project_war_exploded/position/updatePosition.do", JSON.stringify({
      posiId: _data.posiId,
      parentId: !_data.parentId ? '0' : _data.parentId,
      posiName: _data.posiName
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

  //职位删除
  deletePosition = (posiId) => {
    Util._httpPost("/project_war_exploded/position/deletePosition.do", JSON.stringify({
      posiId: posiId
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
    setTimeout(() => {
      this.setState({
        newlyPopup: { switch: false }
      })
    }, 0)

    this.getDepartments("刷新成功");
  }

  setSelectedRows = (selectedRows) => {
    this.setState({ selectedRows })
  }

  onTreeNodeChange = (localValue) => {
    console.log(localValue);
    this.setState({ localValue });
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

  render() {

    return (
      <div className="rygl-zw">
        <Header style={{ background: '#fff', padding: 0 }} >
          <div className="query_condition">
            <div>
              职位名称：<Input value={this.state.testName} onKeyDown={(event) => {
                if (event.keyCode == 13) this.findPositionAll(1, this.state.pagination.pageSize)}} onChange={(e) => this.setState({ testName: e.target.value })} />
            </div>
            <div>
              <Button onClick={() => this.findPositionAll(1, this.state.pagination.pageSize)} icon="search">搜索</Button>
            </div>
          </div>
        </Header>
        <div className="rygl-zw-data">
          <div className="rygl-zw-data-datatree">
            <DataTree {...this.state} />
          </div>

          <div className="rygl-zw-data-datatable">
            <DataTable setSelectedRows={this.setSelectedRows} onGetData={this.findPositionAll} onNewlyPopup={this.newlyPopup} {...this.state} />
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

                      if (this.state.data.posiId && this.state.data.posiId !== "" && this.state.data.posiName && this.state.data.posiName !== "") {
                        if (title === '新增') {
                          this.addPosition(this.state.data);
                        } else if (title === '编辑') {
                          this.updatePosition(this.state.data);
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
                      <div className="rygl_zw_newly_added">

                        <div className="rygl_zw_tableStyle">

                          <div className="rygl_bm_tableStyle_div"><label>职位编号 <span className="required">*</span></label>
                            <Input type="text" disabled={this.state.newlyPopup.title === "编辑"} value={this.state.data.posiId} onChange={(e) => {
                              this.setState({
                                data: { ...this.state.data, posiId: e.target.value }
                              }, () => {
                                //posiId查询是否重复
                                Util._httpPost("/project_war_exploded/position/positionCount.do", JSON.stringify({
                                  posiId: this.state.data.posiId
                                })).then((params) => {
                                  if (params.data.flag) {
                                    titleTextUserIdposiId = "";
                                  } else {
                                    titleTextUserIdposiId = params.data.message
                                  }
                                  this.warningHints();
                                })

                              })
                            }} />
                          </div>

                          <div className="rygl_bm_tableStyle_div"><label>职位名称 <span className="required">*</span></label>
                            <Input type="text" value={this.state.data.posiName} onChange={(e) => {
                              this.setState({
                                data: { ...this.state.data, posiName: e.target.value }
                              }, () => {
                                this.warningHints();
                              })
                            }} />
                          </div>

                          <div className="rygl_bm_tableStyle_div">
                            <label>上级职位</label>
                            <TreeSelect
                              showSearch
                              style={{ width: 300 }}
                              value={this.state.data.parentId}
                              dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
                              placeholder="调动到的职位"
                              allowClear
                              treeDefaultExpandAll
                              onChange={(value, e, w) => {
                                if (this.state.data.posiId === value) {
                                  titleTextUserId = '上级职位不得选择自己！'
                                } else {
                                  titleTextUserId = "";
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

                                  this.state.positionDatalist.map((_d, index) => {
                                    if (!todata) {
                                      mydata(_d.children, _d);
                                    } else {

                                    }
                                  })
                                  // mydata(this.state.positionDatalist);
                                  for (let key in datas) {
                                    if (datas[key].id === this.state.data.posiId) {
                                      if (datas[key - 1] && datas[key - 1].parentId === datas[key].parentId) {

                                      } else {
                                        titleTextUserId = '不能选择自己的下级单位！';
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
                                  this.warningHints();
                                })
                              }}
                            >
                              {
                                this.TreeNode(this.state.positionDatalist)
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
                      this.deletePosition(this.state.data.posiId);
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

export default RyglZw;
