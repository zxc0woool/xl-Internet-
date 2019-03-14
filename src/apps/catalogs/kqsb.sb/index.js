
import React, { Component } from 'react';
import { Input, TreeSelect, Select } from 'antd';
import DataTable from '../../controls/data.table';
import ElasticFrame from '../../controls/elastic.frame';
import './index.css';

const TreeNode = TreeSelect.TreeNode;
const Option = Select.Option;
class KqsbSb extends Component {
  constructor(props) {
    super(props);
    this.state = {
      localValue: '',
      newlyPopup: {
        title: "",
        switch: true,
      },
      titlelist: [
        { name: '刷新', icon: 'redo' },
        { name: '新增', icon: 'file-add' },
        // { name: '远程配置', icon: 'database' },
        { name: '删除', icon: 'close' }
      ],
      datalist: [],
      dataColumns: [
        {
          title: '设备编号',
          dataIndex: 'perId',
          width: 100,
        }, {
          title: '设备姓名',
          dataIndex: 'perName',
          width: 100,
        }, {
          title: '设备类型',
          dataIndex: 'departmentName',
          width: 100,
        }, {
          title: '设备型号',
          dataIndex: 'entryDate',
          width: 100,
        }, {
          title: '设备序列号',
          dataIndex: 'entryDate1',
          width: 100,
        }, {
          title: 'IP地址',
          dataIndex: 'entryDate2',
          width: 100,
        },  {
          title: '端口号',
          dataIndex: 'entryDate3',
          width: 100,
        },  {
          title: '通讯密码',
          dataIndex: 'entryDate4',
          width: 100,
        },  {
          title: 'MAC地址',
          dataIndex: 'entryDate5',
          width: 100,
        },  {
          title: '方向',
          dataIndex: 'entryDate6',
          width: 160,
        }, {
          title: '操作',
          dataIndex: 'operation',
          key: 'operation',
          render: () => {
            return (
              <div className="rygl-bm-operation">
                <a onClick={(e) => this.newlyPopup(e, '编辑')}>编辑</a>
                <a onClick={(e) => this.newlyPopup(e, '远程配置')}>远程配置</a>
                <a onClick={() => { }}>删除</a>
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
        perId: `设备机`,
        perName: `离线版`,
        departmentName: 'MA5200',
        entryDate: `65326`,
        entryDate1: '192.168.120.120' ,
        entryDate2: '8080',
        entryDate3: '123456',
        entryDate4: '',
        entryDate5: '签到'
      }

    ];
    this.setState({ datalist });
  }
  newlyPopup = (e, title) => {

    this.setState({
      newlyPopup: {
        title: title,
        switch: true,
      }
    })
  }
  TreeNode = (datalist) => {
    return datalist.map((_d) => {
      return (
        <TreeNode value={_d.name} title={_d.name} key={_d.value}>
          {

            _d.children ? this.TreeNode(_d.children) : ''

          }
        </TreeNode>
      )
    })

  }
  onTreeNodeChange = (localValue) => {
    console.log(localValue);
    this.setState({ localValue });
  }
  render() {

    return (
      <div className="kqsb-sb">
        <div className="kqsb-sb-data">

          <div className="kqsb-sb-data-datatable">
            <DataTable onNewlyPopup={this.newlyPopup} {...this.state} />
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
                  renderDom={(props) => {
                    return (
                      <div className="kqsb-sb_newly_added">
                        <div className="kqsb-sb_tableStyle">
                          <div className="kqsb-sb_tableStyle_div"><label>设备号 <span className="required">*</span></label><Input type="text" className="valid" /></div>
                          <div className="kqsb-sb_tableStyle_div"><label>设备名称 <span className="required">*</span></label><Input type="text" className="valid" /></div>
                          <div className="kqsb-sb_tableStyle_div">
                            <label>设备类型 <span className="required">*</span></label>
                              <Select defaultValue={"lucy"} id="certType">
                                <Option value='lucy'>离线版</Option>
                              </Select>
                          </div>
                          <div className="kqsb-sb_tableStyle_div">
                            <label>连机方式 <span className="required">*</span></label>
                              <Select defaultValue={"lucy1"} id="certType">
                                <Option value='lucy1'>TCP/IP通讯</Option>
                                <Option value='lucy2'>UDB通讯</Option>
                                <Option value='lucy3'>代理通讯</Option>
                              </Select>
                          </div>
                          <div className="kqsb-sb_tableStyle_div"><label>终端SN <span className="required">*</span></label><Input type="text" className="valid" /></div>
                          
                          <div className="kqsb-qy_tableStyle_div"><label>通讯端口</label><Input type="text" className="valid" /></div>
                          <div className="kqsb-qy_tableStyle_div"><label>IP地址</label><Input type="text" className="valid" /></div>
                          <div className="kqsb-qy_tableStyle_div"><label>通讯密码</label><Input type="text" className="valid" /></div>
                          <div className="kqsb-qy_tableStyle_div"><label>MAC地址</label><Input type="text" className="valid" /></div>
                          <div className="kqsb-qy_tableStyle_div"><label>方向</label>
                            <Select defaultValue={"lucy2"} id="certType">
                                <Option value='lucy1'>签到/签退</Option>
                                <Option value='lucy2'>签到</Option>
                                <Option value='lucy3'>签退</Option>
                              </Select>
                          </div>
                        </div>
                      </div>
                    )
                  }}
                /> : this.state.newlyPopup.title === "远程配置"?
                <ElasticFrame
                  style={{ width: 800, height: 600 }}
                  title={this.state.newlyPopup.title}
                  close={() => {
                    this.setState({
                      newlyPopup: { switch: false }
                    })
                  }}
                  renderDom={(props) => {
                    return (
                      <div className="kqsb-sb_newly_added">
                    
                          <div className="kqsb-sb-left-title">
                            <div className="kqsb-sb-left-title-name">网络参数</div>
                            <div className="kqsb-sb-left-title-name">基本参数</div>
                            <div className="kqsb-sb-left-title-name">回调参数</div>
                            <div className="kqsb-sb-left-title-name">显示参数</div>
                            <div className="kqsb-sb-left-title-name">远程操作</div>
                          </div>



                          <div className="kqsb-sb_tableStyle_div"><label>设备号 <span className="required">*</span></label><Input type="text" className="valid" /></div>



                      </div>
                    )
                  }}
                /> :""
              :
              ""
          }
        </div>


      </div>
    );
  }
}

export default KqsbSb;
