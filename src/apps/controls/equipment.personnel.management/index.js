

import React, { Component } from 'react';
import { Layout, Button, Input, Icon, message, Checkbox, Spin } from 'antd'
import DataTree from '../../controls/data.tree';
import DataTreeCheckList from '../../controls/data.tree.check.list';
import DataTable from '../../controls/data.table';
import ElasticFrame from '../../controls/elastic.frame';
import Util from '../../../uilt/http.utils';
import TextArea from '../text.area';
import './index.css';

const { Header } = Layout;
// const { TextArea } = Input;
let totalProgress = 0;
class EquipmentPersonnelManagement extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: {},
      loading: false,
      superStatus: '',
      testName: "",
      userName: "",
      titleText: "",
      dataText: "",
      totalProgress: 0,
      time: 0,
      isImplement: false,
      AllPersonnel: false,
      equipment: [],
      equipmentPhotoList: [],
      equipmentPhotoFaceIdList: [],
      pagination: {
        total: 0,  //数据总数量
        pageSize: 50, //显示几条一页
      },
      newlyPopup: {
        title: "",
        switch: true,
      },
      titlelist: [
        // { name: '刷新', icon: 'redo' }
      ],
      datalist: [],
      dataColumns: [
        {
          title: '编号',
          dataIndex: 'perId',
          width: 50,
        }, {
          title: '姓名',
          dataIndex: 'perName',
          width: 50,
        }, {
          title: '卡号',
          dataIndex: 'cardNumber',
          width: 150,
        }, {
          title: '照片操作',
          dataIndex: 'dictName',
          key: 'operation',
          width: 110,
          render: (e, _d) => {
            return <div className="rygl-bm-operation">
              <Button style={{ height: 24 }} onClick={() => this.setFaceTakeImg(_d)} disabled={_d.perPhoto !== undefined}>注册</Button>
              <Button style={{ height: 24 }} onClick={() => { this.faceFind(_d) }}>查看</Button>
            </div>
          },
        }
      ],
      selectedRows: [],
      leftDatalist: [],
      rightDatalist: []
    }
  }
  componentDidMount() {
    this.getDepartment();
    this.findAll();
    this.onGetData(1, this.state.pagination.pageSize);
  }

  onGetData = (current, pageSize) => {
    this.setState({ loading: true });
    Util._httpPost("/project_war_exploded/person/importEquipment.do", JSON.stringify({

    })).then((params) => {
      let data = [];
      for (let key in params.data.rows) {
        params.data.rows[key].key = key;
        data[key] = params.data.rows[key]
      }
      this.setState({
        datalist: data,
        lodatalist: data,
        loading: false,
        pagination: {
          total: params.data.total,  //数据总数量
          pageSize: pageSize, //显示几条一页
        }
      })

    }).catch((error) => {

    })

  }

  search = (testName) => {
    let data = this.state.lodatalist;
    let list = [];
    for (let key in this.state.lodatalist) {
      if (data[key].perId.toString().indexOf(testName) !== -1) {
        list.push(data[key]);
      } else if (data[key].perName && data[key].perName.indexOf(testName) !== -1) {
        list.push(data[key]);
      } else if (data[key].cardNumber && data[key].cardNumber.toString().indexOf(testName) !== -1) {
        list.push(data[key]);
      } else if (data[key].account && data[key].account.toString().indexOf(testName) !== -1) {
        list.push(data[key]);
      } else if (data[key].departmentId && data[key].departmentId.toString() === testName) {
        list.push(data[key]);
      } else if (!data[key].perPhoto && '照片注册'.indexOf(testName) !== -1) {
        list.push(data[key]);
      }


    }
    // for (let key in list) {
    //   list[key].key = key;
    // }
    this.setState({
      testName: testName,
      datalist: list,
      pagination: {
        ...this.state.pagination,
        total: list.length  //数据总数量

      }
    })
  }
  searchDepartment = (testName) => {
    let data = this.state.lodatalist;
    let list = [];
    for (let key in this.state.lodatalist) {
      if (data[key].departmentId && data[key].departmentId.toString() === testName) {
        list.push(data[key]);
      }

    }

    this.setState({
      datalist: list,
      pagination: {
        ...this.state.pagination,
        total: list.length  //数据总数量

      }
    })
  }


  //拍照注册
  setFaceTakeImg = (_d) => {
    let _this = this;
    let { equipment } = this.state
    let equipmentIndex = equipment.length
    for (let key in equipment) {
      if (JSON.stringify(equipment[key]) === '{}') {
        equipment.splice(key, 1);
        equipmentIndex = equipment.length
        break;
      }
    }
    if (equipmentIndex !== 1) return this.setDataText("请选择一个设备后再照片注册");
    let IP = 'http://' + equipment[0].attIp + ':' + equipment[0].attPort;
    Util.$http.post(IP + '/face/takeImg', {
      pass: equipment[0].attPass,
      personId: _d.perId
    }).then((params) => {
      this.setDataText(JSON.stringify(params.data));

      if (params.data.success) {
        let heartbeat = setInterval(() => {
          //从设备获取照片
          Util.$http.post(IP + '/face/find', {
            pass: equipment[0].attPass,
            personId: _d.perId
          }).then((params) => {

            if (params.data.success) {

              clearInterval(heartbeat);

              //提交保存图片
              Util._httpPost('project_war_exploded/person/insertPersonPhoto.do', {
                perId: _d.perId,
                datalist: params.data.data
              }).then((params) => {

                if (params.data.success) {
                  this.onGetData(1, this.state.pagination.pageSize);
                  this.setState({
                    equipmentPhotoList: params.data.datalist
                  })
                } else {

                }

              }).catch(function (error) {
                _this.setDataText('系统错误');
              })



              this.newlyPopup(_d, "设备人员照片管理")
            } else {

            }

          }).catch(function (error) {
            _this.setDataText('系统错误');
          })

        }, 1000);
      }


    }).catch(function (error) {
      _this.setDataText('系统错误');
    })





  }
  //从设备获取照片
  faceFind = (_d) => {
    let _this = this;
    let { equipment } = this.state
    let equipmentIndex = equipment.length
    for (let key in equipment) {
      if (JSON.stringify(equipment[key]) === '{}') {
        equipment.splice(key, 1);
        equipmentIndex = equipment.length
        break;
      }
    }
    if (equipmentIndex !== 1) return this.setDataText("请选择一个设备后再照片查看");

    let IP = 'http://' + equipment[0].attIp + ':' + equipment[0].attPort;
    Util.$http.post(IP + '/face/find', {
      pass: equipment[0].attPass,
      personId: _d.perId
    }).then((params) => {

      this.setDataText(JSON.stringify(params.data));
      if (params.data.success) {

        //转换图片
        Util._httpPost('project_war_exploded/person/Transformation.do', {
          datalist: params.data.data
        }).then((params) => {

          if (params.data.success) {
            this.setState({
              equipmentPhotoList: params.data.datalist
            })
          } else {

          }

        }).catch(function (error) {
          _this.setDataText('系统错误');
        })

        this.newlyPopup(_d, "设备人员照片管理")
      } else {

      }

    }).catch(function (error) {
      _this.setDataText('系统错误');
    })

  }



  imgReady = (() => {
    var list = [], intervalId = null,
      // 用来执行队列
      tick = () => {
        var i = 0;
        for (; i < list.length; i++) {
          list[i].end ? list.splice(i--, 1) : list[i]();
        };
        !list.length && stop();
      },
      // 停止所有定时器队列
      stop = () => {
        clearInterval(intervalId);
        intervalId = null;
      };
    return (url, ready, load, error) => {
      var onready, width, height, newWidth, newHeight,
        img = new Image();
      img.src = url;
      // 如果图片被缓存，则直接返回缓存数据
      if (img.complete) {
        ready.call(img);
        load && load.call(img);
        return;
      };
      width = img.width;
      height = img.height;
      // 加载错误后的事件
      img.onerror = () => {
        error && error.call(img);
        onready.end = true;
        img = img.onload = img.onerror = null;
      };
      // 图片尺寸就绪
      onready = () => {
        newWidth = img.width;
        newHeight = img.height;
        if (newWidth !== width || newHeight !== height || newWidth * newHeight > 1024) {
          // 如果图片已经在其他地方加载可使用面积检测
          ready.call(img);
          onready.end = true;
        };
      };
      onready();
      // 完全加载完毕的事件
      img.onload = () => {
        // onload在定时器时间差范围内可能比onready快
        // 这里进行检查并保证onready优先执行
        !onready.end && onready();
        load && load.call(img);
        // IE gif动画会循环执行onload，置空onload即可
        img = img.onload = img.onerror = null;
      };
      // 加入队列中定期执行
      if (!onready.end) {
        list.push(onready);
        // 无论何时只允许出现一个定时器，减少浏览器性能损耗
        if (intervalId === null) intervalId = setInterval(tick, 40);
      };
    };
  })();




  //部门查询
  getDepartment = () => {
    Util._httpPost("/project_war_exploded/department/selecttree.do", JSON.stringify({
    })).then((params) => {
      this.setState({
        leftDatalist: params.data.rows
      })
    }).catch((error) => {

    })
  }

  //设备查询
  findAll = () => {
    Util._httpPost("/project_war_exploded/attendance/findAll.do", JSON.stringify({
    })).then((params) => {
      this.setState({
        rightDatalist: params.data.rows
      })
    }).catch((error) => {

    })
  }

  //从设备中拉取人员到系统中
  pullData = () => {
    let { equipment } = this.state
    let equipmentIndex = equipment.length
    for (let key in equipment) {
      if (JSON.stringify(equipment[key]) === '{}') {
        equipment.splice(key, 1);
        break;
      }
    }
    if (!equipmentIndex) return this.setDataText('请选择下载信息的设备');
    this.setDataText('从设备中拉取人员到系统中请稍后...');
    Util._httpPost("/project_war_exploded/person/pullData.do", JSON.stringify({
      datalist: equipment
    })).then((params) => {

      // if (params.data.msg) {
      //   params.data.msg.map((_d, index) => {
      //     this.setDataText("下载人员 >>> 姓名：'" + _d.name + "'  id：'" + _d.PerId + "' 【设备信息】：设备名 '" + _d.attName + "' " + JSON.stringify(_d));
      //   })
      //   this.onGetData(1, this.state.pagination.pageSize);
      // }

      if (params.data.flag) {
        let d = window.setInterval(() => {

          Util._httpPost("/project_war_exploded/person/getMsg.do", JSON.stringify({
          })).then((params) => {

            if (params.data.flag) {
              let text = "";
              params.data.msg.map((_d, index) => {
                text += '系统信息：' + "下载人员 >>>" + JSON.stringify(_d) + '\n';
              })

              this.setState({
                dataText: this.state.dataText + text,
                totalProgress: params.data.Percentage
              })
              if (params.data.finish) {
                window.clearInterval(d);
              }
              this.onGetData(1, this.state.pagination.pageSize);
            } else {
              window.clearInterval(d);
            }

          }).catch((error) => {

          })

        }, 1000)
        message.success(params.data.message)
      } else {
        message.error(params.data.message)
        this.setDataText('用户：' + params.data.message);
      }

    }).catch((error) => {

    })




  }

  //通过部门查询人员
  getfindAllByDepartment = (_d) => {
    Util._httpPost("/project_war_exploded/person/importEquipment.do", JSON.stringify({
      departId: _d.id + '',
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
  setDataText = (dataText, ser) => {
    if (!ser) {
      this.setState({ dataText: this.state.dataText + '系统信息：' + dataText + '\n' })
    } else {
      this.setState({ dataText: dataText })
    }

  }
  onChange = (e) => {
    this.setState({
      AllPersonnel: e.target.checked
    })
    // console.log(`checked = ${e.target.checked}`);
  }
  //上传人员信息
  setPersonCreate = () => {
    let _this = this;
    let { equipment, selectedRows } = this.state
    if (this.state.AllPersonnel) {
      selectedRows = this.state.datalist
    }
    for (let key in equipment) {
      if (JSON.stringify(equipment[key]) === '{}') {
        equipment.splice(key, 1);
        break;
      }
    }

    let selectedRowsIndex = selectedRows.length
    let equipmentIndex = equipment.length
    // let ks = new Date().getTime();
    // let js = 0;
    totalProgress = 0;
    let add = 100 / ((selectedRowsIndex * equipmentIndex) * 2);


    if (!selectedRowsIndex) this.setDataText('请选择导入人员');
    if (!equipmentIndex) this.setDataText('请选择导入设备');
    this.setDataText('正在导入数据，请稍后...');
    this.setState({
      totalProgress: (parseInt(totalProgress) === 99 ? 100 : parseInt(totalProgress)),
      isImplement: true
    })
    let datas = {};
    let text = "";
    let dI = window.setInterval(() => {
      if ((parseInt(totalProgress) === 99 ? 100 : parseInt(totalProgress)) === 100) {
        window.clearInterval(dI);
      }
      this.setState({
        totalProgress: (parseInt(totalProgress) === 99 ? 100 : parseInt(totalProgress))
      })
      this.setDataText(text, true)
    }, 500)


    for (let key in equipment) { // 设备
      for (let i in selectedRows) { // 人员
        let person = {
          name: selectedRows[i].perName,
          id: selectedRows[i].perId,
          idcardNum: selectedRows[i].cardNumber,
        }

        let IP = 'http://' + equipment[key].attIp + ':' + equipment[key].attPort;
        //人员注册
        Util.$http.post(IP + '/person/create', {
          pass: equipment[key].attPass,
          person: JSON.stringify(person)
        }).then((params) => {
          totalProgress += add
          if (params.data !== "" && !params.data.success) {

            Util.$http.post(IP + '/person/update', {
              pass: equipment[key].attPass,
              person: JSON.stringify(person)
            }).then((params) => {
              text += '更新人员：' + "姓名：'" + person.name + "' 【设备信息】：设备名 '" + equipment[key].attName + "' " + JSON.stringify(params.data) + '\n';
            }).catch(function (error) {
              _this.setDataText('系统错误');
            })

          } else {
            text += '导入人员：' + "姓名：'" + person.name + "' 【设备信息】：设备名 '" + equipment[key].attName + "' " + JSON.stringify(params.data) + '\n';

          }


          let perPhoto = selectedRows[i].perPhoto;

          //http://设备 IP:8090/face/featureReg 
          if (selectedRows[i].feature) {
            Util.$http.post(IP + '/face/featureReg', {
              pass: equipment[key].attPass,
              personId: selectedRows[i].perId,
              faceId: selectedRows[i].faceId ? selectedRows[i].faceId : "",
              feature: selectedRows[i].feature,
              featureKey: selectedRows[i].featureKey,
            }).then((params) => {
              totalProgress += add
              text += '导入特征码：' + "姓名：'" + person.name + "' 【设备信息】：设备名 '" + equipment[key].attName + "' " + '\n';

              // time: parseInt((js - ks) / 1000) + '秒'

            }).catch(function (error) {
              _this.setDataText(error);
            })
          } else if (perPhoto) {
            let bast64 = "";
            if (perPhoto.indexOf("data:image/jpg;base64,") !== -1) {
              bast64 = perPhoto.split("data:image/jpg;base64,");
            } else if (perPhoto.indexOf("data:image/png;base64,") !== -1) {
              bast64 = perPhoto.split("data:image/png;base64,");
            } else if (perPhoto.indexOf("data:image/jpeg;base64,") !== -1) {
              bast64 = perPhoto.split("data:image/jpeg;base64,");
            }

            if (bast64 !== "") {
              //照片注册（base64）

              datas[person.id + equipment[key].attIp] = {
                attIp: equipment[key].attIp,
                attPort: equipment[key].attPort,

                pass: equipment[key].attPass,
                personId: selectedRows[i].perId,
                faceId: selectedRows[i].perId,
                imgBase64: bast64[1],
                isEasyWay: true,

                name: person.name,
                id: person.id,
                attName: equipment[key].attName,
                data: JSON.stringify(params.data)
              }

              Util.$http.post(IP + '/face/create', {
                pass: equipment[key].attPass,
                personId: selectedRows[i].perId,
                faceId: selectedRows[i].perId,
                imgBase64: bast64[1],
                isEasyWay: true,
              }).then((params) => {
                totalProgress += add

                text += '导入照片：' + "姓名：'" + person.name + "' 【设备信息】：设备名 '" + equipment[key].attName + "' " + JSON.stringify(params.data) + '\n';


                // time: parseInt((js - ks) / 1000) + '秒'

              }).catch(function (error) {
                _this.setDataText(error);
              })

            } else {
              totalProgress += add

              text += '导入照片：' + "姓名：'" + person.name + + "' 【设备信息】：设备名 '" + equipment[key].attName + "' " + "  照片不存在或格式不正确! 图片格式支持( png、jpg、jpeg )  " + "\n";

            }
          } else {
            totalProgress += add
            text += '导入照片：' + "姓名：'" + person.name + "' 【设备信息】：设备名 '" + equipment[key].attName + "' " + "  照片不存在或格式不正确! 图片格式支持( png、jpg、jpeg )  " + "\n";

          }


        }).catch(function (error) {
          totalProgress += add
          // js = new Date().getTime();
          text += '导入人员：' + "姓名：'" + person.name + "' 【设备信息】： 设备名： '" + equipment[key].attName + "' " + "  当前设备网络连接超时！ 当前人员照片导入已取消！ " + "\n";

          // time: parseInt((js - ks) / 1000) + '秒'

        })

      }

    }

    let d = window.setInterval(() => {
      if ((parseInt(totalProgress) === 99 ? 100 : parseInt(totalProgress)) === 100) {
        window.clearInterval(d);
        this.setState({
          totalProgress: (parseInt(totalProgress) === 99 ? 100 : parseInt(totalProgress)),
          isImplement: false
          // time: parseInt((js - ks) / 1000) + '秒'
        })
        this.setDataText("进度已完成[" + (parseInt(totalProgress) === 99 ? 100 : parseInt(totalProgress)) + "%]");
      }


    }, 1000)

  }
  //删除人员信息
  personDelete = () => {
    let { equipment, selectedRows } = this.state

    if (this.state.AllPersonnel) {
      selectedRows = this.state.datalist
    }
    for (let key in equipment) {
      if (JSON.stringify(equipment[key]) === '{}') {
        equipment.splice(key, 1);
        break;
      }
    }

    let selectedRowsIndex = selectedRows.length
    let equipmentIndex = equipment.length

    totalProgress = 0;
    let add = 100 / (equipmentIndex)
    if (selectedRowsIndex <= 0) return this.setDataText('请选择删除人员');
    if (equipmentIndex <= 0) return this.setDataText('请选择删除设备');
    this.setDataText('人员删除中...');
    this.setState({
      totalProgress: (parseInt(totalProgress) === 99 ? 100 : parseInt(totalProgress)),
      isImplement: true
    })

    let id = "";
    for (let key in equipment) { // 设备
      id = "";
      for (let subscript in selectedRows) { // 人员
        if (id === "") {
          id += selectedRows[subscript].perId
        } else {
          id += "," + selectedRows[subscript].perId
        }

      }

      let IP = 'http://' + equipment[key].attIp + ':' + equipment[key].attPort;
      //人员注册/person/delete 
      Util.$http.post(IP + '/person/delete', {
        pass: equipment[key].attPass,
        id: id
      }).then((params) => {
        totalProgress += add

        this.setDataText("删除人员 >>>【设备信息】：设备名 '" + equipment[key].attName + "' " + JSON.stringify(params.data))
        if ((parseInt(totalProgress) === 99 ? 100 : parseInt(totalProgress)) === 100) {
          this.setState({
            totalProgress: (parseInt(totalProgress) === 99 ? 100 : parseInt(totalProgress)),
            isImplement: false
          })
        } else {
          this.setState({
            totalProgress: (parseInt(totalProgress) === 99 ? 100 : parseInt(totalProgress))
          })
        }
      }).catch(function (error) {
        this.setDataText('系统错误');
      })
    }

  }

  equipmentPhotoFaceId(data) {
    let datalist = this.state.equipmentPhotoList
    let list = this.state.equipmentPhotoFaceIdList;
    list.push(data)

    for (let i in datalist) {
      if (data.faceId === datalist[i].faceId) {
        datalist.splice(i, 1)
      }
    }

    this.setState({
      equipmentPhotoList: datalist,
      equipmentPhotoFaceIdList: list
    })



  }
  //删除设备人员照片信息
  faceDelete = () => {
    let { equipment, equipmentPhotoFaceIdList } = this.state

    let equipmentIndex = equipment.length

    if (!equipmentIndex) this.setDataText('请选择删除设备');

    for (let key in equipment) { // 设备
      for (let i in equipmentPhotoFaceIdList) {

        let IP = 'http://' + equipment[key].attIp + ':' + equipment[key].attPort;
        //http://设备 IP:8090/face/delete 
        Util.$http.post(IP + '/face/delete', {
          pass: equipment[key].attPass,
          faceId: equipmentPhotoFaceIdList[i].faceId
        }).then((params) => {

          this.setDataText("删除照片 >>>【设备信息】：设备名 '" + equipment[key].attName + "' " + JSON.stringify(params.data));

        }).catch(function (error) {
          this.setDataText('系统错误');
        })
      }

    }



  }


  //勾选设备
  addEquipment = (_data) => {
    let equipment = [];
    for (let key in _data) {
      equipment.push(JSON.parse(_data[key].props.value));
    }

    this.setState({ equipment })

  }

  setSelectedRows = (selectedRows) => {

    this.setState({ selectedRows })
  }

  newlyPopup = (_d, title) => {

    this.setState({
      newlyPopup: {
        title: title,
        switch: true,
      },
      data: _d
    })
  }



  render() {

    return (
      <div className="equipment_personnel_management">
        {
          this.state.newlyPopup.title === "设备人员照片管理" ?
            <div className="photo_display">
              <ElasticFrame
                style={{ width: 800, height: 560 }}
                title={this.state.newlyPopup.title}
                titleText={this.state.titleText}
                ok={() => {
                  let title = this.state.newlyPopup.title;
                  this.setState({
                    newlyPopup: { switch: false }
                  }, () => {

                    this.faceDelete()
                  })

                }}
                close={() => {
                  this.setState({
                    newlyPopup: { switch: false }
                  })
                }}
                renderDom={(props) => {
                  return (
                    <div className="photo_body">
                      {
                        this.state.equipmentPhotoList.map((_d, index) => {
                          return <div key={index} className="photo_display_img">
                            <Icon onClick={() => this.equipmentPhotoFaceId(_d)} title={'删除照片'} style={{ color: 'red', position: 'absolute' }} type="close" />
                            <img src={_d.path} />
                          </div>
                        })
                      }
                    </div>
                  )
                }}
              />

            </div> : ''
        }



        <Header style={{ background: '#fff', padding: 0 }} >
          <div className="query_condition">
            <div>
              模糊查询：<Input value={this.state.testName} onChange={(e) => this.search(e.target.value)} />
            </div>
            <div>
              <Button onClick={() => this.pullData()} icon="download">下载设备的人员信息</Button>
            </div>
          </div>
        </Header>
        <div className="rygl-ry-data">

          <div className="rygl-ry-data-datatree">
            <DataTree ongetfindAllByDepartment={(current, pageSize, _d) => { this.searchDepartment(_d.id) }} {...this.state} />
          </div>

          <div className="rygl-ry-data-datatable">
            <Spin spinning={this.state.loading} delay={500}>
              <DataTable setSelectedRows={this.setSelectedRows} onGetData={() => { }} {...this.state} />
            </Spin>
          </div>

          <div className="rygl-ry-data-datatree-equipment">
            <DataTreeCheckList addEquipment={this.addEquipment} {...this.state} />
          </div>
          <div className="rygl-ry-data-datatree-information">

            <fieldset>
              <legend style={{ border: 0 }}>
                <div className="selected_accLevel_fieldset">
                  <Checkbox onChange={this.onChange}>是否所有人员</Checkbox>
                  <span disabled={this.state.isImplement}><Button disabled={this.state.isImplement} onClick={this.setPersonCreate}>上传人员信息</Button></span>
                  <span disabled={this.state.isImplement}><Button disabled={this.state.isImplement} onClick={this.personDelete}>删除设备人员信息</Button></span>
                  <Button onClick={() => { this.setState({ dataText: [] }) }}>清空信息</Button>
                  <div style={{ float: 'right', lineHeight: '30px', width: 400, height: 30, borderRadius: 30, background: 'rgb(223, 223, 223)' }}>

                    <div style={{
                      width: this.state.totalProgress * 4,
                      height: 30,
                      backgroundColor: '#43a7ff',
                      position: 'relative',
                      borderRadius: 30
                    }}>
                      <div style={{ paddingLeft: 12 }}>{this.state.totalProgress + "%"}</div>

                    </div>
                  </div>

                </div>

              </legend>

              <div className="sub_selectedAccLevel">
                <TextArea id={"textAreaKet"} value={this.state.dataText} rows={5}> </TextArea>
              </div>

            </fieldset>

          </div>
        </div>
      </div>

    );
  }
}

export default EquipmentPersonnelManagement;
