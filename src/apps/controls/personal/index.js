
import React, { Component } from 'react';
import ElasticFrame from '../elastic.frame';
import { Input, message, Checkbox } from 'antd';
import Util from '../../../uilt/http.utils';
import cookie from '../../../uilt/cookie';
import './index.css';

class Personal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      memory: false,
      titleText: '',
      UserName: '',
      UserPassword: '',
      setUserPassword: ''
    }
  }

  componentDidMount() {
    //获取用户信息
    let obj = JSON.parse(cookie.getCookie('user'));
    if (obj && obj.user) {
      let user = obj.user;
      this.setState({
        UserName: user.UserName,
      });

    }
  }
  //用户修改
  resetPass = (_data) => {
    Util._httpPost("/project_war_exploded/user/resetPass.do", JSON.stringify({
      username: _data.UserName,
      oldPass: _data.UserPassword,
      newPass: _data.setUserPassword
    })).then((params) => {

      if (params.data.flag) {

        message.success(params.data.message);
      } else {
        message.error(params.data.message);
      }

    }).catch((error) => {

    })
  }
  warningHints = (K) => {

    let titleText = ''
    if (!this.state.UserName) {
      titleText = '用户名不得为空！'
    }

    if (!this.state.UserPassword) {
      titleText = '当前密码不得为空！'
    }
    if (this.state.memory) {
      if (!this.state.setUserPassword) {
        titleText = '重置的密码不得为空！'
      }
    }else{
      let {setUserPassword} = this.state
      setUserPassword = undefined
    }


    if (titleText !== '') {
      this.setState({ titleText })
    } else {
      if (K) K()
    }

  }
  onCheckboxChange(e) {
    this.setState({
      memory: e.target.checked
    })
  }
  render() {

    return (
      <div className='personal'>
        <ElasticFrame
          style={{ width: 400, height: 480 }}
          title={'个人信息'}
          titleText={this.state.titleText}
          ok={() => {
            this.warningHints(() => {
              this.props.onNewlyPopup({ title: '个人信息', switch: false })
              this.resetPass(this.state);
            })
          }}
          close={() => {

            this.props.onNewlyPopup({ title: '个人信息', switch: false })

          }}
          renderDom={(props) => {

            return <div className="body">

              <div className="tableStyle_div"><label>用户名<span className="required">*</span></label>
                <Input type="text" value={this.state.UserName} onChange={(e) => {
                  this.setState({
                    UserName: e.target.value
                  })
                }} />
              </div>

              <div className="tableStyle_div"><label>当前密码<span className="required">*</span></label>
                <Input type="password" value={this.state.UserPassword} onChange={(e) => {
                  this.setState({
                    UserPassword: e.target.value
                  })
                }} />
              </div>
              <div className="tableStyle_div"><label>是否重置密码</label>

                <Checkbox checked={this.state.memory} onChange={this.onCheckboxChange.bind(this)} />

              </div>
              <div style={!this.state.memory ? { display: 'none' } : {}} className="tableStyle_div"><label>重置密码<span className="required">*</span></label>
                <Input type="password" value={this.state.setUserPassword} onChange={(e) => {
                  this.setState({
                    setUserPassword: e.target.value
                  })
                }} />
              </div>
              <div className="tableStyle_div"><span className="required">{this.state.titleText}</span>

              </div>
            </div>

          }}
        />
      </div>
    );
  }
}
export default Personal;