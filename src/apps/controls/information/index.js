

import React, { Component } from 'react';
import UserImage from '../../../images/src/userImage.gif'
import IcoFingerprint from '../../../images/src/ico_fingerprint.png'
import { Icon, Input, Select, Modal, Upload, Button, Checkbox, Row, Col, Tree } from 'antd';
import Fingerprint from '../fingerprint';
import './index.css';
const Option = Select.Option;
const { TreeNode } = Tree;
class Information extends Component {

  constructor(props) {
    super(props);
    this.state = {
      previewVisible: false,
      previewImage: UserImage,
      fileList: [],
      dhxtabbarState:{
        title:"mjsz"
      },
      dhxtabbar:[
        {
          title:'门禁设置',
          value:'mjsz'
        },
        {
          title:'考勤设置',
          value:'kqsz'
        },
        {
          title:'详细信息',
          value:'xxxx'
        },
      ],

      expandedKeys: [],
      autoExpandParent: true,
      checkedKeys: [],
      selectedKeys: [],

    };

  }

  onTreeExpand = (expandedKeys) => {
    console.log('onTreeExpand', expandedKeys);

    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  }

  onTreeCheck = (checkedKeys) => {
    console.log('onTreeCheck', checkedKeys);
    this.setState({ checkedKeys });
  }

  onTreeSelect = (selectedKeys, info) => {
    console.log('onTreeSelect', info);
    this.setState({ selectedKeys });
  }

  renderTreeNodes = data => data.map((item) => {
    if (item.children) {
      return (
        <TreeNode title={item.title} key={item.key} dataRef={item}>
          {this.renderTreeNodes(item.children)}
        </TreeNode>
      );
    }
    return <TreeNode {...item} />;
  })

  onClickDhxtabbarState = (e,title) => {
    this.setState({
      dhxtabbarState:{
        title:title
      }
    })
  }
  handleCancel = () => {
    this.setState({ previewVisible: false })
  }

  handlePreview = (file) => {

    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }

  handleChange = ({ fileList }) => {
    this.setState({ fileList })
  }

  onChange = (checkedValues) => {
    console.log('checked = ', checkedValues);
  }
  componentDidUpdate(){
  
  }

  onGetImage = (url) =>{
   
  }
  ToFingerprint = (e,v) =>{

    this.setState({
      tofingerprint: v,
    });
  }


  render() {

    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">预览</div>
      </div>
    );

    const treeDataList = [
      {
        title: '部门名称',
        key: '部门名称',
        children: [
          {
            title: '市场部',
            key: '市场部',
            children: [
              { title: '采购部', key: '部门名称>市场部>采购部' }
            ]
          },
          { title: '研发部', key: '部门名称>研发部' },
          { title: '财务部', key: '部门名称>财务部' },
          { title: '维修部', key: '部门名称>维修部' },
          { title: '证卡部', key: '部门名称>证卡部' }
        ]
      },
      {
        title: '技术',
        key: '技术',
        children: [
          { title: '研发部', key: '技术>研发部' },
          { title: '维修部', key: '技术>维修部' }
        ]
      }
    ];
    


