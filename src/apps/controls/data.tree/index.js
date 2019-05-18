

import React, { Component } from 'react';
import { Tree, Icon } from 'antd';
import './index.css';

// const DirectoryTree = Tree.DirectoryTree;
const { TreeNode } = Tree;
let datalistkey ={list:[],data:{}};
class DataTree extends Component {

 
  constructor(props) {
    super(props);
    this.state = {
      defaultExpandAll:true,
      checkedKeys:[],
      leftDatalist:[
       
      ]
    }

  }

  componentDidMount() {
    //打开Data树
    this.onClickDefaultExpandAllYes()
  }

  componentDidUpdate(){
 
  }

  onExpand = (selectedKeys, info) => {
  
    let list = [];
    for(let i in this.state.checkedKeys){
      list.push(this.state.checkedKeys[i]);
    }
    if(info.expanded){
      list.push(info.node.props.eventKey)
      this.setState({
        checkedKeys:list
      })
    }else{
      for(let i in list){
        if(list[i] === info.node.props.eventKey){
          list.splice(i, 1);
        }
      }
      this.setState({
        checkedKeys:list
      })

    }
 
    console.log('Expand', selectedKeys, info);
  }

  onSelect = (selectedKeys, info) => {
    if(this.props.ongetfindAllByDepartment){
      this.props.ongetfindAllByDepartment(1, this.props.pagination.pageSize,info.node.props);
    }
   
    // console.log('selected', selectedKeys, info);
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
    if(datalist) 
    return datalist.map((_d) => {
      let key = _d.name + '_' + _d.id;
      if(!datalistkey.data[key] && _d.children.length > 0 ){
        datalistkey.data[key] = key
        datalistkey.list.push(key)
      }
    
      return (
        <TreeNode title={_d.name} id={_d.id} key={key} isLeaf={_d.children.length > 0  ? false : true}>
          {

            _d.children.length > 0 ? this.TreeNode(_d.children) : ''
            
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
        <div className="dhx_cell_layout" style={this.props.style}>

          <Tree
            showLine
            expandedKeys={this.state.checkedKeys}
            onSelect={this.onSelect}
            onExpand={this.onExpand}
          >
              {
                this.TreeNode(this.props.leftDatalist)
              }

          </Tree>
       

        </div>
    

      </div>
    );
  }
}

export default DataTree;
