import React, { Component } from 'react';

import { Input, message, Button, Layout, DatePicker, Checkbox } from 'antd';
import ElasticFrame from '../../controls/elastic.frame';
import DataTree from '../../controls/data.tree';
import DataTreeCheckList from '../../controls/data.tree.check.list';
import DataTable from '../../controls/data.table';
import Util from '../../../uilt/http.utils';
import './index.css';

import moment from 'moment';
const { MonthPicker, RangePicker } = DatePicker;
const { Header } = Layout;
let departId = "";
class YcglBqd extends Component {

    constructor(props) {
        super(props);
        this.state = {
            localValue: '',
            titleText: '',
            data: {
            },
            startTime: moment(new Date(), 'YYYY-MM-DD HH:mm:ss'),
            endTime: moment(new Date(), 'YYYY-MM-DD HH:mm:ss'),
            newlyPopup: {
                title: "",
                switch: true,
            },

            selectedRows: [],
            addselectedRows: [],
            pagination: {
                total: 0,  //数据总数量
                pageSize: 50, //显示几条一页
            },
            addpagination: {
                total: 0,  //数据总数量
                pageSize: 50, //显示几条一页
            },
            titlelist: [
                { name: '刷新', icon: 'redo' },
                {
                    name: '新增', icon: 'file-add',
                    signingTime: moment(new Date(), 'YYYY-MM-DD HH:mm:ss')
                },
                { name: '删除', icon: 'close' }
            ],
            datalist: [],
            addDatalist: [],
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
                    dataIndex: 'departId',
                    width: 100,
                }, {
                    title: '部门名称',
                    dataIndex: 'departName',
                    width: 100,
                }, {
                    title: '签卡时间',
                    dataIndex: 'signingTime',
                    width: 100,
                }, {
                    title: '备注',
                    dataIndex: 'remarks',
                    width: 100,
                }, {
                    title: '操作人',
                    dataIndex: 'operator',
                    width: 100,
                }, {
                    title: '操作时间',
                    dataIndex: 'operateTime',
                    width: 100,
                }, {
                    title: '操作',
                    dataIndex: 'operation',
                    key: 'operation',
                    width: 80,
                    render: (e, _d) => {
                        return <a onClick={(e) => this.newlyPopup(_d, '删除')}>删除</a>
                    },
                }
            ],
            addDataColumns: [
                {
                    title: '部门名称',
                    dataIndex: 'departName',
                    width: 100,
                }, {
                    title: '部门编号',
                    dataIndex: 'departmentId',
                    width: 100,
                }, {
                    title: '姓名',
                    dataIndex: 'perName',
                    width: 100,
                }, {
                    title: '性别',
                    dataIndex: 'gender',
                    width: 100,
                }, {
                    title: '卡号',
                    dataIndex: 'cardNumber',
                    width: 100,
                },
            ],
            leftDatalist: [],
        }

    }

    componentDidMount() {
        var startTime = new Date();
        startTime.setMonth(startTime.getMonth() - 3);
        startTime.setHours(0);
        startTime.setMinutes(0);
        startTime.setSeconds(0);

        var endTime = new Date();
        endTime.setHours(endTime.getHours() + 24);
        endTime.setMinutes(0);
        endTime.setSeconds(0);


        this.setState({ startTime, endTime }, () => {
            this.findSigning(1, this.state.pagination.pageSize);
        });


        this.getDepartment();
    }
    findSigning = (current, pageSize, text, pagination) => {
        let startTime = this.state.startTime ? (new Date(this.state.startTime)).Format("yyyy-MM-dd hh:mm:ss") : this.state.startTime;
        let endTime = this.state.endTime ? (new Date(this.state.endTime)).Format("yyyy-MM-dd hh:mm:ss") : this.state.endTime;
        Util._httpPost("/project_war_exploded/exceptionManagement/findSigning.do", JSON.stringify({
            page: current,
            size: pageSize,
            name: this.state.userName,
            startTime: startTime,
            endTime: endTime,
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

    //添加补签单
    addSigning = () => {

        if (this.state.addselectedRows.length === 0) {
            message.error("选中的人员不得少于1");
            return false;
        }
        let ids = "";
        this.state.addselectedRows.map((_d) => {

            if (ids === "") {
                ids += _d.perId
            } else {
                ids += "," + _d.perId
            }
        })
        let signingTime = this.state.data.signingTime ? (new Date(this.state.data.signingTime)).Format("yyyy-MM-dd hh:mm:ss") : this.state.data.signingTime;
        Util._httpPost("/project_war_exploded/exceptionManagement/addSigning.do", JSON.stringify({
            perId: ids,
            signingTime: signingTime,
            remarks: this.state.data.remarks,
            operator: this.state.data.operator

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
            this.findSigning(1, this.state.pagination.pageSize);
            message.success(params.data.message);


        }).catch((error) => {

        })

    }
    //更新数据
    toUpdate = () => {
        setTimeout(() => {
            if (this.state.newlyPopup.switch) {
                this.findSigning(1, this.state.pagination.pageSize, "刷新成功");
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

    //删除补签单
    deleteSigning = (ids) => {
        //project_war_exploded/person/addPerson.do
        for (let key in this.state.selectedRows) {
            if (ids == "") {
                ids += this.state.selectedRows[key].id
            } else {
                ids += ',' + this.state.selectedRows[key].id
            }
        }

        Util._httpPost("/project_war_exploded/exceptionManagement/deleteSigning.do", {
            signingIds: ids
        }).then((params) => {
            this.findSigning(1, this.state.pagination.pageSize);
            message.success(params.data.message)
        }).catch((error) => {

        })

    }

    //通过部门查询人员
    getfindAllByDepartment = (current, pageSize, _d) => {
        departId = _d.id + ''
        Util._httpPost("/project_war_exploded/person/findAllByEquipment.do", JSON.stringify({
            departId: _d.id + '',
            perName: this.state.data.perName,
            page: current,
            size: pageSize,
        })).then((params) => {
            let data = [];
            for (let key in params.data.rows) {
                params.data.rows[key].key = key;
                data[key] = params.data.rows[key]
                if (data[key].gender) {
                    data[key].gender = (data[key].gender === "1" ? "男" : "女")
                }

            }

            this.setState({
                addDatalist: data,
                addpagination: {
                    total: params.data.total,  //数据总数量
                    pageSize: pageSize, //显示几条一页
                }
            })
        }).catch((error) => {

        })
    }
    addsetSelectedRows = (addselectedRows) => {

        this.setState({ addselectedRows })
    }
    setSelectedRows = (selectedRows) => {

        this.setState({ selectedRows })
    }
    newlyPopup = (_d, title) => {

        this.setState({
            data: _d,
            titleText: "",
            newlyPopup: {
                title: title,
                switch: true
            }
        }, () => {
            this.warningHints()
        })
    }
    warningHints() {

        let titleText = ''
        if (!this.state.data.signingTime) {
            titleText = '带 * 不得为空！'
        }
        if (!this.state.data.operator) {
            titleText = '带 * 不得为空！'
        }

        this.setState({ titleText })
        return titleText !== "" ? false : true
    }


    render() {
        return (
            <div className='ycgl-bqd'>
                <Header style={{ background: '#fff', padding: 0 }} >
                    <div className="query_condition">
                        <div className="rangePicker">
                            时间选择：  <RangePicker format={"YYYY-MM-DD HH:mm:ss"} value={[moment(this.state.startTime, 'YYYY-MM-DD HH:mm:ss'), moment(this.state.endTime, 'YYYY-MM-DD HH:mm:ss')]} onChange={(date) => {
                                this.setState({ startTime: date[0], endTime: date[1] })
                            }} showTime />
                        </div>
                        <div>
                            模糊查询：<Input value={this.state.userName}
                                onKeyDown={(event) => {
                                    if (event.keyCode == 13) this.findSigning(1, this.state.pagination.pageSize)
                                }} onChange={(e) => this.setState({ userName: e.target.value })} />
                        </div>

                        <div>
                            <Button onClick={() => this.findSigning(1, this.state.pagination.pageSize)} icon="search">搜索</Button>
                        </div>
                    </div>
                </Header>
                <div className="ycgl-bqd-data">
                    <div className="ycgl-bqd-data-datatable">
                        <DataTable onGetData={this.findSigning} setSelectedRows={this.setSelectedRows} onNewlyPopup={this.newlyPopup} {...this.state} />
                    </div>
                </div>

                {
                    //弹出框
                    this.state.newlyPopup.switch ?
                        this.state.newlyPopup.title === "新增" ?
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
                                    if (!this.state.data.signingTime || this.state.data.signingTime === "") {
                                        message.error("签卡时间不得为空！");
                                    } else {
                                        this.setState({
                                            newlyPopup: { switch: false }
                                        }, () => {

                                            this.addSigning()

                                        })
                                    }


                                }}
                                renderDom={(props) => {

                                    return <div>
                                        <table className="tableStyle">
                                            <tbody>

                                                <tr>
                                                    <th>
                                                        <label>签卡时间</label><span className="required">*</span>
                                                    </th>
                                                    <td>
                                                        <DatePicker format={"YYYY-MM-DD HH:mm:ss"} renderExtraFooter={() => '签卡时间'} onChange={(value) => {

                                                            this.setState({
                                                                data: { ...this.state.data, signingTime: value }
                                                            }, () => {
                                                                this.warningHints()
                                                            })
                                                        }} value={this.state.data.signingTime ? moment(this.state.data.signingTime, 'YYYY-MM-DD HH:mm:ss') : this.state.data.signingTime} showTime />

                                                    </td>


                                                    <th><label>备注</label></th>
                                                    <td>
                                                        <Input type="text" value={this.state.data.remarks} onChange={(e) => {
                                                            this.setState({
                                                                data: { ...this.state.data, remarks: e.target.value }
                                                            })
                                                        }} className="valid" />

                                                    </td>

                                                    <th><label>操作人</label><span className="required">*</span></th>
                                                    <td>
                                                        <Input type="text" value={this.state.data.operator} onChange={(e) => {

                                                            this.setState({
                                                                data: { ...this.state.data, operator: e.target.value }
                                                            }, () => {
                                                                this.warningHints()
                                                            })
                                                        }} className="valid" />

                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th>
                                                        <label>模糊查询</label>
                                                    </th>
                                                    <td>
                                                        <Input type="text" value={this.state.data.perName} onChange={(e) => {
                                                            this.setState({
                                                                data: { ...this.state.data, perName: e.target.value }
                                                            })
                                                        }} className="valid" />


                                                    </td>
                                                    <td>
                                                        <Button onClick={() => { this.getfindAllByDepartment(1, this.state.pagination.pageSize, {id:departId}) }} icon="search">搜索</Button>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <div className="rygl-ry-data">

                                            <div className="rygl-ry-data-datatree">
                                                <DataTree
                                                    style={{ height: 283 }}
                                                    ongetfindAllByDepartment={(current, pageSize, _d) => { this.getfindAllByDepartment(current, pageSize, _d) }}
                                                    {...this.state}
                                                />
                                            </div>

                                            <div className="rygl-ry-data-datatable">
                                                <DataTable
                                                    style={{ height: 315 }}
                                                    scroll={{ y: 315 }}
                                                    closeTitle={true}
                                                    // closePagination={true}
                                                    setSelectedRows={this.addsetSelectedRows}
                                                    onGetData={(current, pageSize) => { this.getfindAllByDepartment(current, pageSize, { id: departId }) }}
                                                    {...this.state}
                                                    datalist={this.state.addDatalist}
                                                    dataColumns={this.state.addDataColumns}
                                                    pagination={this.state.addpagination}
                                                />
                                            </div>


                                        </div>

                                    </div>
                                }}
                            /> : this.state.newlyPopup.title === "刷新" ?
                                this.toUpdate()
                                : this.state.newlyPopup.title === "删除" ?
                                    <ElasticFrame
                                        style={{ width: 280, height: 150 }}
                                        title={"提示"}
                                        titleText={''}
                                        close={() => {
                                            this.setState({
                                                newlyPopup: { switch: false }
                                            })
                                        }}
                                        ok={() => {
                                            this.deleteSigning(this.state.data.id);
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
                                    /> : ""
                        : ""
                }
            </div>
        );
    }
}
export default YcglBqd;