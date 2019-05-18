

import React, { Component } from 'react';
import { Icon, Table, Timeline } from 'antd';
import HeadNavigationBar from "../head.navigation.bar";
import ElasticFrame from '../controls/elastic.frame';
import DataTable from '../controls/data.table';
import Echarts from "../modular/echarts";
import Chart from "../controls/chart";
import Count from "../controls/count";
import Util from '../../uilt/http.utils';
import Img01 from "../../images/src/01.svg";
import Img02 from "../../images/src/02.svg";
import Img03 from "../../images/src/03.svg";
import './index.css';
import '../../index.css';

let ToEcharts = Echarts.ToEcharts;
let CurveEcharts = Echarts.CurveEcharts;
let CategoryEcharts = Echarts.CategoryEcharts;
let Item = Timeline.Item;

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      findPerFac: {},
      newlyPopup: {
        title: "",
        switch: true,
      },
      countData: [
        {
          textNum: '-人',
          textTitle: '人员总数',
          english: 'Personnel',
          color: "transparent",
          type: 'personnel',
          Icon: () => {
            return <Icon type="user" />
          }
        },
        {
          textNum: '-台',
          textTitle: '设备总数',
          english: 'Facility',
          color: "transparent",
          type: 'facility',
          Icon: () => {
            return <Icon type="desktop" />
          }
        }
      ],
      biometricData: {
        // color:['rgb(230, 117, 113)','rgb(219, 184, 56)','rgb(119, 183, 69)','rgb(214, 245, 136)','rgb(56, 161, 219)'],
        datalist: [
          { value: '0', name: "暂无数据" },
        ],
        Icon: () => {
          return <Icon type="border" />
        }

      },

      attendance: {
        datalist: [{ value: '0', name: "暂无数据" }]
      },
      eventDatas: {
        Data1: {
          data: [120, 132, 101, 134, 90, 230, 210],
          textdata: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日']
        },
        Data2: {
          data: [120, 132, 101, 134, 90, 230, 210, 120, 132, 101, 134, 90, 230, 210, 120, 132, 101, 134, 90, 230, 210, 120, 132, 101, 134, 90, 230, 210, 90, 230, 210],
          textdata: ['1日', '2日', '3日', '4日', '5日', '6日', '7日', '8日', '9日', '10日', '11日', '12日', '13日', '14日', '15日', '16日', '17日', '18日', '19日', '20日', '21日', '22日', '23日', '24日', '25日', '26日', '27日', '28日', '29日', '30日', '31日']
        },
        Data3: {
          data: [120, 132, 101, 134, 90, 230, 210, 120, 132, 101, 134, 90],
          textdata: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
        },

      },
      eventData: {
        data: [120, 132, 101, 134, 90, 230, 210],
        textdata: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日']
      },
      chartlist: [
        {
          value: '周',
        },
        {
          value: '月',
        },
        {
          value: '年',
        }

      ],
      workDatas: {

        Data1: {
          data: [52, 46, 31, 60],
          textdata: ['小米', '小明', '老刘', '老王']
        },


        Data2: {
          data: [12, 86, 52, 60, 82],
          textdata: ['小米', '小明', '老刘', '老王', '老李']
        }

      },
      workData: {
        data: [52, 46, 31, 60],
        textdata: ['小米', '小明', '老刘', '老王']
      },
      worklist: [
        {
          value: '上周',
        },
        {
          value: '上月',
        }

      ],
      event: '周',
      workName: '上周',
      moduleChartName: 'acc',
      accExceptionTopData: [
        { name: '防拆报警', value: 2441, w: '75.32387415175818%', color: '#4A4E59' },
        { name: '人未登记', value: 662, w: '20.41949413942011%', color: '#78B745' },
        { name: '操作间隔太短', value: 52, w: '1.6039481801357187%', color: '#E67571' },
        { name: '非法访问', value: 44, w: '1.3571869216533003%', color: '#E67571' },
        { name: '门开超时', value: 42, w: '1.2954966070326959%', color: '#E67571' }
      ],
      dataEvent: [],
      code: {
        1001: '正常',
        1002: '错误'
      }

    };

  }

  onEventClick = (e, key) => {
    switch (key) {
      case '周':
        this.setState({
          eventData: this.state.eventDatas['Data1'],
          event: key
        });
        break;
      case '月':
        this.setState({
          eventData: this.state.eventDatas['Data2'],
          event: key
        });
        break;
      case '年':
        this.setState({
          eventData: this.state.eventDatas['Data3'],
          event: key
        });
        break;
    }
  }

  onWorkClick = (e, key) => {
    switch (key) {
      case '上周':
        this.setState({
          workData: this.state.workDatas['Data1'],
          workName: key
        })
        break;
      case '上月':
        this.setState({
          workData: this.state.workDatas['Data2'],
          workName: key
        })
        break;
    }
  }
  componentDidMount() {

    this.findPerFac();
    this.findDepartNum();
    this.findTrend();
    this.findEquipment();
  }

  findPerFac = () => {
    Util._httpPost("/project_war_exploded/chart/findPerFac.do", JSON.stringify({
    })).then((params) => {

      let data = params.data.rows;
      let { countData } = this.state

      countData.map((_d) => {
        if (_d.type === 'personnel') {
          _d.textNum = data[_d.type] + '人';
        } else if (_d.type === 'facility') {
          _d.textNum = data[_d.type] + '台';
        }

      })

      this.setState({ countData })
    }).catch((error) => {

    })

  }

  findDepartNum = () => {

    Util._httpPost("/project_war_exploded/chart/findDepartNum.do", JSON.stringify({
    })).then((params) => {

      let datalist = params.data.rows;
      let list = [];

      datalist.map((_d) => {
        list.push({
          value: _d.number, name: _d.departName
        })
      })

      let biometricData = { datalist: list }
      this.setState({ biometricData })
    }).catch((error) => {

    })

  }
  findTrend = () => {

    Util._httpPost("/project_war_exploded/chart/findTrend.do", JSON.stringify({
    })).then((params) => {

      let data = params.data.rows;
      let datalist = data.data;

      let list = [];
      let isPersonnel = [];

      datalist.map((_d) => {
        list.push({
          value: _d.number, name: _d.week
        })
      })

      if (data.name.length > 2) {
        for (let i = 0; i <= 2; i++) {
          isPersonnel.push(data.name[i]);
        }
      } else {
        isPersonnel = data.name
      }

      let dataName = [];
      for (let key in data.name) {
        data.name[key].key = key;
        dataName[key] = data.name[key]
      }

      let attendance = { datalist: list, Attendance: data.Attendance, huaibi: data.huaibi, personnel: dataName, isPersonnel: isPersonnel }
      this.setState({ attendance })
    }).catch((error) => {

    })

  }

  findEquipment = () => {
    Util._httpPost("/project_war_exploded/chart/findEquipment.do", JSON.stringify({
    })).then((params) => {

      let dataEvent = params.data.rows;
      // let datalist = data.data;

      // let list = [];

      // datalist.map((_d) => {
      //   list.push({
      //     value: _d.number, name: _d.week
      //   })
      // })

      // let attendance = { datalist: list, Attendance: data.Attendance, huaibi: data.huaibi }
      this.setState({ dataEvent })
    }).catch((error) => {

    })

  }

  switchChart = (e, key) => {
    switch (key) {
      case 'acc':
        this.setState({
          moduleChartName: key,

        })

        break;
      case 'att':
        this.setState({
          moduleChartName: key
        })
        break;

      default:
    }
  }
  newlyPopup = (_d, title) => {
    this.setState({
      titleText: "",
      newlyPopup: {
        title: title,
        switch: true
      }
    })
  }

  render() {
    // let inTop = 0;
    // this.state.accExceptionTopData.map((val)=>{

    // })
    const columns = [
      {
        title: '#',
        dataIndex: 'key',
        width: 50
      },
      {
        title: '区域名称',
        dataIndex: 'name',
        width: 300
      }, {
        title: '区域人员',
        dataIndex: 'age'
      }];

    const data = [];
    for (let i = 0; i < 100; i++) {
      data.push({
        key: i + 1,
        name: `A${i}区`,
        age: Math.floor(Math.random() * (1 - 100)) + 100
      });
    }


    return (
      <div className="Index">
        <div className="body">
          <div className="Title-Top-H1">
            <div className="Title-Taxt">仪表面板</div>
          </div>
          <div className="index-panel">

            <div className="index-count">
              <Chart
                renderDom={() => {
                  return <div>
                    {
                      this.state.countData.map((val, key) => {
                        return <Count key={key} count={val} />
                      })
                    }
                  </div>
                }
                }

              />

            </div>

            <div className="biometric_data">
              <Chart
                title="识别数据"
                renderDom={() => {
                  return (
                    <div className="bio-item-box">
                      {/* <div className="bio-item-icon">
                          {this.state.biometricData.Icon()}
                        </div> */}
                      <ToEcharts width={350} height={200} data={this.state.biometricData} id={'bio-item-box'} />
                    </div>
                  )
                }
                }

              />
            </div>
            <div className="biometric_data">
              <Chart

                renderDom={() => {
                  return <div className="proportion">
                    <div className="chart_title" style={{ color: '#ffffff' }}>{'考勤比例'}</div>
                    <span className="chain_ratio">{
                      this.state.attendance.huaibi
                    }{this.state.attendance.huaibi ? this.state.attendance.huaibi.indexOf('+') === 0 ? <Icon type="rise" /> : <Icon type="fall" /> : ""}</span>
                    <span className="number_of_check_in">{this.state.attendance.Attendance}</span>
                    <CategoryEcharts width={350} height={180} data={this.state.attendance} />
                    <span className="check_in">
                      {
                        this.state.attendance.isPersonnel ? this.state.attendance.isPersonnel.map((_d, key) => {
                          if (key === 0) {
                            return <span key={key}>{_d.perName}</span>
                          } else {
                            return <span key={key}>、{_d.perName}</span>
                          }
                        }) : ''
                      }
                      等已到达
                    <a onClick={() => { this.newlyPopup(null, '查看更多') }}>查看更多></a></span>
                  </div>
                }
                }

              />
            </div>

            <div className="prompting_chain_equipment">
              <Timeline>
                {
                  this.state.dataEvent.map((_d, index) => {
                    return <Item key={index} dot={<img src={_d.code === 1001 ? Img01 : _d.code === 1002 ? Img03 : Img02} style={{ height: '24px', paddingBottom: 5 }} />} color="red"><h4>{_d.attName}</h4><h6>{_d.attIp}</h6><div><Icon type="clock-circle" /> {_d.time}</div></Item>

                  })
                }

              </Timeline>
            </div>
            <div className="module_chart_tab_cla">

              <ul className="tab_head_cla">
                {/* <li onClick={(e) => this.switchChart(e, 'acc')} className={this.state.moduleChartName === 'acc' ? 'activated' : ''}>
                  门禁
                </li>
                <li onClick={(e) => this.switchChart(e, 'att')} className={this.state.moduleChartName === 'att' ? 'activated' : ''}>
                  考勤
                </li> */}

              </ul>


            </div>

            <div style={this.state.moduleChartName === 'acc' ? {} : { 'display': 'none' }} className="chart_item">

              <Chart
                // onClick={this.onEventClick}
                title="事件趋势"
                // chartlist={this.state.chartlist}
                // event={this.state.event}
                renderDom={() => {
                  return (
                    <CurveEcharts name={"事件趋势"} type={'line'} width={1040} height={260} itemStyle={{
                      // itemStyle: {
                      //   itemStyle: {normal: {areaStyle: {type: 'default'}}},
                      // }
                    }
                    } data={this.state.eventData} id={"CurveEcharts1"} />
                  )

                }
                }

              />
              {/* <div className="chart_item_left">
                <Chart
                  title="门禁异常事件TOP5"
                  renderDom={() => {
                    return (

                      <div id="accExceptionTop_chart_canvas">

                        {
                          this.state.accExceptionTopData.map((val,key)=>{
                              return <div key={key} className="bar-box">
                              <div className="bar-text">
                                <div className="bar-text-left">{val.name}</div>
                                <div className="bar-text-right">
                                  <span style={{color:'#4A4E59'}}>{val.value}</span>
                                </div>
                              </div>
                              <div className="bar-chart">
                                <div className="bar-chart-content" style={{width:val.w,backgroundColor:val.color}}>
                                </div>
                              </div>
                            </div>
                          })
                        }

                        

                      </div>


                    )

                  }
                  }

                />

              </div> */}
              {/* <div className="chart_item_right">
                <Chart
                  title="区域监控"
                  renderDom={() => {
                    return (

                      <div id="accExceptionTop_chart_canvas">

                          <Table columns={columns} dataSource={data} pagination={{ pageSize: 50 }} scroll={{ y: 140 }} />,
                        

                      </div>


                    )

                  }
                  }

                />

              </div>
 */}

            </div>

            {/* <div style={this.state.moduleChartName === 'att' ? {} : { 'display': 'none' }} className="chart_item">

              <Chart
                onClick={this.onWorkClick}
                title="工作狂人"
                chartlist={this.state.worklist}
                event={this.state.workName}
                renderDom={() => {

                  return (
                    <CurveEcharts name={"工作时长"} type={'bar'} width={1150} height={260} data={this.state.workData} id={"CurveEcharts2"} />
                  )

                }
                }

              />

              <Chart
                title="本日考勤分段统计"
                renderDom={() => {
                  return <div>本日考勤分段统计</div>
                  // return (
                  //   <CurveEcharts name={"工作时长"} type={'bar'} width={1150} height={260} data={this.state.workData} id={"CurveEcharts2-1"} />
                  // )

                }
                }

              />
            </div>
 */}

          </div>



        </div>

        {
          this.state.newlyPopup.title === "查看更多" ?
            <ElasticFrame
              style={{ width: 635, height: 600 }}
              title={this.state.newlyPopup.title}
              // titleText={this.state.titleText}
              close={() => {
                this.setState({
                  newlyPopup: { switch: false }
                })
              }}

              renderDom={(props) => {
                return (
                  <div>
                    <DataTable
                      style={{ height: 495, width: 620 }}
                      closeTitle={true}
                      closePagination={true}
                      onNewlyPopup={() => { }}
                      setSelectedRows={()=>{}}
                      {...this.state}
                      dataColumns={[
                        {
                          title: '人员编号',
                          dataIndex: 'perId',
                          width: 100,
                        }, {
                          title: '名称',
                          dataIndex: 'perName',
                          width: 100,
                        }
                      ]
                      }
                      titlelist={[]}
                      datalist={this.state.attendance.personnel}
                    />

                  </div>
                )
              }}
            /> : ''
        }





      </div>
    );
  }
}



export default HeadNavigationBar(Index);
