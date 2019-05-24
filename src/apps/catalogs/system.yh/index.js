import React, { Component } from 'react';
import { Select, Input, Checkbox, message, TreeSelect } from 'antd';
import Information from '../../controls/information';
import DataTable from '../../controls/data.table';
import Util from '../../../uilt/http.utils';
import ElasticFrame from '../../controls/elastic.frame';
import './index.css';
import moment from 'moment';
const Option = Select.Option;
const TreeNode = TreeSelect.TreeNode;
const { TextArea } = Input;
const SHOW_PARENT = TreeSelect.SHOW_PARENT;
let personnel = {};
let titleTextUserUsername = '';
class SystemYh extends Component {
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
                { name: '新增', icon: 'file-add', status: "1", superStatus: '2' },
                { name: '删除', icon: 'close' }
            ],
            datalist: [],
            dataColumns: [
                {
                    title: '用户名',
                    dataIndex: 'username',
                    width: 100,
                }, {
                    title: '姓名',
                    dataIndex: 'name',
                    width: 100,
                }, {
                    title: '状态',
                    dataIndex: 'status',
                    width: 160,
                    render: (e, _d) => {
                        return (
                            <div className="rygl-bm-operation">
                                {_d.status === '1' ? "启用" : "禁用"}
                            </div>

                        )

                    },
                }, {
                    title: '超级用户状态',
                    dataIndex: 'superStatus',
                    width: 160,
                    render: (e, _d) => {
                        return (
                            <div className="rygl-bm-operation">
                                {_d.superStatus === '1' ? "超级用户" : "普通用户"}
                            </div>

                        )

                    },
                }, {
                    title: '创建日期',
                    dataIndex: 'creationTime',
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
                                {
                                    _d.adminStatus === '2' ? <a onClick={(e) => this.newlyPopup(_d, '删除')}>删除</a> : ''
                                }

                            </div>

                        )

                    },
                }
            ],
            positionDatalist: [],
            departmentDatalist: [],

        }
    }
    warningHints = () => {

        let titleText = ''
        if (!this.state.data.username) {
            titleText = '带 * 不得为空！'
        }

        

        if (this.state.data.password) {
            if (this.state.data.password !== this.state.data.newPassword) {
                titleText = '密码和确定密码必须一致'
            }
            if (this.state.data.password.length >= 4 && this.state.data.password.length <= 12) {

            } else {
                titleText = '密码不得小于4位或大于12位'
            }
        }
        let treeSelectValue = this.state.treeSelectValue;
        if (!this.state.data.superStatus) {
            titleText = '带 * 不得为空！'
        } else if (this.state.data.superStatus === '1') {
            treeSelectValue = ['0']
            this.setState({
                data: {
                    ...this.state.data,
                    authority: '0'
                }
            })
        }

        if (this.state.newlyPopup.title === '新增') {
            if (!this.state.data.password) {
                titleText = '带 * 不得为空！'
            }
            if (!this.state.data.newPassword) {
                titleText = '带 * 不得为空！'
            }
        }
        if(titleTextUserUsername !== ""){
            titleText = titleTextUserUsername;
        }

        this.setState({ titleText, treeSelectValue, })
    }

    componentDidMount() {

        this.findAllUser(1, this.state.pagination.pageSize);

        this.getDepartment();
    }
    componentDidCatch() {

    }
    onWillUnmount = (_data, titleText) => {
        this.setState({
            titleText
        })
        personnel = _data;

    }

    //用户查询
    findAllUser = (current, pageSize, text) => {
        Util._httpPost("/project_war_exploded/user/findAllUser.do", JSON.stringify({
            page: current,
            size: pageSize,
            name: this.state.testName,
            username: this.state.username,
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
                message.success(text, 0.5);
            }
        }).catch((error) => {

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
    //用户编辑
    updateUser = (_data) => {
        //project_war_exploded/person/addPerson.do
        Util._httpPost("/project_war_exploded/user/updateUser.do", {
            ..._data
        }).then((params) => {
            this.findAllUser(1, this.state.pagination.pageSize);
            message.success(params.data.message)
        }).catch((error) => {

        })
    }
    //添加用户
    addUser = (_data) => {
        // _data.quitDate = _data.quitDate ? (new Date(_data.quitDate)).Format("yyyy-MM-dd") : _data.quitDate;
        //project_war_exploded/person/addPerson.do

        Util._httpPost("/project_war_exploded/user/addUser.do", {
            ..._data
        }).then((params) => {
            this.findAllUser(1, this.state.pagination.pageSize);
            message.success(params.data.message)
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

    //删除用户
    deleteUser = (ids) => {

        for (let key in this.state.selectedRows) {
            if (ids == "") {
                ids += this.state.selectedRows[key].id
            } else {
                ids += ',' + this.state.selectedRows[key].id
            }

        }
        Util._httpPost("/project_war_exploded/user/deleteUser.do", JSON.stringify({
            ids: ids
        })).then((params) => {
            this.findAllUser(1, this.state.pagination.pageSize);
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

        this.findAllUser(1, this.state.pagination.pageSize, "刷新成功");
    }
    newlyPopup = (_d, title) => {

        let treeSelectValue = [];
        if (_d.authority) {
            treeSelectValue = _d.authority.split(',');
        }
        this.setState({
            data: _d,
            titleText: "",
            newlyPopup: {
                title: title,
                switch: true
            },
            treeSelectValue

        }, () => {
            this.warningHints();
        })

    }
    setSelectedRows = (selectedRows) => {
        this.setState({ selectedRows })
    }


    render() {
        let {leftDatalist} = this.state
        return (
            <div className="system_yh">
                <div className="system_yh-data">

                    <div className="system_yh-data-datatable">
                        <DataTable setSelectedRows={this.setSelectedRows} onGetData={this.findAllUser} onNewlyPopup={this.newlyPopup} {...this.state} />
                    </div>
                    {
                        //弹出框
                        this.state.newlyPopup.switch ?
                            this.state.newlyPopup.title === "新增" || this.state.newlyPopup.title === "编辑" ?
                                <ElasticFrame
                                    style={{ width: 500, height: 400 }}
                                    title={this.state.newlyPopup.title}
                                    close={() => {
                                        this.setState({
                                            newlyPopup: { switch: false }
                                        })
                                    }}
                                    titleText={this.state.titleText}
                                    ok={() => {
                                        let title = this.state.newlyPopup.title
                                        if (title === "新增") {
                                            this.setState({
                                                newlyPopup: { switch: false }
                                            }, () => {
                                                this.addUser(this.state.data, true)

                                            })
                                        } if (title === "编辑") {
                                            this.setState({
                                                newlyPopup: { switch: false }
                                            }, () => {
                                                this.updateUser(this.state.data, true)
                                            })
                                        } else {

                                        }

                                    }}
                                    renderDom={(props) => {
                                        return (
                                            <div className="rygl_bm_newly_added">

                                                <div className="rygl_bm_tableStyle">

                                                    <div className="kqsb-sb_tableStyle_div"><label>用户名 <span className="required">*</span></label>
                                                        <Input type="text" value={this.state.data.username} onChange={(e) => this.setState({ data: { ...this.state.data, username: e.target.value } }, () => {
                                                            //用户名是否重复
                                                            Util._httpPost("/project_war_exploded/user/findUserByName.do", JSON.stringify({
                                                                username: this.state.data.username
                                                            })).then((params) => {
                                                                if (params.data.flag) {
                                                                    titleTextUserUsername = "";
                                                                } else {
                                                                    titleTextUserUsername = params.data.message
                                                                }
                                                                this.warningHints()
                                                            })


                                                        })} className="valid" />
                                                    </div>
                                                    <div className="kqsb-sb_tableStyle_div"><label>{this.state.newlyPopup.title === "编辑" ? ' 新密码 ' : <span>密码 <span className="required">*</span></span>}</label>
                                                        <Input type="password" value={this.state.data.password} onChange={(e) => this.setState({ data: { ...this.state.data, password: e.target.value } }, () => {
                                                            this.warningHints();
                                                        })} className="valid" />
                                                    </div>
                                                    <div className="kqsb-sb_tableStyle_div"><label>确认密码 {this.state.newlyPopup.title === "编辑" ? this.state.data.password ? <span className="required">*</span> : '' : <span className="required">*</span>}</label>
                                                        <Input type="password" value={this.state.data.newPassword} onChange={(e) => this.setState({ data: { ...this.state.data, newPassword: e.target.value } }, () => {
                                                            this.warningHints();
                                                        })} className="valid" />
                                                    </div>
                                                    <div className="kqsb-sb_tableStyle_div"><label>姓名</label>
                                                        <Input type="text" value={this.state.data.name} onChange={(e) => this.setState({ data: { ...this.state.data, name: e.target.value } })} className="valid" />
                                                    </div>

                                                    <div className="kqsb-qy_tableStyle_div"><label>状态</label>
                                                        <Select disabled={this.state.data.adminStatus === '1'} value={this.state.data.status} onChange={(value) => this.setState({ data: { ...this.state.data, status: value } })} id="certType">
                                                            <Option value='1'>启用</Option>
                                                            <Option value='2'>禁用</Option>
                                                        </Select>
                                                    </div>
                                                    <div className="kqsb-qy_tableStyle_div" style={{ height: 24 }}><label>超级用户状态</label>

                                                        <Checkbox disabled={this.state.data.adminStatus === '1'} checked={this.state.data.superStatus === '1' ? true : false} onChange={(e) => {
                                                            let superStatus = false;
                                                            if (e.target.checked) {
                                                                superStatus = '1'
                                                            } else {
                                                                superStatus = '2'
                                                            }

                                                            this.setState({
                                                                data: {
                                                                    ...this.state.data,
                                                                    superStatus: superStatus
                                                                },
                                                                treeSelectValue: []
                                                            }, () => {
                                                                this.warningHints()
                                                            })

                                                        }} />

                                                    </div>
                                                    <div className="kqsb-qy_tableStyle_div">
                                                        <label>授权部门<span className="required">*</span></label>
                                                        <TreeSelect
                                                            leftDatalist
                                                            disabled={this.state.data.adminStatus === '1' ? true : this.state.data.superStatus === '1'}
                                                            showCheckedStrategy={SHOW_PARENT}
                                                            style={{ minWidth: 380 }}
                                                            value={this.state.treeSelectValue}
                                                            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                                            // placeholder=""
                                                            // allowClear
                                                            // multiple
                                                            // treeDefaultExpandAll
                                                            treeCheckable={true}
                                                            onChange={(treeSelectValue) => {
                                                                console.log(treeSelectValue);
                                                                let authority = ""
                                                                treeSelectValue.map((val) => {
                                                                    if (authority === "") {
                                                                        authority += val
                                                                    } else {
                                                                        authority += ',' + val
                                                                    }
                                                                });

                                                                this.setState({
                                                                    treeSelectValue, data: {
                                                                        ...this.state.data,
                                                                        authority: authority
                                                                    }
                                                                }, () => {
                                                                    this.warningHints();
                                                                });
                                                            }}
                                                        >
                                                            {
                                                                this.TreeNode(this.state.leftDatalist)
                                                            }
                                                        </TreeSelect>
                                                    </div>
                                                    <div className="kqsb-qy_tableStyle_div" style={{ height: 24 }}>
                                                        <label className="required">{this.state.titleText}</label>
                                                    </div>
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
                                        titleText={this.state.titleText}
                                        ok={() => {
                                            this.deleteUser(this.state.data.id + '');
                                            this.setState({
                                                newlyPopup: { switch: false },
                                                selectedRows:[]
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
export default SystemYh;