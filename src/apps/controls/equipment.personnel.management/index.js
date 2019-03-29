

import React, { Component } from 'react';
import { Layout, Button, Input, Icon } from 'antd'
import DataTree from '../../controls/data.tree';
import DataTreeCheckList from '../../controls/data.tree.check.list';
import DataTable from '../../controls/data.table';
import ElasticFrame from '../../controls/elastic.frame';
import Util from '../../../uilt/http.utils';
import './index.css';

const { Header } = Layout;
const { TextArea } = Input;
class EquipmentPersonnelManagement extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: {},
      testName: "",
      userName: "",
      titleText: "",
      dataText: "",
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
          title: '账号',
          dataIndex: 'account',
          width: 100,
        }, {
          title: '编号',
          dataIndex: 'perId',
          width: 100,
        }, {
          title: '姓名',
          dataIndex: 'perName',
          width: 100,
        }, {
          title: '卡号',
          dataIndex: 'cardNumber',
          width: 100,
        }, {
          title: '照片操作',
          dataIndex: 'dictName',
          key: 'operation',
          width: 100,
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


  //拍照注册
  setFaceTakeImg = (_d) => {
    let { equipment } = this.state
    let equipmentIndex = equipment.length

    if (equipmentIndex !== 1) return this.setDataText("请选择一个设备后再照片注册");
    let IP = 'http://' + equipment[0].attIp + ':' + equipment[0].attPort;
    Util.$http.post(IP + '/face/takeImg', {
      pass: equipment[0].attPass,
      personId: _d.perId
    }).then((params) => {
      this.setDataText(JSON.stringify(params.data));

      if (params.success) {
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
                this.setDataText('系统错误');
              })



              this.newlyPopup(_d, "设备人员照片管理")
            } else {

            }

          }).catch(function (error) {
            this.setDataText('系统错误');
          })

        }, 1000);
      }


    }).catch(function (error) {
      this.setDataText('系统错误');
    })





  }
  //从设备获取照片
  faceFind = (_d) => {
    let { equipment } = this.state
    let equipmentIndex = equipment.length

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
          this.setDataText('系统错误');
        })

        this.newlyPopup(_d, "设备人员照片管理")
      } else {

      }

    }).catch(function (error) {
      this.setDataText('系统错误');
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
  //通过部门查询人员
  getfindAllByDepartment = (_d) => {
    Util._httpPost("/project_war_exploded/person/findAllByEquipment.do", JSON.stringify({
      departId: parseInt(_d.id),
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
  setDataText = (dataText) => {
    this.setState({ dataText: this.state.dataText + '系统信息：' + dataText + '\n' })
  }

  //上传人员信息
  setPersonCreate = () => {
    let _this = this;
    let { equipment, selectedRows } = this.state

    let selectedRowsIndex = selectedRows.length
    let equipmentIndex = equipment.length

    let totalProgress = 0;
    let add = 100 / ((selectedRowsIndex * equipmentIndex) * 2)

    if (!selectedRowsIndex) this.setDataText('请选择导入人员');
    if (!equipmentIndex) this.setDataText('请选择导入设备');

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
          this.setDataText("导入人员 >>> 姓名：'" + person.name + "'  id：'" + person.id + "' 【设备信息】：设备名 '" + equipment[key].attName + "' " + JSON.stringify(params.data) + "   进度[" + (parseInt(totalProgress) === 99 ? 100 : parseInt(totalProgress)) + "%]");
          let perPhoto = selectedRows[i].perPhoto
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
            Util.$http.post(IP + '/face/create', {
              pass: equipment[key].attPass,
              personId: selectedRows[i].perId,
              faceId: selectedRows[i].perId,
              imgBase64: bast64[1],
              isEasyWay: true,
            }).then((params) => {
              totalProgress += add
              this.setDataText("导入照片 >>> 姓名：'" + person.name + "'  id：'" + person.id + "' 【设备信息】：设备名 '" + equipment[key].attName + "' " + JSON.stringify(params.data) + "   进度[" + (parseInt(totalProgress) === 99 ? 100 : parseInt(totalProgress)) + "%]");

            }).catch(function (error) {
              _this.setDataText('照片不存在');
            })

          } else {
            totalProgress += add

            this.setDataText("导入照片 >>> 姓名：'" + person.name + "'  id：'" + person.id + "' 【设备信息】：设备名 '" + equipment[key].attName + "' " + "  照片不存在或格式不正确! 图片格式支持( png、jpg、jpeg )  " + "   进度[" + (parseInt(totalProgress) === 99 ? 100 : parseInt(totalProgress)) + "%]");
          }

        }).catch(function (error) {
          _this.setDataText('人员照片不存在');
        })

      }

    }

  }
  //删除人员信息
  personDelete = () => {
    let { equipment, selectedRows } = this.state

    let selectedRowsIndex = selectedRows.length
    let equipmentIndex = equipment.length

    if (!selectedRowsIndex) this.setDataText('请选择删除人员');
    if (!equipmentIndex) this.setDataText('请选择删除设备');

    let id = "";
    for (let key in equipment) { // 设备
      for (let subscript in selectedRows) { // 人员
        if (id === "") {
          id += selectedRows[subscript].perId
        } else {
          id += "," + selectedRows[subscript].perId
        }

        let IP = 'http://' + equipment[key].attIp + ':' + equipment[key].attPort;
        //人员注册/person/delete 
        Util.$http.post(IP + '/person/delete', {
          pass: equipment[key].attPass,
          id: id
        }).then((params) => {

          this.setDataText("删除人员 >>>【设备信息】：设备名 '" + equipment[key].attName + "' " + JSON.stringify(params.data));

        }).catch(function (error) {
          this.setDataText('系统错误');
        })
      }

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
          this.state.newlyPopup.title === "设备人员照片管理" || this.state.newlyPopup.title === "设备人员照片管理" ?
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
              {/* <Button onClick={() => this.onGetData(1, this.state.pagination.pageSize)} icon="search">搜索</Button> */}
            </div>
          </div>
        </Header>
        <div className="rygl-ry-data">

          <div className="rygl-ry-data-datatree">
            <DataTree ongetfindAllByDepartment={this.getfindAllByDepartment} {...this.state} />
          </div>

          <div className="rygl-ry-data-datatable">
            <DataTable setSelectedRows={this.setSelectedRows} onGetData={() => { }} {...this.state} />
          </div>

          <div className="rygl-ry-data-datatree-equipment">
            <DataTreeCheckList addEquipment={this.addEquipment} {...this.state} />
          </div>
          <div className="rygl-ry-data-datatree-information">

            <fieldset>
              <legend style={{ border: 0 }}>信息</legend>
              <div className="sub_selectedAccLevel">
                <TextArea value={this.state.dataText} rows={5}> </TextArea>
              </div>

            </fieldset>
            <div className="selected_accLevel_fieldset">
              <Button onClick={this.setPersonCreate}>上传人员信息</Button>
              <Button onClick={this.personDelete}>删除设备人员信息</Button>
            </div>
          </div>
        </div>
      </div>

    );
  }
}

export default EquipmentPersonnelManagement;
