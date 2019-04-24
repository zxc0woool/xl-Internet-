

import React, { Component } from 'react';
import { Tree, Icon } from 'antd';
import './index.css';

// const DirectoryTree = Tree.DirectoryTree;
const { TreeNode } = Tree;
let datalistkey = { list: [], data: {} };
class DataTreeCheckList extends Component {


  constructor(props) {
    super(props);
    this.state = {
      defaultExpandAll: true,
      rightDatalist: [

      ]
    }

  }

  componentDidMount() {
    //打开Data树
    // this.onClickDefaultExpandAllYes()
  }

  componentDidUpdate() {

  }


  onCheck = (selectedKeys, info) => {
    if (this.props.addEquipment) {
      this.props.addEquipment(info.checkedNodes);
    }

    // console.log('selected', selectedKeys, info);
  }



  TreeNode = (datalist) => {
    return datalist.map((_d) => {
      let key = _d.id;
      if (!datalistkey.data[key]) {
        datalistkey.data[key] = key
        datalistkey.list.push(key)
      }
      return (
        <TreeNode title={_d.attName + '(' + _d.attIp + ')'} value={JSON.stringify(_d)} id={_d.id} key={key} >

        </TreeNode>
      )
    })

  }


  render() {

    return (
      <div className="data-tree">
        <div className="first-child">
          {/* <Icon type="plus-square" onClick={this.onClickDefaultExpandAllYes} title="展开" />
          <Icon type="minus-square" onClick={this.onClickDefaultExpandAllNo} title="收起" /> */}
          设备
        </div>
        <div className="dhx_cell_layout">

          <Tree
            checkable
            defaultExpandAll
            onCheck={this.onCheck}
          >
            <TreeNode title={'全选'} value={"{}"} id={'全选00'} >
              {
                this.TreeNode(this.props.rightDatalist)
              }
            </TreeNode>


          </Tree>


        </div>


      </div>
    );
  }
}

export default DataTreeCheckList;
