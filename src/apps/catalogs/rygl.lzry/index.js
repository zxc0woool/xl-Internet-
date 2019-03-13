import React, { Component } from 'react';
import { Select, Input } from 'antd';
import Information from '../../controls/information';
import DataTable from '../../controls/data.table';

import ElasticFrame from '../../controls/elastic.frame';
import './index.css';

const Option = Select.Option;
const { TextArea } = Input;

class RyglLzry extends Component {
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
        { name: '删除', icon: 'close' }
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
          title: '部门',
          dataIndex: 'departmentName',
          width: 100,
        }, {
          title: '入职时间',
          dataIndex: 'entryDate',
          width: 160,
        }, {
          title: '离职时间',
          dataIndex: 'entryDate1',
          width: 160,
        }, {
          title: '离职类型',
          dataIndex: 'entryDate2',
          width: 160,
        }, {
          title: '离职原因',
          dataIndex: 'entryDate3',
          width: 160,
        }, {
          title: '操作',
          dataIndex: 'operation',
          key: 'operation',
          render: () => {
            return (
              <div className="rygl-bm-operation">
                <a onClick={(e) => this.newlyPopup(e, '编辑')}>编辑</a>
                <a onClick={(e) => this.newlyPopup(e, '复职')}>复职</a>
              </div>

            )

          },
        }
      ]

    }
  }

  componentDidMount() {



    const datalist = [
      {
        key: 1,
        perId: `1`,
        perName: `小李`,
        departmentName: '董事部',

        entryDate: `2019-3-13 13:54:14`,
        entryDate1: '2019-3-13 13:54:14',
        entryDate2: '自离',
        entryDate3: '自离'
      },
      {
        key: 2,
        perId: `2`,
        perName: `李明`,
        departmentName: '董事部',

        entryDate: `2019-3-13 13:54:14`,
        entryDate1: '2019-3-13 13:54:14',
        entryDate2: '自离',
        entryDate3: '自离'
      },
      {
        key: 3,
        perId: `3`,
        perName: `周庄`,
        departmentName: '董事部',

        entryDate: `2019-3-13 13:54:14`,
        entryDate1: '2019-3-13 13:54:14',
        entryDate2: '自离',
        entryDate3: '自离'
      },
      {
        key: 4,
        perId: `4`,
        perName: `张飞`,
        departmentName: '董事部',

        entryDate: `2019-3-13 13:54:14`,
        entryDate1: '2019-3-13 13:54:14',
        entryDate2: '辞退',
        entryDate3: ''
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
  render() {

    return (
      <div className="rygl-lzry">
        <div className="rygl-lzry-data">

          <div className="rygl-lzry-data-datatable">
            <DataTable onNewlyPopup={this.newlyPopup} {...this.state} />
          </div>
          {
            //弹出框
            this.state.newlyPopup.switch ?
              this.state.newlyPopup.title === "编辑" ?
                <ElasticFrame
                  style={{ width: 500, height: 270 }}
                  title={this.state.newlyPopup.title}
                  close={() => {
                    this.setState({
                      newlyPopup: { switch: false }
                    })
                  }}
                  renderDom={() => {
                    return (
                      <div className="rygl_bm_newly_added">

                        <div className="rygl_bm_tableStyle">

                          <div className="rygl_bm_tableStyle_div"><label>离职日期 <span className="required">*</span></label><Input type="text" className="valid" /></div>

                          <div className="rygl_bm_tableStyle_div">
                            <label>离职类型 <span className="required">*</span></label>
                            <Select defaultValue={""} id="certType">
                              <Option value='lucy'>自离</Option>
                              <Option value='lucy1'>辞职</Option>
                              <Option value='lucy2'>辞退</Option>
                              <Option value='lucy3'>调离</Option>
                            </Select>
                          </div>


                          <div className="rygl_bm_tableStyle_div">
                            <label>离职原因</label>
                            <TextArea style={{ width: 250, minHeight: 90 }}>
                            </TextArea>
                          </div>

                        </div>
                      </div>
                    )
                  }}
                /> : this.state.newlyPopup.title === "复职" ?
                  <ElasticFrame
                    style={{ width: 900, height: 650 }}
                    title={this.state.newlyPopup.title}
                    close={() => {
                      this.setState({
                        newlyPopup: { switch: false }
                      })
                    }}
                    renderDom={() => {
                      return <Information toUserID={false} {...this.props} />
                    }}
                  /> : ""
              :
              ""
          }
        </div>


      </div>
    );
  }
}

export default RyglLzry;
