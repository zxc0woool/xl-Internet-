

import React, { Component } from 'react';
import DataTree from '../../controls/data.tree';
import DataTable from '../../controls/data.table';
import Util from '../../../uilt/http.utils';
import './index.css';

class TjbbYtjbb extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      localValue: '',
      newlyPopup: {
        title: "",
        switch: true,
      },
      pagination:{
        total:0,  //数据总数量
        pageSize:50, //显示几条一页
      },
      titlelist: [
        { name: '刷新', icon: 'redo' },
      ],
      datalist: [],
      dataColumns: [
        {
          title: '人员编号',
          dataIndex: 'perId',
          width: 100,
        }, {
          title: '姓名',
          dataIndex: 'perName',
          width: 100,
        }, {
          title: '部门名称',
          dataIndex: 'departmentName',
          width: 100,
        }, {
          title: '入职时间',
          dataIndex: 'entryDate',
          width: 100,
        }, {
          title: '操作',
          dataIndex: 'operation',
          key: 'operation',
          fixed: 'right',
          width: 80,
          render: () => {
            return <a onClick={(e) => this.newlyPopup(e, '编辑')}>编辑</a>
          },
        }
      ],
      leftDatalist:[],
      // leftDatalist: [
      //   {
      //     name: '部门名称',
      //     value: '部门名称',
      //     children: [
      //       {
      //         name: '市场部',
      //         value: '市场部',
      //         children: [
      //           { name: '采购部', value: '部门名称>市场部>采购部' }
      //         ]
      //       },
      //       { name: '研发部', value: '部门名称>研发部' },
      //       { name: '财务部', value: '部门名称>财务部' },
      //       { name: '维修部', value: '部门名称>维修部' },
      //       { name: '证卡部', value: '部门名称>证卡部' }
      //     ]
      //   },
      //   {
      //     name: '技术',
      //     value: '技术',
      //     children: [
      //       { name: '研发部', value: '技术>研发部' },
      //       { name: '维修部', value: '技术>维修部' }
      //     ]
      //   }
      // ]
    }

  }

  componentDidMount() {

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
    this.getDepartment();
  }
  //部门内容
  getDepartment = () => {
    Util._httpPost("/project_war_exploded/department/selecttree.do", JSON.stringify({
    })).then((params) => {
      this.setState({
        leftDatalist: params.data.rows
      })
    }).catch((error) => {

    })
  }

  render() {
 
    return (
      <div className="tjbb-ytjbb">
        <div className="tjbb-ytjbb-data">
          <div className="tjbb-ytjbb-data-datatree">
            <DataTree {...this.state} />
          </div>

          <div className="tjbb-ytjbb-data-datatable">
            <DataTable scroll={{x:'130%'}} onNewlyPopup={()=>{}} {...this.state} />
          </div>
        </div>
      </div>
    );
  }
}

export default TjbbYtjbb;
