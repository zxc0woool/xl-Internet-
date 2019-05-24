import React, { Component } from 'react';
import UserImage from '../../../images/src/userImage.gif'
import { Input, message, Modal, Upload, Button, Layout, DatePicker, Checkbox, Select, Icon } from 'antd';
import ElasticFrame from '../../controls/elastic.frame';
import DataTree from '../../controls/data.tree';
import DataTreeCheckList from '../../controls/data.tree.check.list';
import DataTable from '../../controls/data.table';
import Util from '../../../uilt/http.utils';
import './index.css';

import moment from 'moment';
const { MonthPicker, RangePicker } = DatePicker;
const { Header } = Layout;
const Option = Select.Option;
class YcglQjd extends Component {

    constructor(props) {
        super(props);
        this.state = {
            localValue: '',
            previewVisible: false,
            previewImage: UserImage,
            fileList: [],
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
            titlelist: [
                { name: '刷新', icon: 'redo' },
                {
                    name: '新增', icon: 'file-add',
                    startTime: moment(new Date(), 'YYYY-MM-DD HH:mm:ss'),
                    endTime: moment(new Date(), 'YYYY-MM-DD HH:mm:ss'),
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
                    title: '假类名称',
                    dataIndex: 'leaveType',
                    width: 100,
                }, {
                    title: '开始时间',
                    dataIndex: 'startTime',
                    width: 100,
                }, {
                    title: '结束时间',
                    dataIndex: 'endTime',
                    width: 100,
                }, {
                    title: '备注',
                    dataIndex: 'remarks',
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
                        return <div className="rygl-bm-operation">
                                <a onClick={(e) => this.newlyPopup(_d, '删除')}>删除</a>
                                <a onClick={(e) => this.newlyPopup(_d, '请假单照片')}>请假单照片</a>
                               </div>

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
                    dataIndex: 'departId',
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
            this.findLeave(1, this.state.pagination.pageSize);
        });


        this.getDepartment();
    }
    findLeave = (current, pageSize, text) => {
        let startTime = this.state.startTime ? (new Date(this.state.startTime)).Format("yyyy-MM-dd hh:mm:ss") : this.state.startTime;
        let endTime = this.state.endTime ? (new Date(this.state.endTime)).Format("yyyy-MM-dd hh:mm:ss") : this.state.endTime;
        Util._httpPost("/project_war_exploded/exceptionManagement/findLeave.do", JSON.stringify({
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
    //添加请假单
    addLeave = (_data) => {

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
        _data.startTime = _data.startTime ? (new Date(_data.startTime)).Format("yyyy-MM-dd hh:mm:ss") : _data.startTime;
        _data.endTime = _data.endTime ? (new Date(_data.endTime)).Format("yyyy-MM-dd hh:mm:ss") : _data.endTime;
        Util._httpPost("/project_war_exploded/exceptionManagement/addLeave.do", JSON.stringify({
            ..._data,
            perId: ids,
            // signingTime: signingTime,
            // remarks: this.state.data.remarks
        })).then((params) => {
            // let data = [];
            // for (let key in params.data.rows) {
            //     params.data.rows[key].key = key;
            //     data[key] = params.data.rows[key]
            // }
            // this.setState({
            //     datalist: data,
            //     pagination: {
            //         total: params.data.total,  //数据总数量
            //         pageSize: this.state.pagination.pageSize, //显示几条一页
            //     }
            // })

            if (params.data.flag) {
                message.success(params.data.message);
            } else {
                message.error(params.data.message);
            }
            this.findLeave(1, this.state.pagination.pageSize);


        }).catch((error) => {

        })

    }
    //更新数据
    toUpdate = () => {
        setTimeout(() => {
            if (this.state.newlyPopup.switch) {
                this.findLeave(1, this.state.pagination.pageSize, "刷新成功");
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

    //删除
    deleteLeave = (ids) => {
        //project_war_exploded/person/addPerson.do
        for (let key in this.state.selectedRows) {
            if (ids == "") {
                ids += this.state.selectedRows[key].id
            } else {
                ids += ',' + this.state.selectedRows[key].id
            }
        }

        Util._httpPost("/project_war_exploded/exceptionManagement/deleteLeave.do", {
            leaveIds: ids
        }).then((params) => {
            this.findLeave(1, this.state.pagination.pageSize);
            message.success(params.data.message)
        }).catch((error) => {

        })

    }

    //通过部门查询人员
    getfindAllByDepartment = (_d) => {
        Util._httpPost("/project_war_exploded/person/findAllByEquipment.do", JSON.stringify({
            departId: _d.id,
            perName: this.state.data.perName
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
        })
    }
    handleCancel = () => {
        this.setState({ previewVisible: false })
    }

    handleChange = ({ fileList }) => {
        this.setState({
            fileList: fileList,
            data: {
                ...this.state.data,
                file: fileList[0],
                perPhoto: fileList[0]
            }
        })
    }

    handlePreview = (file) => {

        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true,
        });
    }

    render() {
        const { previewVisible, previewImage, fileList } = this.state;
        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">预览</div>
            </div>
        );
        return (
            <div className='ycgl-qjd'>
                <Header style={{ background: '#fff', padding: 0 }} >
                    <div className="query_condition">
                        <div className="rangePicker">
                            时间选择：  <RangePicker format={"YYYY-MM-DD HH:mm:ss"} value={[moment(this.state.startTime, 'YYYY-MM-DD HH:mm:ss'), moment(this.state.endTime, 'YYYY-MM-DD HH:mm:ss')]} onChange={(date) => {
                                this.setState({ startTime: date[0], endTime: date[1] })
                            }} showTime />
                        </div>
                        <div>
                            模糊查询：<Input value={this.state.userName} onChange={(e) => this.setState({ userName: e.target.value })} />
                        </div>

                        <div>
                            <Button onClick={() => this.findLeave(1, this.state.pagination.pageSize)} icon="search">搜索</Button>
                        </div>
                    </div>
                </Header>
                <div className="ycgl-qjd-data">
                    <div className="ycgl-qjd-data-datatable">
                        <DataTable setSelectedRows={this.setSelectedRows} onNewlyPopup={this.newlyPopup} {...this.state} />
                    </div>
                </div>

                {
                    //弹出框
                    this.state.newlyPopup.switch ?
                        this.state.newlyPopup.title === "新增" ?
                            <ElasticFrame
                                style={{ width: 900, height: 600 }}
                                title={this.state.newlyPopup.title}
                                close={() => {
                                    this.setState({
                                        newlyPopup: { switch: false }
                                    })
                                }}
                                titleText={this.state.titleText}
                                ok={() => {
                                    // if (!this.state.data.signingTime || this.state.data.signingTime === "") {
                                    //     message.error("签卡时间不得为空！");
                                    // } else {
                                    this.setState({
                                        newlyPopup: { switch: false }
                                    }, () => {

                                        this.addLeave(this.state.data)

                                    })
                                    // }


                                }}
                                renderDom={(props) => {

                                    return <div>
                                        <table className="tableStyle">
                                            <tbody>

                                                <tr>

                                                    <th><label>假种</label></th>
                                                    <td>
                                                        <Select value={this.state.data.leaveType}
                                                            onChange={(val) => this.setState({
                                                                data: { ...this.state.data, leaveType: val }
                                                            })} id="certType">
                                                            <Option selected="selected" value="">---</Option>
                                                            <Option value="1">事假 (L1)</Option>
                                                            <Option value="2">婚假 (L2)</Option>
                                                            <Option value="3">产假 (L3)</Option>
                                                            <Option value="4">病假 (L4)</Option>
                                                            <Option value="5">年假 (L5)</Option>
                                                            <Option value="6">丧假 (L6)</Option>
                                                            <Option value="7">探亲假 (L7)</Option>
                                                            <Option value="8">哺乳假 (L8)</Option>
                                                            <Option value="9">自定义 (L9)</Option>
                                                        </Select>
                                                        {/* <Input type="text" value={this.state.data.remarks} onChange={(e) => {
                                                            this.setState({
                                                                data: { ...this.state.data, remarks: e.target.value }
                                                            })
                                                        }} className="valid" /> */}

                                                    </td>
                                                    <th>
                                                        <label>开始和结束时间</label><span className="required">*</span>
                                                    </th>
                                                    <td className="query_condition">
                                                        <RangePicker format={"YYYY-MM-DD HH:mm:ss"} value={[moment(this.state.data.startTime, 'YYYY-MM-DD HH:mm:ss'), moment(this.state.data.endTime, 'YYYY-MM-DD HH:mm:ss')]} onChange={(date) => {
                                                            this.setState({ data: { ...this.state.data, startTime: date[0], endTime: date[1] } })
                                                        }} showTime />
                                                        {/* <DatePicker format={"YYYY-MM-DD HH:mm:ss"} renderExtraFooter={() => '签卡时间'} onChange={(value) => {

                                                            this.setState({
                                                                data: { ...this.state.data, signingTime: value }
                                                            }, () => {
                                                                // this.warningHints() 
                                                            })
                                                        }} value={this.state.data.signingTime ? moment(this.state.data.signingTime, 'YYYY-MM-DD HH:mm:ss') : this.state.data.signingTime} showTime /> */}

                                                    </td>


                                                    <th><label>备注</label></th>
                                                    <td>
                                                        <Input type="text" value={this.state.data.remarks} onChange={(e) => {
                                                            this.setState({
                                                                data: { ...this.state.data, remarks: e.target.value }
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
                                                        <Button onClick={() => this.getfindAllByDepartment({ id: '' })} icon="search">搜索</Button>
                                                    </td>

                                                    <td>
                                                        请假单照片：
                                                    <br />
                                                        <div>
                                                            <div className="div_img floatL">
                                                                <div className="ar_r_t">
                                                                    <div className="ar_l_t">
                                                                        <div className="ar_r_b">
                                                                            <div className="ar_l_b" id="ar_l_b" style={{ width: 360, height: 140, overflow: 'hidden' }}>
                                                                                <div id="localImag">
                                                                                    <Upload
                                                                                        action="//jsonplaceholder.typicode.com/posts/"
                                                                                        listType="picture-card"
                                                                                        fileList={fileList}
                                                                                        beforeUpload={this.handleReturn}
                                                                                        onPreview={this.handlePreview}
                                                                                        onChange={this.handleChange}
                                                                                    >
                                                                                        {fileList.length >= 1 ? null : uploadButton}
                                                                                    </Upload>
                                                                                    {/* <img id="imgForm" style={{ width: 120, height: 150, position: 'absolute',top: 0}} src="" /> */}
                                                                                    <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                                                                                        <img alt="example" style={{ width: '100%' }} src={previewImage} />
                                                                                    </Modal>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>

                                                </tr>
                                            </tbody>
                                        </table>
                                        <div className="rygl-ry-data">

                                            <div className="rygl-ry-data-datatree">
                                                <DataTree
                                                    style={{ height: 283 }}
                                                    ongetfindAllByDepartment={(current, pageSize,_d)=>{this.getfindAllByDepartment(_d)}}
                                                    {...this.state}
                                                />
                                            </div>

                                            <div className="rygl-ry-data-datatable">
                                                <DataTable
                                                    style={{ height: 315 }}
                                                    closeTitle={true}
                                                    closePagination={true}
                                                    setSelectedRows={this.addsetSelectedRows}
                                                    onGetData={() => { }}
                                                    {...this.state}
                                                    datalist={this.state.addDatalist}
                                                    dataColumns={this.state.addDataColumns}
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
                                        titleText={this.state.titleText}
                                        close={() => {
                                            this.setState({
                                                newlyPopup: { switch: false }
                                            })
                                        }}
                                        ok={() => {
                                            this.deleteLeave(this.state.data.id);
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
                                    /> : this.state.newlyPopup.title === "请假单照片" ?
                                        <ElasticFrame
                                            style={{ width: 560, height: 400 }}
                                            title={this.state.newlyPopup.title}
                                            close={() => {
                                                this.setState({
                                                    newlyPopup: { switch: false }
                                                })
                                            }}

                                            renderDom={(props) => {

                                                return (
                                                    <div className="">
                                                        <img style={{ width: 545, height: 300 }} src={this.state.data.perPhoto} />
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
export default YcglQjd;