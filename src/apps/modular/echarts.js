
import React,{ Component } from "react";
// 引入 ECharts 主模块
import Echarts from 'echarts';

// import '../../../node_modules/echarts/map/js/china';

// import '../../../node_modules/echarts/map/js/province/beijing';

// // 引入柱状图
// import  'echarts/lib/chart/bar';
// 引入提示框和标题组件

class ToEcharts extends Component {

    componentDidMount() {
       
        // 基于准备好的dom，初始化echarts实例
        var myChart = Echarts.init(document.getElementById('main' + this.props.id));
        // 绘制图表
        myChart.setOption({

            toolbox: {
                show : false,
                feature : {
                    mark : {show: false},
                    dataView : {show: false, readOnly: false},
                    magicType : {
                        show: false, 
                        type: ['pie', 'funnel'],
                        option: {
                            funnel: {
                                x: '10%',
                                width: '10%',
                                funnelAlign: 'center',
                                max: 1548
                            }
                        }
                    },
                    restore : {show: false},
                    saveAsImage : {show: false}
                }
            },
            color:['rgba(122, 193, 67, 1)','rgba(230, 230, 230, 1)'],
            series : [
                {
                    name:'访问来源',
                    type:'pie',
                    radius : ['60%', '80%'],
                    itemStyle : {
                        normal : {
                            label : {
                                show : false
                            },
                            labelLine : {
                                show : false
                            }
                        },
                       
                    },
                    data:[
                        {value:this.props.data.value, name:this.props.data.cell},
                        {value:this.props.data._value, name:this.props.data._cell}
                    ]
                }
            ]
        });
    }
    render() {
        return (
            <div>
                <div id={"main" + this.props.id} style={{ width: this.props.width, height: this.props.height }}></div>
            </div>
        );
    }
}




class CurveEcharts extends Component {


    
    setOption = () => {
         // 基于准备好的dom，初始化echarts实例
        var myChart = Echarts.init(document.getElementById('main' + this.props.id));
        // 绘制图表
        myChart.setOption({

            tooltip : {
                trigger: 'axis'
            },
            toolbox: {
                show : true,
            
            },
            color:['#1aa892'],
            xAxis :this.props.type === 'line'?
            [
                {
                    type : 'category',
                    boundaryGap : false,
                    data : this.props.data.textdata
                }
            ]
            
            :
            this.props.type === 'bar'?

             [
                {
                    type : 'category',
                    boundaryGap : true,
                    data : this.props.data.textdata
                }
            ]
            :
            [
                
                {
                    type : 'category',
                    boundaryGap : false,
                    data : this.props.data.textdata
                }
                
            ],
             
            yAxis :this.props.type === 'line'?
            [
                {
                    type : 'value',
        
                }
            ]
            
            :
            this.props.type === 'bar'?

             [
                {
                    type : 'value',
        
                    axisLabel : {
                        formatter: '{value} h'
                    }
                }
            ]
            :
            [
                {
                    type : 'value'
                }
            ],



            series :this.props.type === 'bar'?
            [
                {
                    name:this.props.name,    //7ac143
                    type:this.props.type, //bar 柱形 line 线性
                    barWidth : 30,
                    barCategoryGap: '80%',
                    itemStyle: {
                        normal: {
                            color: '#7ac143',
                            barBorderRadius:0,
                        }
                    },
                    stack: '总量',
                    data:this.props.data.data
                }
            ]
            
            :

            this.props.type === 'line'?
            [
                {
                    name:this.props.name,    //7ac143
                    type:this.props.type, //bar 柱形 line 线性
                    stack: '总量',
                    data:this.props.data.data
                }
            ]

            :
            
            [
                {
                    name:this.props.name,    //7ac143
                    type:this.props.type, //bar 柱形 line 线性
                    stack: '总量',
                    data:this.props.data.data
                }
            ]
            
                                
           
        });
    }


    componentDidMount() {

       this.setOption();
    }
    
    componentDidUpdate() {
       
       this.setOption();
    }
    render() {
        return (
            <div>
                <div id={"main" + this.props.id} style={{ width: this.props.width, height: this.props.height }}></div>
            </div>
        );
    }
}


export default {
    "ToEcharts":ToEcharts,
    "CurveEcharts":CurveEcharts
};