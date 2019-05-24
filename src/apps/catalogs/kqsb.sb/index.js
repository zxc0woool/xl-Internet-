
import React, { Component } from 'react';
import { Input, Modal, Upload, Select, Button, Icon, message } from 'antd';
import $ from 'jquery'
import DataTable from '../../controls/data.table';
import ElasticFrame from '../../controls/elastic.frame';
import Util from '../../../uilt/http.utils';
import './index.css';
const { TextArea } = Input;
const Option = Select.Option;
class KqsbSb extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible:false,
      data: {
        config: {}
      }, //打开的数据
      pagination: {
        total: 0,  //数据总数量
        pageSize: 50, //显示几条一页
      },
      dataText: '',
      titleText: '',
      serialNumber: '',
      parameterConfigureName: "网络参数",
      selectedRows: [],
      previewVisible: false,
      previewImage: "",
      fileList: [],

      newlyPopup: {
        title: "",
        switch: true,
      },
      titlelist: [
        { name: '刷新', icon: 'redo' },
        { name: '新增', icon: 'file-add' },
        { name: '删除', icon: 'close' }
      ],
      datalist: [],
      dataColumns: [
        {
          title: '设备编号',
          dataIndex: 'attId',
          width: 100,
        }, {
          title: '设备姓名',
          dataIndex: 'attName',
          width: 100,
        }, {
          title: '设备类型',
          dataIndex: 'attType',
          width: 100,
        }, {
          title: '设备型号',
          dataIndex: 'attModel',
          width: 100,
        }, {
          title: '设备序列号',
          dataIndex: 'attSn',
          width: 100,
        }, {
          title: 'IP地址',
          dataIndex: 'attIp',
          width: 100,
        }, {
          title: '端口号',
          dataIndex: 'attPort',
          width: 100,
        }, {
          title: '通讯密码',
          dataIndex: 'attPass',
          width: 100,
        }, {
          title: '设备应用场景',
          dataIndex: 'attScene',
          width: 100,
        }, {
          title: '操作',
          dataIndex: 'operation',
          key: 'operation',
          width: 180,
          render: (e, _d) => {
            return (
              <div className="rygl-bm-operation">
                <a onClick={() => this.newlyPopup(_d, '编辑')}>编辑</a>
                <a onClick={() => this.newlyPopup(_d, '远程配置')}>远程配置</a>
                <a onClick={() => this.newlyPopup(_d, '删除')}>删除</a>
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

    const datalist = [
      {
        key: 1,
        attId: `1`,
        attName: `人脸识别`,
        attType: ' 离线版',
        attModel: `MA5200`,
        attSn: '65326',
        attIp: '192.168.2.144', //ip 地址 
        attPort: '8090',
        attPass: '12345678',
        attScene: '',


        //新添加的  参数
        isDHCPMod: '1', //DHCP 模式选择
        gateway: '192.168.2.1', //网关 
        subnetMask: '255.255.255.0', //子网掩码
        DNS: '8.8.8.8', //DNS 服务器 

        config: {
          companyName: '人脸识别', //设备名称
          ttsModType: '2', //语音模式
          identifyDistance: '0', //识别距离
          ttsModContent: '{name}', //语音自定义
          identifyScores: '80', //识别分数
          displayModType: '1', //显示模式
          saveIdentifyTime: '0', //识别间隔
          displayModContent: '{name}', //显示自定义
          delayTimeForCloseDoor: '500', //开门延时
          multiplayerDetection: '1', //多人脸检测
          comModType: '4', //串口模式
          recStrangerType: '1', //陌生人开关
          comModContent: '#WG{idcardNum}#', //串口自定义
          recStrangerTimesThreshold: '3', //陌生人判断次数
          slogan: '请设置公司Slogan', //标语
          ttsModStrangerType: '2', //陌生人语音模式
          intro: '请设置公司简介', //公司介绍
          ttsModStrangerContent: '注意陌生人', //陌生人语音自定义
          wg: '#34WG{idcardNum}#', //韦根输出 
          recRank: '1', //照片防伪等级 

          callbackUrl: 'http://192.168.1.188:8080/project_war_exploded/reportForm/Callback.do',
          callbackHeartbeatUrl: 'http://192.168.1.188:8080/project_war_exploded/',
          callbackPhotoUrl: 'http://192.168.1.188:8080/project_war_exploded/person/addfeature.do',
        },



      }
    ];
    // this.setState({ datalist });

    this.findAll(1, this.state.pagination.pageSize);
  }
  newlyPopup = (_d, title) => {

    _d.newPass = _d.attPass //新密码复制

    this.setState({
      newlyPopup: {
        title: title,
        switch: true,
      },
      data: _d,
      dataText: ''
    })
  }

  //更新数据
  toUpdate = () => {
    setTimeout(() => {
      this.setState({
        newlyPopup: { switch: false }
      })
    }, 0)

    this.findAll(1, this.state.pagination.pageSize, "刷新成功");
  }


  setDataText = (dataText) => {
    this.setState({ dataText: this.state.dataText + '系统信息：' + dataText })
  }

  //设备新建
  addAttendance = (_data) => {

    let config = {
      companyName: '人脸识别', //设备名称
      ttsModType: '2', //语音模式
      identifyDistance: '0', //识别距离
      ttsModContent: '{name}', //语音自定义
      identifyScores: '80', //识别分数
      displayModType: '1', //显示模式
      saveIdentifyTime: '0', //识别间隔
      displayModContent: '{name}', //显示自定义
      delayTimeForCloseDoor: '500', //开门延时
      multiplayerDetection: '1', //多人脸检测
      comModType: '4', //串口模式
      recStrangerType: '1', //陌生人开关
      comModContent: '#WG{idcardNum}#', //串口自定义
      recStrangerTimesThreshold: '3', //陌生人判断次数
      slogan: '请设置公司Slogan', //标语
      ttsModStrangerType: '2', //陌生人语音模式
      intro: '请设置公司简介', //公司介绍
      ttsModStrangerContent: '注意陌生人', //陌生人语音自定义
      wg: '#34WG{idcardNum}#', //韦根输出 
      recRank: '1', //照片防伪等级 

      callbackUrl: 'http://192.168.1.188:8080/project_war_exploded/reportForm/Callback.do',
      callbackHeartbeatUrl: 'http://192.168.1.188:8080/project_war_exploded/',
      callbackPhotoUrl: 'http://192.168.1.188:8080/project_war_exploded/person/addfeature.do',
    }

    if (!_data.config) {
      _data.config = JSON.stringify(config)
    }
    if (!_data.isDHCPMod) {
      _data.isDHCPMod = '2'
    }
    if (!_data.gateway) {
      _data.gateway = '192.168.2.1'
    }
    if (!_data.subnetMask) {
      _data.subnetMask = '255.255.255.0'
    }
    if (!_data.DNS) {
      _data.DNS = '8.8.8.8'
    }
    if (!_data.attPass) {
      _data.attPass = '12345678'
    }

    if (_data.attScene === "签到/签退") {
      _data.attScene = "8"
    } else if (_data.attScene === "签到") {
      _data.attScene = "9"
    } else if (_data.attScene === "签退") {
      _data.attScene = "10"
    } else if (_data.attScene === "门禁") {
      _data.attScene = "11"
    }
    if (_data.attType === "离线版") {
      _data.attType = "4"
    }

    Util._httpPost('project_war_exploded/attendance/addAttendance.do', {
      ..._data
    }).then((params) => {

      this.findAll(1, this.state.pagination.pageSize);
      message.success(params.data.message)

    }).catch(function (error) {

    })

  }
  setSelectedRows = (selectedRows) => {
    this.setState({ selectedRows })
  }
  //删除设备
  deleteAttendance = (ids) => {
    //project_war_exploded/person/addPerson.do
    for (let key in this.state.selectedRows) {
      if (ids == "") {
        ids += this.state.selectedRows[key].attId
      } else {
        ids += ',' + this.state.selectedRows[key].attId
      }

    }

    Util._httpPost("/project_war_exploded/attendance/deleteAttendance.do", {
      attId: ids
    }).then((params) => {
      this.findAll(1, this.state.pagination.pageSize);
      message.success(params.data.message)
    }).catch((error) => {

    })

  }
  //设备查询
  findAll = (current, pageSize, text) => {
    Util._httpPost("/project_war_exploded/attendance/findAll.do", JSON.stringify({
    })).then((params) => {

      let data = [];

      for (let key in params.data.rows) {
        params.data.rows[key].key = key;
        data[key] = params.data.rows[key]
        if (data[key].attScene === "8") {
          data[key].attScene = "签到/签退"
        } else if (data[key].attScene === "9") {
          data[key].attScene = "签到"
        } else if (data[key].attScene === "10") {
          data[key].attScene = "签退"
        } else if (data[key].attScene === "11") {
          data[key].attScene = "门禁"
        }
        if (data[key].attType === "4") {
          data[key].attType = "离线版"
        }

        data[key].config = params.data.rows[key].configure ? JSON.parse(params.data.rows[key].configure) : {};
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
  //设备编辑
  updateAttendance = (_d) => {
    
    if (_d.attScene === "签到/签退") {
      _d.attScene = "8"
    } else if (_d.attScene === "签到") {
      _d.attScene = "9"
    } else if (_d.attScene === "签退") {
      _d.attScene = "10"
    } else if (_d.attScene === "门禁") {
      _d.attScene = "11"
    }

    _d.config = JSON.stringify(_d.config)
    Util._httpPost("/project_war_exploded/attendance/updateAttendance.do", JSON.stringify({
      ..._d
    })).then((params) => {

      if (params.data.flag) {
        this.findAll(1, this.state.pagination.pageSize);
        message.success(params.data.message)
      } else {
        message.error(params.data.message)
      }

    }).catch((error) => {

    })
  }

  //设置设备密码
  setPassWord = () => {
    let IP = 'http://' + this.state.data.attIp + ':' + this.state.data.attPort;
    Util.$http.post(IP + '/setPassWord', {
      oldPass: this.state.data.attPass,
      newPass: this.state.data.newPass
    }).then((params) => {
      this.setDataText(JSON.stringify(params.data) + '\n');
    }).catch(function (error) {

    })

  }

  //有线网络配置
  setNetInfo = () => {

    let ip = this.state.data.attIp;
    this.state.datalist.map((_d) => {
      if (_d.id === this.state.data.id) {
        ip = _d.attIp;
      }
    })

    let IP = 'http://' + ip + ':' + this.state.data.attPort;
    Util.$http.post(IP + '/setNetInfo', {
      pass: this.state.data.attPass,
      isDHCPMod: this.state.data.isDHCPMod,
      ip: this.state.data.attIp,
      gateway: this.state.data.gateway,
      subnetMask: this.state.data.subnetMask,
      DNS: this.state.data.DNS
    }).then((params) => {
      this.setDataText(JSON.stringify(params.data) + '\n');
    }).catch(function (error) {


    })

  }

  //WIFI网络配置
  // setWifi  = () => {
  //   let IP = 'http://'+ this.state.data.attIp + ':' + this.state.data.attPort;

  //   let json = {
  //     "ssId":"TP-LINK_E2.4G",
  //     "pwd":"test-1234",
  //     "isDHCPMod":false,
  //     "ip":"192.168.20.66",
  //     "gateway":"192.168.20.1",
  //     "dns":"8.8.8.8"
  // }

  //   Util.$http.post(IP +'/setWifi',{
  //     pass:this.state.data.pass,
  //     wifiMsg:JSON.parse(json),

  //   }).then((params) => {
  //     this.setDataText( JSON.stringify(params.data.data) + ' ' + (params.data.msg?params.data.msg:' ') +  ' success:' +  params.data.success + '\n' );
  //   }).catch(function (error) {
  //     this.setDataText( '系统错误' );
  //   })

  // }

  //设备参数
  setConfig = (e, config) => {
    let IP = 'http://' + this.state.data.attIp + ':' + this.state.data.attPort;
    Util.$http.post(IP + '/setConfig', {
      pass: this.state.data.attPass,
      config: JSON.stringify(config)
    }).then((params) => {
      this.setDataText(JSON.stringify(params.data) + '\n');
    }).catch(function (error) {

    })

  }
  //设置回调URL
  setCallbackURL = () => {

    let IP = 'http://' + this.state.data.attIp + ':' + this.state.data.attPort;

    //设备回调
    Util.$http.post(IP + '/setIdentifyCallBack', {
      pass: this.state.data.attPass,
      callbackUrl: this.state.data.config.callbackUrl
    }).then((params) => {
      this.setDataText(JSON.stringify(params.data) + '\n');
    }).catch(function (error) {

    })

    //设备心跳回调
    Util.$http.post(IP + '/setDeviceHeartBeat', {
      pass: this.state.data.attPass,
      url: this.state.data.config.callbackHeartbeatUrl
    }).then((params) => {
      this.setDataText(JSON.stringify(params.data) + '\n');
    }).catch(function (error) {

    })

    //注册照片回调
    Util.$http.post(IP + '/setImgRegCallBack', {
      pass: this.state.data.attPass,
      url: this.state.data.config.callbackPhotoUrl
    }).then((params) => {
      this.setDataText(JSON.stringify(params.data) + '\n');
    }).catch(function (error) {

    })


  }

  //修改 Logo 
  changeLogo = (e, logo) => {
    let IP = 'http://' + this.state.data.attIp + ':' + this.state.data.attPort;
    let strs = '-1';
    let sr = $('#imgForm img').attr("src");
    if (logo && sr)  {
      strs = sr.split("base64,");
    }
 
    Util.$http.post(IP + '/changeLogo', {
      pass: this.state.data.attPass,
      imgBase64: strs[1]
    }).then((params) => {
      this.setDataText(JSON.stringify(params.data) + '\n');
    }).catch(function (error) {

    })

  }


  //设备重启
  restartDevice = () => {
    let IP = 'http://' + this.state.data.attIp + ':' + this.state.data.attPort;
    Util.$http.post(IP + '/restartDevice', {
      pass: this.state.data.attPass
    }).then((params) => {
      this.setDataText(JSON.stringify(params.data) + '\n');
    }).catch(function (error) {

    })
  }

  //设备重置
  deviceReset = () => {
    let IP = 'http://' + this.state.data.attIp + ':' + this.state.data.attPort;
    Util.$http.post(IP + '/device/reset', {
      pass: this.state.data.attPass,
      delete: true
    }).then((params) => {
      this.setDataText(JSON.stringify(params.data) + '\n');
    }).catch(function (error) {

    })
  }

  //远程开门
  deviceOpenDoorControl = () => {
    let IP = 'http://' + this.state.data.attIp + ':' + this.state.data.attPort;
    Util.$http.post(IP + '/device/openDoorControl ', {
      pass: this.state.data.attPass
    }).then((params) => {
      this.setDataText(JSON.stringify(params.data) + '\n');
    }).catch(function (error) {

    })
  }
  //设置时间
  setTime = () => {
    let IP = 'http://' + this.state.data.attIp + ':' + this.state.data.attPort;
    Util.$http.post(IP + '/setTime ', {
      pass: this.state.data.attPass,
      timestamp: new Date().getTime()
    }).then((params) => {
      this.setDataText(JSON.stringify(params.data) + '\n');
    }).catch(function (error) {

    })
  }

  //获取序列号
  getDeviceKey = () => {
    let IP = 'http://' + this.state.data.attIp + ':' + this.state.data.attPort;
    Util.$http.post(IP + '/getDeviceKey  ', {
    }).then((params) => {
      
      this.setState({ data: {...this.state.data,attSn:params.data.data }});

      this.setDataText(JSON.stringify(params.data) + '\n');
    }).catch(function (error) {

    })
  }




  parameterConfigure = (e, parameterConfigureName) => {
    this.setState({ parameterConfigureName });
  }

  handleCancel = () => {
    this.setState({ previewVisible: false })
  }

  handlePreview = (file) => {

    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }

  handleChange = ({ fileList }) => {
    this.setState({ fileList })
  }

  render() {

    let { config } = this.state.data
    let { previewImage, previewVisible, fileList } = this.state
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">预览</div>
      </div>
    );

    return (
      <div className="kqsb-sb">
        <div className="kqsb-sb-data">

          <div className="kqsb-sb-data-datatable">
            <DataTable setSelectedRows={this.setSelectedRows} onGetData={this.findAll} onNewlyPopup={this.newlyPopup} {...this.state} />
          </div>
          {
            //弹出框
            this.state.newlyPopup.switch ?
              this.state.newlyPopup.title === "新增" || this.state.newlyPopup.title === "编辑" ?
                <ElasticFrame
                  style={{ width: 260, height: 410 }}
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

                      if (
                        this.state.data.attId && this.state.data.attId !== "" &&
                        this.state.data.attName && this.state.data.attName !== "" &&
                        this.state.data.attType && this.state.data.attType !== "" &&
                        this.state.data.attSn && this.state.data.attSn !== "" &&
                        this.state.data.attPort && this.state.data.attPort !== "" &&
                        this.state.data.attPass && this.state.data.attPass !== ""
                      ) {
                        if (title === "新增") {
                          this.addAttendance(this.state.data);
                        } else if (title === "编辑") {
                          this.updateAttendance(this.state.data);
                        }

                      } else {
                        // this.setState({
                        //   titleText:'带 * 不得为空！'
                        // });
                        message.info("带 * 不得为空！")
                        this.newlyPopup(this.state.data, title)
                      }

                    })
                  }}
                  renderDom={(props) => {
                    return (
                      <div className="kqsb-sb_newly_added">
                        <div className="kqsb-sb_tableStyle">
                          <div className="kqsb-sb_tableStyle_div"><label>设备号 <span className="required">*</span></label>
                            <Input type="text" value={this.state.data.attId} onChange={(e) => this.setState({ data: { ...this.state.data, attId: e.target.value } })} className="valid" />
                          </div>
                          <div className="kqsb-sb_tableStyle_div"><label>设备名称 <span className="required">*</span></label>
                            <Input type="text" value={this.state.data.attName} onChange={(e) => this.setState({ data: { ...this.state.data, attName: e.target.value } })} className="valid" />
                          </div>
                          <div className="kqsb-sb_tableStyle_div">
                            <label>设备类型 <span className="required">*</span></label>
                            <Select value={this.state.data.attType} onChange={(value) => this.setState({ data: { ...this.state.data, attType: value } })} id="certType">
                              <Option value='4'>离线版</Option>
                            </Select>
                          </div>
                          {/* <div className="kqsb-sb_tableStyle_div">
                            <label>连机方式 <span className="required">*</span></label>
                            <Select  value={this.state.data.attModel} onChange={(e) => this.setState({ data: { ...this.state.data, attModel: e.target.value } })} id="certType">
                              <Option value='1'>TCP/IP通讯</Option>
                              <Option value='2'>UDB通讯</Option>
                              <Option value='3'>代理通讯</Option>
                            </Select>
                          </div> */}
                          <div className="kqsb-sb_tableStyle_div"><label>设备序列号<span className="required">*</span></label>
                            <Input type="text" value={this.state.data.attSn} onChange={(e) => this.setState({ data: { ...this.state.data, attSn: e.target.value } })} className="valid" />
                          </div>

                          <div className="kqsb-qy_tableStyle_div"><label>IP地址<span className="required">*</span></label>
                            <Input type="text" value={this.state.data.attIp} onChange={(e) => this.setState({ data: { ...this.state.data, attIp: e.target.value } })} className="valid" />
                          </div>

                          <div className="kqsb-qy_tableStyle_div"><label>通讯端口<span className="required">*</span></label>
                            <Input type="text" value={this.state.data.attPort} onChange={(e) => this.setState({ data: { ...this.state.data, attPort: e.target.value } })} className="valid" />
                          </div>

                          <div className="kqsb-qy_tableStyle_div"><label>通讯密码<span className="required">*</span></label>
                            <Input type="text" value={this.state.data.attPass} onChange={(e) => this.setState({ data: { ...this.state.data, attPass: e.target.value } })} className="valid" />
                          </div>
                          {/* <div className="kqsb-qy_tableStyle_div"><label>MAC地址</label>
                            <Input type="text" value={this.state.data.attIp} onChange={(e) => this.setState({ data: { ...this.state.data, ip: e.target.value } })} className="valid" />
                          </div> */}
                          <div className="kqsb-qy_tableStyle_div"><label>方向</label>
                            <Select value={this.state.data.attScene} onChange={(value) => this.setState({ data: { ...this.state.data, attScene: value } })} id="certType">
                              <Option value='8'>签到/签退</Option>
                              <Option value='9'>签到</Option>
                              <Option value='10'>签退</Option>
                              <Option value='11'>门禁</Option>
                            </Select>
                          </div>
                          <div className="required">
                            {this.state.titleText}
                          </div>

                        </div>
                      </div>
                    )
                  }}
                /> : this.state.newlyPopup.title === "远程配置" ?
                  <ElasticFrame
                    style={{ width: 800, height: 670 }}
                    title={this.state.newlyPopup.title}
                    titleText={""}
                    close={() => {
                      this.setState({
                        newlyPopup: { switch: false }
                      })
                    }}
                    ok={() => {


                      this.updateAttendance(this.state.data);
                      this.setState({
                        newlyPopup: { switch: false }
                      })
                      // Util._httpPost('project_war_exploded/attendance/editConfigure.do', {
                      //   ...this.state.data,
                      //   config: JSON.stringify(config)
                      // }).then((params) => {
                      //   this.setState({
                      //     newlyPopup: { switch: false }
                      //   })
                      //   this.findAll(1, this.state.pagination.pageSize);
                      //   message.success(params.data.message);
                      // }).catch(function (error) {

                      // })
                    }}
                    renderDom={(props) => {

                      return (
                        <div className="kqsb-sb_newly_added">

                          <div className="kqsb-sb-left-title">
                            <div className={this.state.parameterConfigureName === '网络参数' ? "kqsb-sb-left-title-name selection" : 'kqsb-sb-left-title-name'} onClick={(e) => this.parameterConfigure(e, '网络参数')}>网络参数</div>
                            <div className={this.state.parameterConfigureName === '基本参数' ? "kqsb-sb-left-title-name selection" : 'kqsb-sb-left-title-name'} onClick={(e) => this.parameterConfigure(e, '基本参数')}>基本参数</div>
                            <div className={this.state.parameterConfigureName === '回调参数' ? "kqsb-sb-left-title-name selection" : 'kqsb-sb-left-title-name'} onClick={(e) => this.parameterConfigure(e, '回调参数')}>回调参数</div>
                            <div className={this.state.parameterConfigureName === '显示参数' ? "kqsb-sb-left-title-name selection" : 'kqsb-sb-left-title-name'} onClick={(e) => this.parameterConfigure(e, '显示参数')}>显示参数</div>
                            <div className={this.state.parameterConfigureName === '远程操作' ? "kqsb-sb-left-title-name selection" : 'kqsb-sb-left-title-name'} onClick={(e) => this.parameterConfigure(e, '远程操作')}>远程操作</div>
                          </div>

                          <div className={this.state.parameterConfigureName === '网络参数' ? "kqsb-sb_newly_added-body" : 'displayNone'}>
                            <div className="box_border" style={{ height: 66 }}>
                              <span className="box_border_title">通讯密码：<Button onClick={this.setPassWord} type="primary">密码设置</Button></span>
                              <div className="kqsb-sb_tableStyle_div"><label>原密码 </label><Input type="text" value={this.state.data.attPass} onChange={(e) => this.setState({ data: { ...this.state.data, attPass: e.target.value } })} className="valid" /></div>
                              <div className="kqsb-sb_tableStyle_div required"><label>新密码 </label><Input type="text" value={this.state.data.newPass} onChange={(e) => this.setState({ data: { ...this.state.data, newPass: e.target.value } })} className="valid" /></div>
                            </div>

                            <div className="box_border" style={{ height: 140 }}>
                              <span className="box_border_title">网络参数：<Button onClick={() => { this.setNetInfo(this.state.data) }} type="primary">设置</Button></span>
                              <div className="kqsb-sb_tableStyle_div required"><label>设置IP</label>
                                <Input type="text" value={this.state.data.attIp} onChange={(e) => this.setState({ data: { ...this.state.data, attIp: e.target.value } })} className="valid" />
                              </div>
                              <div className="kqsb-sb_tableStyle_div"><label>子网掩码</label>
                                <Input type="text" value={this.state.data.subnetMask} onChange={(e) => this.setState({ data: { ...this.state.data, subnetMask: e.target.value } })} className="valid" />
                              </div>
                              <div className="kqsb-sb_tableStyle_div"><label>网关</label>
                                <Input type="text" value={this.state.data.gateway} onChange={(e) => this.setState({ data: { ...this.state.data, gateway: e.target.value } })} className="valid" />
                              </div>
                              <div className="kqsb-sb_tableStyle_div"><label>NDS</label>
                                <Input type="text" value={this.state.data.DNS} onChange={(e) => this.setState({ data: { ...this.state.data, DNS: e.target.value } })} className="valid" />
                              </div>
                              <div className="kqsb-sb_tableStyle_div"><label>IP获取模式</label>
                                <Select value={this.state.data.isDHCPMod} onChange={(value) => this.setState({ data: { ...this.state.data, isDHCPMod: value } })}>
                                  <Option value="2">手动配置模式</Option>
                                  <Option value="1">DHCP模式</Option>
                                </Select>
                              </div>
                            </div>

                            {/* <div className="box_border" style={{height: 140}}> 
                              <span className="box_border_title">WIFI参数：<Button type="primary">设置</Button></span>
                              <div className="kqsb-sb_tableStyle_div"><label>WIFI名称 </label><Input type="text" className="valid" /></div>
                              <div className="kqsb-sb_tableStyle_div"><label>WIFI密码 </label><Input type="text" className="valid" /></div>
                              <div className="kqsb-sb_tableStyle_div"><label>IP </label><Input type="text" className="valid" /></div>
                              <div className="kqsb-sb_tableStyle_div"><label>网关 </label><Input type="text" className="valid" /></div>
                              <div className="kqsb-sb_tableStyle_div"><label>NDS </label><Input type="text" className="valid" /></div>
                              <div className="kqsb-sb_tableStyle_div"><label>IP获取模式 </label>
                                <Select defaultValue="lucy1">
                                  <Option value="lucy1">手动配置模式</Option>
                                  <Option value="lucy2">DHCP模式</Option>
                                </Select>
                              </div>
                            </div> */}

                          </div>
                          <div className={this.state.parameterConfigureName === '基本参数' ? "kqsb-sb_newly_added-body" : 'displayNone'}>

                            <div className="box_border" style={{ height: 390 }}>
                              <span className="box_border_title">设备参数：<Button onClick={(e) => this.setConfig(e, config)} type="primary">设置参数</Button></span>

                              <div className="kqsb-sb_tableStyle_div"><label>设备名称</label>
                                <Input value={config.companyName} onChange={(e) => this.setState({ data: { ...this.state.data, config: { ...this.state.data.config, companyName: e.target.value } } })} type="text" className="valid" />
                              </div>
                              <div className="kqsb-sb_tableStyle_div"><label>语音模式</label>

                                <Select value={config.ttsModType} onChange={(value) => this.setState({ data: { ...this.state.data, config: { ...this.state.data.config, ttsModType: value } } })} >
                                  <Option value="1">不需要语音播报</Option>
                                  <Option value="2">播报名字</Option>
                                  <Option value="100">自定义</Option>
                                </Select>
                              </div>
                              <div className="kqsb-sb_tableStyle_div"><label>识别距离</label>
                                <Select value={config.identifyDistance} onChange={(value) => this.setState({ data: { ...this.state.data, config: { ...this.state.data.config, identifyDistance: value } } })} >
                                  <Option value="0">无限制</Option>
                                  <Option value="1">0.5米以内</Option>
                                  <Option value="2">1米以内</Option>
                                  <Option value="3">1.5米以内</Option>
                                  <Option value="4">2米以内</Option>
                                  <Option value="5">3米以内</Option>
                                  <Option value="6">4米以内</Option>
                                </Select>
                              </div>
                              <div className="kqsb-sb_tableStyle_div"><label>语音自定义</label>
                                <Input value={config.ttsModContent} onChange={(e) => this.setState({ data: { ...this.state.data, config: { ...this.state.data.config, ttsModContent: e.target.value } } })} type="text" className="valid" />
                              </div>
                              <div className="kqsb-sb_tableStyle_div"><label>识别分数</label>
                                <Input value={config.identifyScores} onChange={(e) => this.setState({ data: { ...this.state.data, config: { ...this.state.data.config, identifyScores: e.target.value } } })} type="text" className="valid" />
                              </div>
                              <div className="kqsb-sb_tableStyle_div"><label>显示模式</label>
                                <Select value={config.displayModType} onChange={(value) => this.setState({ data: { ...this.state.data, config: { ...this.state.data.config, displayModType: value } } })} >
                                  <Option value="1">显示名字</Option>
                                  <Option value="100">自定义</Option>
                                </Select>
                              </div>
                              <div className="kqsb-sb_tableStyle_div"><label>识别间隔</label>
                                <Input value={config.saveIdentifyTime} onChange={(e) => this.setState({ data: { ...this.state.data, config: { ...this.state.data.config, saveIdentifyTime: e.target.value } } })} type="text" className="valid" />
                              </div>
                              <div className="kqsb-sb_tableStyle_div"><label>显示自定义</label>
                                <Input value={config.displayModContent} onChange={(e) => this.setState({ data: { ...this.state.data, config: { ...this.state.data.config, displayModContent: e.target.value } } })} type="text" className="valid" />
                              </div>
                              <div className="kqsb-sb_tableStyle_div"><label>开门延时</label>
                                <Input value={config.delayTimeForCloseDoor} onChange={(e) => this.setState({ data: { ...this.state.data, config: { ...this.state.data.config, delayTimeForCloseDoor: e.target.value } } })} type="text" className="valid" />ms
                                </div>
                              <div className="kqsb-sb_tableStyle_div"><label>多人脸检测</label>
                                <Select value={config.multiplayerDetection} onChange={(value) => this.setState({ data: { ...this.state.data, config: { ...this.state.data.config, multiplayerDetection: value } } })} >
                                  <Option value="1">识别多人脸</Option>
                                  <Option value="2">识别最大人脸</Option>
                                </Select>
                              </div>
                              <div className="kqsb-sb_tableStyle_div"><label>串口模式</label>
                                <Select value={config.comModType} onChange={(value) => this.setState({ data: { ...this.state.data, config: { ...this.state.data.config, comModType: value } } })} >
                                  <Option value="1">开门</Option>
                                  <Option value="2">不输出</Option>
                                  <Option value="3">输出人员 ID</Option>
                                  <Option value="4">输出身份证 / IC卡号</Option>
                                  <Option value="100">自定义</Option>
                                </Select>
                              </div>
                              <div className="kqsb-sb_tableStyle_div"><label>陌生人开关</label>
                                {/* <Input value={config.recStrangerType} onChange={(e) => this.setState({ data: { ...this.state.data, config: { ...this.state.data.config, recStrangerType: e.target.value } } })} type="text" className="valid" /> */}
                                <Select value={config.recStrangerType} onChange={(value) => this.setState({ data: { ...this.state.data, config: { ...this.state.data.config, recStrangerType: value } } })} >
                                  <Option value="1">识别</Option>
                                  <Option value="2">不识别</Option>
                                </Select>
                              </div>
                              <div className="kqsb-sb_tableStyle_div"><label>串口自定义</label>
                                <Input value={config.comModContent} onChange={(e) => this.setState({ data: { ...this.state.data, config: { ...this.state.data.config, comModContent: e.target.value } } })} type="text" className="valid" />
                              </div>
                              <div className="kqsb-sb_tableStyle_div"><label>陌生人判断次数</label>
                                <Input value={config.recStrangerTimesThreshold} onChange={(e) => this.setState({ data: { ...this.state.data, config: { ...this.state.data.config, recStrangerTimesThreshold: e.target.value } } })} type="text" className="valid" />
                              </div>
                              <div className="kqsb-sb_tableStyle_div"><label>标语</label>
                                <Input value={config.slogan} onChange={(e) => this.setState({ data: { ...this.state.data, config: { ...this.state.data.config, slogan: e.target.value } } })} type="text" className="valid" />
                              </div>
                              <div className="kqsb-sb_tableStyle_div"><label>陌生人语音模式</label>
                                <Select value={config.ttsModStrangerType} onChange={(value) => this.setState({ data: { ...this.state.data, config: { ...this.state.data.config, ttsModStrangerType: value } } })} >
                                  <Option value="1">不需要语音播报</Option>
                                  <Option value="2">陌生人警报</Option>
                                  <Option value="100">自定义</Option>
                                </Select>
                              </div>
                              <div className="kqsb-sb_tableStyle_div"><label>公司介绍</label>
                                <Input value={config.intro} onChange={(e) => this.setState({ data: { ...this.state.data, config: { ...this.state.data.config, intro: e.target.value } } })} type="text" className="valid" />
                              </div>
                              <div className="kqsb-sb_tableStyle_div"><label>陌生人语音自定义</label>
                                <Input value={config.ttsModStrangerContent} onChange={(e) => this.setState({ data: { ...this.state.data, config: { ...this.state.data.config, ttsModStrangerContent: e.target.value } } })} type="text" className="valid" />
                              </div>
                              <div className="kqsb-sb_tableStyle_div"><label>韦根输出</label>
                                <Select value={config.wg} onChange={(value) => this.setState({ data: { ...this.state.data, config: { ...this.state.data.config, wg: value } } })} >
                                  <Option value="#WG{idcardNum}#">输出卡号(WG26)</Option>
                                  <Option value="#WG{id}#">输出人员ID(WG26)</Option>
                                  <Option value="#34WG{idcardNum}#">输出卡号(WG34)</Option>
                                  <Option value="#34WG{id}#">输出人员ID(WG34)</Option>
                                </Select>
                              </div>
                              <div className="kqsb-sb_tableStyle_div"><label>照片防伪等级</label>
                                <Select value={config.recRank} onChange={(value) => this.setState({ data: { ...this.state.data, config: { ...this.state.data.config, recRank: value } } })} >
                                  <Option value="1">不带活体</Option>
                                  <Option value="3">活体识别</Option>
                                </Select>
                              </div>
                            </div>


                          </div>
                          <div className={this.state.parameterConfigureName === '回调参数' ? "kqsb-sb_newly_added-body" : 'displayNone'}>

                            <div className="box_border" style={{ height: 140 }}>
                              <span className="box_border_title">设置回调URL：<Button onClick={this.setCallbackURL} type="primary">设置</Button></span>
                              <div style={{ width: '100%' }} className="kqsb-sb_tableStyle_div box_border_input"><label>识别回调URL</label>
                                <Input value={this.state.data.config.callbackUrl} onChange={(e) => this.setState({ data: { ...this.state.data, config: { ...this.state.data.config, callbackUrl: e.target.value } } })} type="text" className="valid" />
                              </div>
                              <div style={{ width: '100%' }} className="kqsb-sb_tableStyle_div box_border_input"><label>设置心跳URL</label>
                                <Input value={this.state.data.config.callbackHeartbeatUrl} onChange={(e) => this.setState({ data: { ...this.state.data, config: { ...this.state.data.config, callbackHeartbeatUrl: e.target.value } } })} type="text" className="valid" />
                              </div>
                              <div style={{ width: '100%' }} className="kqsb-sb_tableStyle_div box_border_input"><label>拍照注册URL</label>
                                <Input value={this.state.data.config.callbackPhotoUrl} onChange={(e) => this.setState({ data: { ...this.state.data, config: { ...this.state.data.config, callbackPhotoUrl: e.target.value } } })} type="text" className="valid" />
                              </div>
                            </div>

                          </div>
                          <div className={this.state.parameterConfigureName === '显示参数' ? "kqsb-sb_newly_added-body" : 'displayNone'}>

                            {/* <div className="box_border" style={{ height: 140 }}>
                                <span className="box_border_title">设置屏幕方向：<Button onClick={this.setCallbackURL} type="primary">设置</Button></span>
                                <Select value={config.recRank} onChange={(value) => this.setState({ data: { ...this.state.data, config: { ...this.state.data.config, recRank: value } } })} >
                                    <Option value="1">横屏</Option>
                                    <Option value="2">竖屏</Option>
                                </Select>   
                            </div> */}
                            <div className="box_border" style={{ height: 140 }}>
                              <span className="box_border_title">修改Logo：<Button onClick={(e) => this.changeLogo(e, true)} type="primary">修改Logo</Button><Button onClick={(e) => this.changeLogo(e, false)} type="primary">删除Logo</Button></span>
                              <div id="imgForm">
                                <Upload
                                  // action="//jsonplaceholder.typicode.com/posts/"
                                  listType="picture-card"
                                  accept="image/jpeg,image/jpg,image/bmp"
                                  fileList={fileList}
                                  onPreview={this.handlePreview}
                                  onChange={this.handleChange}
                                >
                                  {fileList.length >= 1 ? null : uploadButton}
                                </Upload>
                              </div>
                              <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                                <img id="" alt="example" style={{ width: '100%' }} src={previewImage} />
                              </Modal>

                            </div>
                            {/* <div className="box_border" style={{ height: 140 }}>
                                <span className="box_border_title">设置屏幕方向：<Button onClick={this.setCallbackURL} type="primary">设置</Button></span>
                                <Select value={config.recRank} onChange={(value) => this.setState({ data: { ...this.state.data, config: { ...this.state.data.config, recRank: value } } })} >
                                    <Option value="1">横屏</Option>
                                    <Option value="2">竖屏</Option>
                                </Select>   
                            </div> */}



                          </div>
                          <div className={this.state.parameterConfigureName === '远程操作' ? "kqsb-sb_newly_added-body" : 'displayNone'}>

                            <div className="box_border" style={{ height: 102 }}>
                              <div className="kqsb-sb_tableStyle_div" style={{ width: '100%' }}><label>序列号</label>
                                <Input type="text" value={this.state.data.attSn} className="valid" />
                                <Button onClick={this.getDeviceKey}>读序列号</Button>
                              </div>
                              <Button onClick={this.setTime}>设置时间</Button>
                              <Button onClick={this.restartDevice}>重启设备</Button>
                              <Button onClick={() => {
                                this.setState({
                                  visible: true,
                                });
                               
                              }}>设备重置</Button>
                              <Button onClick={this.deviceOpenDoorControl}>远程开门</Button>

                            </div>

                          </div>

                          <div className="kqsb-sb_newly_added-body_information">

                            <fieldset className="selected_accLevel_fieldset">
                              <legend style={{ border: 0 }}>信息</legend>
                              <div className="sub_selectedAccLevel">
                                <TextArea value={this.state.dataText} rows={4}> </TextArea>


                              </div>

                            </fieldset>

                          </div>
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
                        this.deleteAttendance(this.state.data.attId);
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
        <Modal
          title="设备重置"
          visible={this.state.visible}
          onOk={()=>{
            this.setState({
              visible: false,
            });
            this.deviceReset()
          }}
          onCancel={()=>{
            this.setState({
              visible: false,
            });
          }}
        >
          <p> 你确定设备重置吗？</p>
        </Modal>

      </div>
    );
  }
}

export default KqsbSb;