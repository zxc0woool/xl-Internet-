

import React, { Component } from 'react';
import { Select, Input, TreeSelect  } from 'antd';
import DataTree from '../../controls/data.tree';
import DataTable from '../../controls/data.table';
import Information from '../../controls/information';
import ElasticFrame from '../../controls/elastic.frame';
import './index.css';

const TreeNode = TreeSelect.TreeNode;
const Option = Select.Option;
const { TextArea } = Input;
class RyglRy extends Component {


  constructor(props) {
    super(props);
    this.state = {
      localValue: '',
      newlyPopup: {
        title: "",
        switch: true,
      },
      titlelist:[
        {name:'刷新',icon:'redo'},
        {name:'新增',icon:'file-add'},
        {name:'离职',icon:'user-delete'},
        {name:'部门调整',icon:'contacts'},
        {name:'职位调整',icon:'audit'},
        {name:'删除',icon:'close'}
      ],
      datalist:[],
      dataColumns:[
        {
          title: '人员编号',
          dataIndex: 'perId',
          width: 150,
        }, {
          title: '姓名',
          dataIndex: 'perName',
          width: 150,
        }, {
          title: '部门名称',
          dataIndex: 'departmentName',
          width: 150,
        }, {
          title: '入职时间',
          dataIndex: 'entryDate',
          width: 160,
        }, {
          title: '操作',
          dataIndex: 'operation',
          key: 'operation',
          render: () => {
            return <a onClick={(e)=>this.newlyPopup(e,'编辑')}>编辑</a>
          },
        }
      ],
      leftDatalist:[
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
            { name: '研发部', value: '技术>研发部' },
            { name: '维修部', value: '技术>维修部' }
          ]
        }
      ],
      positionDatalist:[
        {
          name: '人事部',
          value: '人事部',
          children: [
      
          ]
        },
        {
          name: '董事部',
          value: '董事部',
          children: [
            { name: '经理', value: '董事部>经理' },
            { name: '营销员', value: '董事部>营销员' }
          ]
        }
      ],
      departmentDatalist:[
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

  componentDidMount(){
    


    const datalist = [];
    for (let i = 0; i < 100; i++) {
      datalist.push({
        key: i + 1,
        perId: `编号 ${i + 1}`,
        perName: '姓名' + `小${i + 1}`,
        departmentName: 'A' + i + 1 + '部门',
        entryDate: '2019-3-11 13:20:12'

      });
    }
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
      <div className="rygl-ry">
        <div className="rygl-ry-data">
          <div className="rygl-ry-data-datatree">
            <DataTree {...this.state}/>
          </div>

          <div className="rygl-ry-data-datatable">
            <DataTable onNewlyPopup={this.newlyPopup} {...this.state} />
            
            {
                //弹出框
                this.state.newlyPopup.switch ? 
                this.state.newlyPopup.title === "新增" || this.state.newlyPopup.title === "编辑"?
                <ElasticFrame
                  style={{ width: 900,height: 650}}
                  title={this.state.newlyPopup.title}
                  close={() => {
                    this.setState({
                      newlyPopup: { switch: false }
                    })
                  }}
                  renderDom={(props) => {
                    return <Information toUserID={this.state.newlyPopup.title === "编辑"} {...props} {...this.props}/>
                  }}
                />:
                this.state.newlyPopup.title === "离职"?
                <ElasticFrame
                  style={{ width: 500,height: 270}}
                  title={'填写离职信息'}
                  close={() => {
                    this.setState({
                      newlyPopup: { switch: false }
                    })
                  }}
                  renderDom={(props) => {
                    return (
                      <div className="content_div">
                        <table className="tableStyle">
                            <tbody><tr>
                              <th><label>离职日期</label><span className="required">*</span></th>
                                  <td>
                                    <Input type="text" className="valid" />
                                    </td>
                                </tr>
                                <tr>
                              <th><label>离职类型</label><span className="required">*</span></th>
                                  <td>
                                    <Select defaultValue={""} id="certType">
                                      <Option value='lucy'>自离</Option>
                                      <Option value='lucy1'>辞职</Option>
                                      <Option value='lucy2'>辞退</Option>
                                      <Option value='lucy3'>调离</Option>
                                    </Select>
                                    </td>
                                </tr>
                                <tr>
                              <th><label>离职原因</label></th>
                                  <td>
                                    <TextArea style={{width:250, minHeight: 90}}>
                                    </TextArea>
                                  </td>
                                </tr>
                            </tbody>
                        </table>
                      </div>
                    )
                  }}
                />:this.state.newlyPopup.title === "部门调整"?
                <ElasticFrame
                  style={{ width: 500,height: 270}}
                  title={this.state.newlyPopup.title}
                  close={() => {
                    this.setState({
                      newlyPopup: { switch: false }
                    })
                  }}
                  renderDom={(props) => {
                    return (
                      <div className="">
                          <table className="tableStyle">
                            <tbody><tr>
                              <th><label>选择人员</label><span className="required">*</span></th>
                                  <td>
                                    <TextArea readOnly defaultValue={'52216621'} style={{width:250, minHeight: 45}}>
                                     
                                    </TextArea>
                                  </td>
                                </tr>
                                <tr>
                              <th><label>调动到的部门</label><span className="required">*</span></th>
                                  <td>
                                    <TreeSelect
                                      showSearch
                                      style={{ width: 300 }}
                                      value={this.state.localValue}
                                      dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
                                      placeholder="调动到的部门"
                                      allowClear
                                      treeDefaultExpandAll
                                      onChange={this.onTreeNodeChange}
                                    >
                                      {
                                        this.TreeNode(this.state.departmentDatalist)
                                      }
                                    </TreeSelect>
                                  </td>
                                </tr>
                                <tr>
                              <th><label>调动原因</label></th>
                                  <td>
                                    <TextArea style={{width:250, minHeight: 90}}>
                                    </TextArea>
                                  </td>
                                </tr>
                            </tbody>
                        </table>
      
      
                      </div>
                      )
                  }}
                />:this.state.newlyPopup.title === "职位调整"?
                <ElasticFrame
                  style={{ width: 500,height: 270}}
                  title={this.state.newlyPopup.title}
                  close={() => {
                    this.setState({
                      newlyPopup: { switch: false }
                    })
                  }}
                  renderDom={(props) => {
                    return (
                      <div className="">
                          <table className="tableStyle">
                            <tbody><tr>
                              <th><label>选择人员</label><span className="required">*</span></th>
                                  <td>
                                    <TextArea readOnly defaultValue={'52216621'} style={{width:250, minHeight: 45}}>
                                      
                                    </TextArea>
                                  </td>
                                </tr>
                                <tr>
                              <th><label>调动到的职位</label><span className="required">*</span></th>
                                  <td>
                                    <TreeSelect
                                      showSearch
                                      style={{ width: 300 }}
                                      value={this.state.localValue}
                                      dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
                                      placeholder="调动到的职位"
                                      allowClear
                                      treeDefaultExpandAll
                                      onChange={this.onTreeNodeChange}
                                    >
                                      {
                                        this.TreeNode(this.state.positionDatalist)
                                      }
                                    </TreeSelect>
                                  </td>
                                </tr>
                                <tr>
                              <th><label>调动原因</label></th>
                                  <td>
                                    <TextArea style={{width:250, minHeight: 90}}>
                                    </TextArea>
                                  </td>
                                </tr>
                            </tbody>
                        </table>
                      </div>
                      )
                  }}
                />:""
                  :
                  ""
            }
          </div>
        </div>
        
       
      </div>
    );
  }
}

export default RyglRy;