    return (
      <div className="information">

        <table style={{ width: '100%' }}>
          <tbody>
            <tr>
              <td>
                <table className="tableStyle">
                  <tbody>
                    <tr>
                      <th>
                        <label>人员编号</label><span className="required">*</span>
                      </th>
                      <td>
                        <Input maxLength={9} type="text" disabled={this.props.toUserID} defaultValue="2837" className="valid" />
                      </td>

                      <th><label>部门</label><span className="required">*</span>
                      </th>
                      <td>
                        <div>
                          <Input maxLength={9} type="text" defaultValue="部门名称" className="valid" />
                        </div>
                      </td>
                    </tr>

                    <tr>
                      <th>
                        <label>姓名</label>
                      </th>
                      <td>

                        <Input type="text" maxLength={50} />
                      </td>
                      <th>
                        <label>密码</label>
                      </th>
                      <td>
                        <Input type="text" maxLength={6} />

                      </td>


                    </tr>
                    <tr>
                      <th >
                        <label>性别</label>
                      </th>
                      <td >
                        <Select defaultValue="lucy">
                          <Option value="lucy" selected="selected" >----</Option>
                          <Option value="lucy1">男</Option>
                          <Option value="lucy2">女</Option>
                        </Select>
                      </td>

                      <th>
                        <label>出生日期</label>
                      </th>
                      <td>
                        <Input type="text" maxLength={30} />

                      </td>
                    </tr>
                    <tr>
                      <th >
                        <label>证件类型</label>
                      </th>
                      <td>
                        <Select defaultValue="lucy" id="certType">
                          <Option value='lucy'>--------</Option>
                          <Option value='lucy1'>护照</Option>
                          <Option value='lucy2'>驾照</Option>
                          <Option value='lucy3'>工作证</Option>
                          <Option value='lucy4'>市民卡</Option>
                          <Option value='lucy5'>其他</Option>
                          <Option value='lucy6'>二代身份证</Option>
                        </Select>
                      </td>
                      <th >
                        <label>证件号码</label>
                      </th>
                      <td colSpan="2">
                        <Input type="text" maxLength={30} /><span title={"读取身份证"} onClick={(e)=>this.ToFingerprint(e,true)} className="certificates"><Icon type="idcard" /></span>
                      </td>
                    </tr>
                    <tr>
                      <th><label>职位</label></th>
                      <td>
                        <Input type="text" maxLength={30} />
                      </td>

                      <th>
                        <label>卡号</label>
                      </th>
                      <td colSpan="2">
                        <Input type="text" maxLength={30} /><span title={"控制器发卡"} className="certificates"><Icon type="idcard" /></span>
                      </td>
                    </tr>
                    <tr>
                      <th><label>入职日期</label></th>
                      <td>
                        <Input type="text" maxLength={30} />

                      </td>

                    </tr>
                    <tr>
                      <th>
                        生物模板数
                            </th>
                      <td>
                        <img src={IcoFingerprint} /> {0}
                      </td>

                    </tr>

                  </tbody>
                </table>

              </td>
              <td valign="top">

                <div>
                  <div className="div_img floatL">
                    <div className="ar_r_t">
                      <div className="ar_l_t">
                        <div className="ar_r_b">
                          <div className="ar_l_b" id="ar_l_b" style={{ width: 120, height: 140, overflow: 'hidden' }}>
                            <div id="localImag">
                              <Upload
                                action="//jsonplaceholder.typicode.com/posts/"
                                listType="picture-card"
                                fileList={fileList}
                                onPreview={this.handlePreview}
                                onChange={this.handleChange}
                              >
                                {fileList.length >= 1 ? null : uploadButton}
                              </Upload>
                              <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                                <img alt="example" style={{ width: '100%' }} src={previewImage} />
                              </Modal>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="clear"></div>
                  <div>
                    <div style={{ position: 'relative' }}>
                      <span className="color_orange">(最佳尺寸为120×140)</span>
                      <br />
                      <Button>抓拍</Button>
                    </div>
                  </div>


                </div>

              </td>
            </tr>
          </tbody>
        </table>
        <div className="dhxtabbar_base_dhx_web">
          <div className="dhxtabbar_cont">
            <div className="dhxtabbar_tabs_top">
              <div className="dhxtabbar_tabs_cont_left">
                {
                  this.state.dhxtabbar.map((_d,key)=>{
                    return (
                      <div key={key} className={this.state.dhxtabbarState.title===_d.value?"dhxtabbar_tab":"dhxtabbar_tab dhxtabbar_tab_actv"} onClick={(e)=>this.onClickDhxtabbarState(e,_d.value)}>
                        <div className="dhxtabbar_tab_text">{_d.title}</div>
                      </div>
                    )
                  })
                }
              </div>
            </div>
            {/*门禁设置  */}
            <div className={this.state.dhxtabbarState.title==='mjsz'?"dhx_cell_tabbar":"dhx_cell_tabbar displayNone"}>
              <div className="selected_accLevel">
                <fieldset className="selected_accLevel_fieldset">
                  <legend style={{ border: 0 }}>权限组设置</legend>
                  <div className="sub_selectedAccLevel">
                  
                    <Checkbox.Group style={{ width: '100%' }} onChange={this.onChange}>
                      <Row>
                        <Col span={24}><Checkbox value="A">通用权限组</Checkbox></Col>

                        <Col span={24}><Checkbox value="B">B</Checkbox></Col>

                        <Col span={24}><Checkbox value="C">C</Checkbox></Col>

                        <Col span={24}><Checkbox value="D">D</Checkbox></Col>

                        <Col span={24}><Checkbox value="E">E</Checkbox></Col>

                      </Row>
                    </Checkbox.Group>

                  </div>

                </fieldset>

              </div>
              <div className="selected_accLevel_button">
                <a href="javascript:">添加</a>
                <br />
                <a href="javascript:">全选</a>
                <br />
                <a href="javascript:">全不选</a>
              </div>
              <div className="tableStyle_tbody">
                <table className="tableStyle">
                  <tbody>
                    <tr>
                      <th >
                        <label>超级用户</label>
                      </th>
                      <td >
                        <Select defaultValue="lucy2">
                          <Option value="lucy1">是</Option>
                          <Option value="lucy2">否</Option>
                        </Select>
                      </td>
                    </tr>

                    <tr>
                      <th >
                        <label>设备操作权限</label>
                      </th>
                      <td>
                        <Select defaultValue="lucy1">
                          <Option value='lucy1'>一般人员</Option>
                          <Option value='lucy2'>管理员</Option>
                          <Option value='lucy3'>登记员</Option>
                        </Select>
                      </td>
                    </tr>

                    <tr>
                      <th><label>延长通行</label></th>
                      <td>
                        <Checkbox />
                      </td>
                    </tr>

                    <tr>
                      <th><label>黑名单</label></th>
                      <td>
                        <Checkbox />
                      </td>
                    </tr>

                    <tr>
                      <th><label>设置有效时间</label></th>
                      <td>
                        <Checkbox />
                      </td>
                    </tr>

                    <tr>
                      <th>
                        <label>开始时间</label><span className="required">*</span>
                      </th>
                      <td>

                        <Input maxLength={9} type="text" defaultValue={''} className="valid" />
                      </td>

                    </tr>
                    <tr>
                      <th>
                        <label>结束时间</label><span className="required">*</span>
                      </th>
                      <td>
                        <Input maxLength={9} type="text" defaultValue={''} className="valid" />
                      </td>

                    </tr>


                  </tbody>
                </table>
              </div>
            </div>
            {/* 考勤设置 */}
            <div className={this.state.dhxtabbarState.title==='kqsz'?"dhx_cell_tabbar":"dhx_cell_tabbar displayNone"}>
              <div className="selected_accLevel">
                <fieldset className="selected_accLevel_fieldset">
                  <legend style={{ border: 0 }}>考勤区域</legend>
                  <div className="sub_selectedAccLevel">
                  <Tree
                    checkable
                    onExpand={this.onTreeExpand}
                    expandedKeys={this.state.expandedKeys}
                    autoExpandParent={this.state.autoExpandParent}
                    onCheck={this.onTreeCheck}
                    checkedKeys={this.state.checkedKeys}
                    onSelect={this.onTreeSelect}
                    selectedKeys={this.state.selectedKeys}
                  >
                    {this.renderTreeNodes(treeDataList)}
                  </Tree>
                
                  </div>

                </fieldset>

              </div>
              <div className="tableStyle_tbody">
              <table className="tableStyle">
                  <tbody>
                    <tr>
                      <th >
                        <label>是否考勤</label>
                      </th>
                      <td >
                        <Select defaultValue="lucy1">
                          <Option value="lucy1">是</Option>
                          <Option value="lucy2">否</Option>
                        </Select>
                      </td>
                    </tr>

                    <tr>
                      <th >
                        <label>设备操作权限</label>
                      </th>
                      <td>
                        <Select defaultValue="lucy1">
                          <Option value='lucy1'>普通员工</Option>
                          <Option value='lucy2'>登记员</Option>
                          <Option value='lucy3'>管理员</Option>
                          <Option value='lucy4'>超级管理员</Option>
                        </Select>
                      </td>
                    </tr>

                    <tr>
                      <th><label>身份类别</label></th>
                      <td>
                      <Select defaultValue="lucy1">
                          <Option value='lucy1'>普通</Option>
                          <Option value='lucy2'>VIP</Option>
                          <Option value='lucy3'>黑名单</Option>
                        </Select>
                      </td>
                    </tr>

                  </tbody>
                </table>
              </div>
             

            </div>
            {/* 梯控设置     */}
            <div className={this.state.dhxtabbarState.title==='tksz'?"dhx_cell_tabbar":"dhx_cell_tabbar displayNone"}>
            <div className="selected_accLevel">
                <fieldset className="selected_accLevel_fieldset">
                  <legend style={{ border: 0 }}>权限组设置</legend>
                  <div className="sub_selectedAccLevel">
                    {
                      false?
                      <Checkbox.Group style={{ width: '100%' }} onChange={this.onChange}>
                        <Row>
                          <Col span={24}><Checkbox value="A">通用权限组</Checkbox></Col>

                          <Col span={24}><Checkbox value="B">B</Checkbox></Col>

                          <Col span={24}><Checkbox value="C">C</Checkbox></Col>

                          <Col span={24}><Checkbox value="D">D</Checkbox></Col>

                          <Col span={24}><Checkbox value="E">E</Checkbox></Col>
                        </Row>
                      </Checkbox.Group>
                      :
                      <div className="warningColor">请添加权限组</div>
                       
                    }
                   

                  </div>

                </fieldset>

              </div>
              <div className="selected_accLevel_button">
                <a href="javascript:">添加</a>
                <br />
                <a href="javascript:">全选</a>
                <br />
                <a href="javascript:">全不选</a>
              </div>
              <div className="tableStyle_tbody">
              <table className="tableStyle">
                  <tbody>
                    <tr>
                      <th >
                        <label>超级用户</label>
                      </th>
                      <td >
                        <Select defaultValue="lucy2">
                          <Option value="lucy1">是</Option>
                          <Option value="lucy2">否</Option>
                        </Select>
                      </td>
                    </tr>
                    <tr>
                      <th><label>设置有效时间</label></th>
                      <td>
                        <Checkbox />
                      </td>
                    </tr>

                    <tr>
                      <th>
                        <label>开始时间</label><span className="required">*</span>
                      </th>
                      <td>

                        <Input maxLength={9} type="text" defaultValue={''} className="valid" />
                      </td>

                    </tr>
                    <tr>
                      <th>
                        <label>结束时间</label><span className="required">*</span>
                      </th>
                      <td>
                        <Input maxLength={9} type="text" defaultValue={''} className="valid" />
                      </td>

                    </tr>

                  </tbody>
                </table>
              </div>
            </div>
            {/* 车牌登记     */}
            <div className={this.state.dhxtabbarState.title==='cldj'?"dhx_cell_tabbar":"dhx_cell_tabbar displayNone"}>
                <div className="registration">
                    

                </div>
            </div>
            {/* 详细信息 */}
            <div className={this.state.dhxtabbarState.title==='xxxx'?"dhx_cell_tabbar":"dhx_cell_tabbar displayNone"}>
                <div className="detailed_information">
                  <table className="tableStyle">
                    <tbody>
                      <tr>
                        <th>
                          <label>邮箱</label>
                        </th>
                        <td>
                          <Input maxLength={9} type="text" defaultValue={''} className="valid" />
                        </td>
                        <th><label>事件通知</label>
                        </th>
                        <td>
                          <div>
                            <Checkbox />
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <th>
                          <label>自助密码</label>
                        </th>
                        <td>
                          <Input type="text" maxLength={50} />
                        </td>
                        <th>
                          <label>手机号码</label>
                        </th>
                        <td>
                          <Input type="text" maxLength={6} />
                        </td>
                      </tr>
                      <tr>
                        <th >
                          <label>员工姓名</label>
                        </th>
                        <td >
                          <Input type="text" maxLength={30} />  
                        </td>
                        <th>
                          <label>雇佣类型</label>
                        </th>
                        <td>
                          <Select defaultValue="lucy" id="certType">
                            <Option value='lucy'>---</Option>
                            <Option value='lucy1'>合同内</Option>
                            <Option value='lucy2'>合同外</Option>
                          </Select>
                        </td>
                      </tr>
                      <tr>
                        <th >
                          <label>职称</label>
                        </th>
                        <td>
                          <Select defaultValue="lucy" id="certType">
                            <Option value="lucy">----</Option>
                            <Option value="0">教授</Option>
                            <Option value="1">副教授</Option>
                            <Option value="2">讲师</Option>
                            <Option value="3">助教</Option>
                            <Option value="4">高级讲师</Option>
                            <Option value="5">助理讲师</Option>
                            <Option value="6">教员</Option>
                            <Option value="7">研究员</Option>
                            <Option value="8">副研究员</Option>
                            <Option value="9">助理研究员</Option>
                            <Option value="10">研究实习员</Option>
                            <Option value="11">高级实验师</Option>
                            <Option value="12">实验师</Option>
                            <Option value="13">助理实验师</Option>
                            <Option value="14">实验员</Option>
                            <Option value="15">高级工程师</Option>
                            <Option value="16">工程师</Option>
                            <Option value="17">助理工程师</Option>
                            <Option value="18">技术员</Option>
                            <Option value="19">高级农艺师</Option>
                            <Option value="20">农艺师</Option>
                            <Option value="21">助理农艺师</Option>
                            <Option value="22">农业技术员</Option>
                            <Option value="23">高级兽医师</Option>
                            <Option value="24">兽医师</Option>
                            <Option value="25">助理兽医师</Option>
                            <Option value="26">兽医技术员</Option>
                            <Option value="27">高级畜牧师</Option>
                            <Option value="28">畜牧师</Option>
                            <Option value="29">助理畜牧师</Option>
                            <Option value="30">畜牧技术员</Option>
                            <Option value="31">高级经济师</Option>
                            <Option value="32">经济师</Option>
                            <Option value="33">助理经济师</Option>
                            <Option value="34">经济员</Option>
                            <Option value="35">高级会计师</Option>
                            <Option value="36">会计师</Option>
                            <Option value="37">助理会计师</Option>
                            <Option value="38">会计员</Option>
                            <Option value="39">高级统计师</Option>
                            <Option value="40">统计师</Option>
                            <Option value="41">助理统计师</Option>
                            <Option value="42">统计员</Option>
                            <Option value="43">编审</Option>
                            <Option value="44">副编审</Option>
                            <Option value="45">编辑</Option>
                            <Option value="46">助理编辑</Option>
                            <Option value="47">技术编辑</Option>
                            <Option value="48">助理技术编辑</Option>
                            <Option value="49">技术设计员</Option>
                            <Option value="50">研究馆员</Option>
                            <Option value="51">副研究馆员</Option>
                            <Option value="52">馆员</Option>
                            <Option value="53">助理馆员</Option>
                            <Option value="54">管理员</Option>
                            <Option value="55">主任医师</Option>
                            <Option value="56">副主任医师</Option>
                            <Option value="57">主治医师</Option>
                            <Option value="58">医师</Option>
                            <Option value="59">医士</Option>
                            <Option value="60">主任药师</Option>
                            <Option value="61">副主任药师</Option>
                            <Option value="62">主管药师</Option>
                            <Option value="63">药师</Option>
                            <Option value="64">药士</Option>
                            <Option value="65">主任护师</Option>
                            <Option value="66">副主任护师</Option>
                            <Option value="67">主管护师</Option>
                            <Option value="68">护师</Option>
                            <Option value="69">护士</Option>
                            <Option value="70">主任技师</Option>
                            <Option value="71">副主任技师</Option>
                            <Option value="72">主管技师</Option>
                            <Option value="73">技师</Option>
                            <Option value="74">技士</Option>
                            <Option value="75">博士后</Option>
                            <Option value="76">博士生</Option>
                            <Option value="77">硕士生</Option>
                          </Select>
                        </td>
                        <th >
                          <label>政治面貌</label>
                        </th>
                        <td colSpan="2">
                          <Select defaultValue="lucy" id="certType">
                            <Option value='lucy'>---</Option>
                            <Option value='lucy1'>党员</Option>
                            <Option value='lucy2'>团员</Option>
                            <Option value='lucy3'>群众</Option>
                          </Select>
                        </td>
                      </tr>
                      <tr>
                        <th><label>街道</label></th>
                        <td>
                          <Input type="text" maxLength={30} />
                        </td>

                        <th>
                          <label>民族</label>
                        </th>
                        <td colSpan="2">
                          <Select defaultValue="lucy" id="certType">
                            <Option value='lucy'>---</Option>
                            <Option value="0">汉族</Option>
                            <Option value="1">蒙古族</Option>
                            <Option value="2">回族</Option>
                            <Option value="3">藏族</Option>
                            <Option value="4">维吾尔族</Option>
                            <Option value="5">苗族</Option>
                            <Option value="6">彝族</Option>
                            <Option value="7">壮族</Option>
                            <Option value="8">布依族</Option>
                            <Option value="9">朝鲜族</Option>
                            <Option value="10">满族</Option>
                            <Option value="11">侗族</Option>
                            <Option value="12">瑶族</Option>
                            <Option value="13">白族</Option>
                            <Option value="14">土家族</Option>
                            <Option value="15">哈尼族</Option>
                            <Option value="16">哈萨克族</Option>
                            <Option value="17">傣族</Option>
                            <Option value="18">黎族</Option>
                            <Option value="19">傈傈族</Option>
                            <Option value="20">佤族</Option>
                            <Option value="21">畲族</Option>
                            <Option value="22">高山族</Option>
                            <Option value="23">拉祜族</Option>
                            <Option value="24">水族</Option>
                            <Option value="25">东乡族</Option>
                            <Option value="26">纳西族</Option>
                            <Option value="27">景颇族</Option>
                            <Option value="28">柯尔克孜族</Option>
                            <Option value="29">土族</Option>
                            <Option value="30">达斡尔族</Option>
                            <Option value="31">仫佬族</Option>
                            <Option value="32">羌族</Option>
                            <Option value="33">布朗族</Option>
                            <Option value="34">撒拉族</Option>
                            <Option value="35">毛南族</Option>
                            <Option value="36">仡佬族</Option>
                            <Option value="37">锡伯族</Option>
                            <Option value="38">阿昌族</Option>
                            <Option value="39">普米族</Option>
                            <Option value="40">塔吉克族</Option>
                            <Option value="41">怒族</Option>
                            <Option value="42">乌孜别克族</Option>
                            <Option value="43">俄罗斯族</Option>
                            <Option value="44">鄂温克族</Option>
                            <Option value="45">德昂族</Option>
                            <Option value="46">保安族</Option>
                            <Option value="47">裕固族</Option>
                            <Option value="48">京族</Option>
                            <Option value="49">塔塔尔族</Option>
                            <Option value="50">独龙族</Option>
                            <Option value="51">鄂伦春族</Option>
                            <Option value="52">赫哲族</Option>
                            <Option value="53">门巴族</Option>
                            <Option value="54">珞巴族</Option>
                            <Option value="55">基诺族</Option>
                            <Option value="56">穿青人族</Option>
                          </Select>
                        </td>
                      </tr>
                      <tr>
                        <th><label>出生地</label></th>
                        <td>
                          <Input type="text" maxLength={30} />

                        </td>
                        <th><label>地区</label></th>
                        <td>
                          <Input type="text" maxLength={30} />

                        </td>

                      </tr>

                      <tr>
                        <th><label>家庭电话</label></th>
                        <td>
                          <Input type="text" maxLength={30} />

                        </td>
                        <th><label>家庭地址</label></th>
                        <td>
                          <Input type="text" maxLength={30} />

                        </td>

                      </tr>
                      <tr>
                        <th><label>公司电话</label></th>
                        <td>
                          <Input type="text" maxLength={30} />

                        </td>
                        <th><label>公司地址</label></th>
                        <td>
                          <Input type="text" maxLength={30} />

                        </td>

                      </tr>
                      <tr>
                        <th><label>合同</label></th>
                        <td>
                          <Input type="text" maxLength={30} />

                        </td>
                        <th><label>人员保险</label></th>
                        <td>
                          <Input type="text" maxLength={30} />

                        </td>

                      </tr>
                      <tr>
                        <th><label>合同1</label></th>
                        <td>
                          <Input type="text" maxLength={30} />

                        </td>
                        <th><label>合同2</label></th>
                        <td>
                          <Input type="text" maxLength={30} />

                        </td>

                      </tr>
                      <tr>
                        <th><label>合同3</label></th>
                        <td>
                          <Input type="text" maxLength={30} />

                        </td>
                        <th><label>数控</label></th>
                        <td>
                          <Select defaultValue="lucy" id="certType">
                            <Option value='lucy'>---</Option>
                            <Option value='lucy1'>是</Option>
                            <Option value='lucy2'>否</Option>
                          </Select>

                        </td>

                      </tr>
                      <tr>
                        <th><label>gd</label></th>
                        <td>
                          <Select defaultValue="lucy" id="certType">
                            <Option value='lucy'>---</Option>
                          </Select>

                        </td>
                        <th><label>工种</label></th>
                        <td>
                          <Select defaultValue="lucy" id="certType">
                            <Option value='lucy'>---</Option>
                            <Option value='lucy1'>焊工</Option>
                            <Option value='lucy2'>电工</Option>
                            <Option value='lucy2'>普通</Option>
                          </Select>
                        </td>

                      </tr>
                      <tr>
                        <th><label>员工类型</label></th>
                        <td>
                          <Select defaultValue="lucy" id="certType">
                            <Option value='lucy'>---</Option>
                            <Option value='lucy1'>一线员工</Option>
                            <Option value='lucy2'>二线员工</Option>
                          </Select>

                        </td>
                       

                      </tr>


                    </tbody>
                  </table>
                </div>
            </div>

          </div>


        </div>
        {
          this.state.tofingerprint?<Fingerprint onGetImage={this.onGetImage} />:''
        }
        
      </div>

    );
  }
}

export default Information;