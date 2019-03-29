

import React, { Component } from 'react';
import { Icon, Table } from 'antd';
import HeadNavigationBar from "../head.navigation.bar";
import Echarts from "../modular/echarts";
import Chart from "../controls/chart";
import Count from "../controls/count";
import './index.css';
import '../../index.css';

let ToEcharts = Echarts.ToEcharts;
let CurveEcharts = Echarts.CurveEcharts;


class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      countData: [
        {
          textNum: '3070人',
          textTitle: '人员总数',
          color: "#DBB838",
          Icon: () => {
            return <Icon type="user" />
          }
        },
        {
          textNum: '76台',
          textTitle: '设备总数',
          color: "#77B745",
          Icon: () => {
            return <Icon type="desktop" />
          }
        }
      ],
      biometricData: [
        {
          value: '1091',
          cell: '发卡人数',
          _value: '1979',
          _cell: '未发卡人数',
          Icon: () => {
            return <Icon type="border" />
          }
        },
        {
          value: '1458',
          cell: '已录指纹人数',
          _value: '1612',
          _cell: '未录指纹人数',
          Icon: () => {
            return <Icon type="slack" />
          }
        },
        {
          value: '120',
          cell: '已设密码人数',
          _value: '2950',
          _cell: '未设密码人数',
          Icon: () => {
            return <Icon type="small-dash" />
          },
        },
        {
          value: '583',
          cell: '已录面部人数',
          _value: '2487',
          _cell: '未录面部人数',
          Icon: () => {
            return <Icon type="smile" />
          },
        },
        {
          value: '0',
          cell: '已录指静脉人数',
          _value: '2950',
          _cell: '未录指静脉人数',
          Icon: () => {
            return <Icon type="usergroup-add" />
          },
        }

      ],
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
      accExceptionTopData:[
        {name:'防拆报警',value:2441,w:'75.32387415175818%',color:'#4A4E59'},
        {name:'人未登记',value:662,w:'20.41949413942011%',color:'#78B745'},
        {name:'操作间隔太短',value:52,w:'1.6039481801357187%',color:'#E67571'},
        {name:'非法访问',value:44,w:'1.3571869216533003%',color:'#E67571'},
        {name:'门开超时',value:42,w:'1.2954966070326959%',color:'#E67571'}
      ]



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

      default :
    }
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
              {
                this.state.countData.map((val, key) => {
                  return <Count key={key} count={val} />
                })
              }
            </div>

            <div className="biometric_data">
              <Chart
                title="生物识别数据"
                renderDom={() => {
                  return this.state.biometricData.map((val, key) => {
                    return (
                      <div key={key} className="bio-item-box">
                        <div className="bio-item-icon">
                          {val.Icon()}
                        </div>
                        <ToEcharts width={180} height={100} data={val} id={key} />
                        <div className="bio-item-text">
                          <div className="bio-item-text-value">{val.value}</div>
                          <div className="bio-item-text-cell">{val.cell}</div>
                        </div>
                        <div className="bio-item-text">
                          <div className="bio-item-text-value">{val._value}</div>
                          <div className="bio-item-text-cell">{val._cell}</div>
                        </div>
                      </div>
                    )
                  })
                }
                }

              />
            </div>

            <div className="module_chart_tab_cla">

              <ul className="tab_head_cla">
                <li onClick={(e) => this.switchChart(e, 'acc')} className={this.state.moduleChartName === 'acc' ? 'activated' : ''}>
                  门禁
                </li>
                <li onClick={(e) => this.switchChart(e, 'att')} className={this.state.moduleChartName === 'att' ? 'activated' : ''}>
                  考勤
                </li>

              </ul>


            </div>

            <div style={this.state.moduleChartName === 'acc' ? {} : { 'display': 'none' }} className="chart_item">

              <Chart
                onClick={this.onEventClick}
                title="事件趋势"
                chartlist={this.state.chartlist}
                event={this.state.event}
                renderDom={() => {
                  return (
                    <CurveEcharts name={"事件趋势"} type={'line'} width={1150} height={260} data={this.state.eventData} id={"CurveEcharts1"} />
                  )

                }
                }

              />
              <div className="chart_item_left">
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

              </div>
              <div className="chart_item_right">
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


            </div>

            <div style={this.state.moduleChartName === 'att' ? {} : { 'display': 'none' }} className="chart_item">

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


          </div>



        </div>







      </div>
    );
  }
}



export default HeadNavigationBar(Index);
