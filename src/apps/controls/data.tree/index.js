

import React, { Component } from 'react';
import { Tree, Icon } from 'antd';
import './index.css';

const DirectoryTree = Tree.DirectoryTree;
const { TreeNode } = Tree;
let datalistkey ={list:[],data:{}};
class DataTree extends Component {

 
  constructor(props) {
    super(props);
    this.state = {
      defaultExpandAll:true,
      toDefaultExpandAll:false,
      checkedKeys:[],
      datalist:[
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
      ]
    }

  }

  componentDidMount() {

  }

  componentDidUpdate(){


  }

  directoryTree = () => {

    return  <Tree
            showLine
            expandedKeys={this.state.checkedKeys}
            onSelect={this.onSelect}
        
          >
              {
                this.TreeNode(this.state.datalist)
              }

            </Tree>
  }

  onSelect = (selectedKeys, info) => {


    console.log('selected', selectedKeys, info);
  }


  onClickDefaultExpandAllYes = () => {
 
    this.setState({
      checkedKeys:datalistkey.list
    })

  }
  onClickDefaultExpandAllNo = () => {
    this.setState({
      checkedKeys:[]
    })

  }

  TreeNode = (datalist) => {
    return datalist.map((_d) => {

      if(!datalistkey.data[_d.value] && _d.children){
        datalistkey.data[_d.value] = _d.value
        datalistkey.list.push(_d.value)
      }
    
      return (
        <TreeNode title={_d.name} key={_d.value} isLeaf={_d.children ? false : true}>
          {

            _d.children ? this.TreeNode(_d.children) : ''
            
          }
        </TreeNode>
      )
    })
    
  }


  render() {

    return (
      <div className="data-tree">
        <div className="first-child">
          <Icon type="plus-square" onClick={this.onClickDefaultExpandAllYes} title="展开" />
          <Icon type="minus-square" onClick={this.onClickDefaultExpandAllNo} title="收起" />
        </div>
        <div className="dhx_cell_layout">

         {
           this.directoryTree()
            
         }
       

        </div>

      </div>
    );
  }
}

export default DataTree;
