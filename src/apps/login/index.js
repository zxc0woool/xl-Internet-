import React, { Component } from 'react';
import { Input, Button, Checkbox, Icon, message } from 'antd';
import fingerprint from '../../images/login/fingerprint.png';
import logo from '../../images/login/logo.png';
import IndexLogo from '../../images/login/index.jpg';
import UserLogin from '../../images/login/userlogin.png';
import Util from '../../uilt/http.utils';
import cookie from '../../uilt/cookie';
// import Fingerprint from '../controls/fingerprint';
import Zkbioonline from '../../file/zkbioonline.exe';
import './index.css';
class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            UserName: '',
            ToDrive: false,
            UserPassword: '',
            memory: false,
            userText: "",
            explain: "",
            isfingerprint: false,
            fingerprintName: "指纹登入"
        };

    }

    componentDidMount() {
        //获取用户信息
        let obj = JSON.parse(cookie.getCookie('user'));
        if (obj && obj.user) {
            let user = obj.user;
            let UserPassword = "";
            if (user.memory) {
                UserPassword = user.UserPassword
            }
            this.setState({
                UserName: user.UserName,
                UserPassword: UserPassword,
                memory: user.memory
            });

        }


    }
    onInputChangeName(e) {
        this.setState({
            UserName: e.target.value
        })
    }
    onInputChangePassword(e) {
        this.setState({
            UserPassword: e.target.value
        })
    }
    onCheckboxChange(e) {
        this.setState({
            memory: e.target.checked
        })
    }
    onLogin() {


        if (this.state.UserName !== "" && this.state.UserPassword !== "") {
            //登入接口/xinlai_war_exploded/login
            Util._httpPost("/project_war_exploded/user/login.do", {
                username: this.state.UserName,
                password: this.state.UserPassword
            }).then((params) => {

                if (params.data.flag) {
                    cookie.remove('user');
                    //登录成功
                    let password = ""
                    if (this.state.memory) {
                        password = params.data.password
                    }
                    cookie.setCookie('user', JSON.stringify({
                        user: {
                            name: params.data.username,
                            UserName: params.data.username,
                            UserPassword: password,
                            sessionId: params.data.sessionId,
                            token:params.data.token,
                            memory: this.state.memory,
                            superStatus:params.data.superStatus
                        }
                    }))
                    Util.setAuthToken(params.data.token);
                    this.props.history.push('/index');
                } else {
                    //登入失败
                    message.error("账号不存在或密码错误！")
                }

            }).catch(function (error) {

            })

        }else{
            message.error("账号或密码不得为空！")
        }

    }
    keyLogin = (event) => {
        if (event.keyCode == 13)  //回车键登入
          this.onLogin()
    }
    /**
  * 获取webserver的信息
  * @author wenxin
  * @param 
  * @param paramArray 存放国际化元素的数组
  * @param isFPLogin 是否是指纹登录 true:是；false:否
  * @param type 0 表示发送完请求后,还有别的操作。1 表示发送完请求后，没有其余的操作了
  */
    getWebServerInfo(paramArray, isFPLogin, type) {
        let _this = this;
        Util._httpGet('http://127.0.0.1:22001/ZKBIOOnline/info').then((result) => {
            let _d = result.data
            //检查驱动
            if (type === "0") {

            }
            //检查动态库连接
            else if (type === "1") {
                //返回码
                let ret = null;
                ret = _d.ret;
                //接口调用成功返回时
                if (ret === 0) {
                    _this.setState({
                        ToDrive: true,
                    })
                    //连接指纹采集器失败
                    // _this.printing("未检测到指纹采集器");
                }
                else {
                    //加载ZKFinger10失败
                    _this.printing("加载动态库失败");
                }

            }
        }).catch(function (error) {
            _this.printing("请安装指纹驱动或启动该服务!");
        })

    }
    setPerFinger = (template) => {

        Util._httpPost("/project_war_exploded/finger/thanFinger.do", {
            fdata: template
        }).then((params) => {
            if (params.data.flag) {
                this.printing("登录人员名称：" + params.data.perName);
            } else {
                this.printing("指纹登录失败");
            }
            setTimeout(() => {
                if (params.data.flag) {
                    cookie.remove('user');
                    //登录成功
                    cookie.Set('user', {
                        user: {
                            name: params.data.perName,
                            UserName: "",
                            UserPassword: "",
                            sessionId: params.data.sessionId,
                            memory: false
                        }
                    })
                    this.props.history.push('/index');
                } else {
                    this.onFingerprintLogin()
                }
            }, 2000)
        })
        setTimeout(() => {
            this.printing("指纹获取成功正在登录中...");
        }, 0)

    }

    printing = (explain) => {
        this.setState({ explain: explain })
    }
    onFingerprintLogin() {
        //指纹登录
        if (this.state.isfingerprint) {
            this.setState({
                isfingerprint: false,
                explain: '',
                fingerprintName: "指纹登入"
            })
        } else {
            this.setState({
                isfingerprint: true,
                explain: '',
                fingerprintName: "返回"
            })
        }
        this.getWebServerInfo(null, null, "1");


    }


    render() {
        return (
            <div className="Index" onKeyDown={this.keyLogin}>
                <div className="background">
                    <img src={IndexLogo} className="Index-logo" alt="logo" />
                </div>

                <div className="Index-body">
                    {/* <img src={logo} className="logo" alt="logo" /> */}

                    <div className="Index-window">
                        <div className="input-Box" >
                            <div>
                                <div className="input-box">
                                    <Input placeholder="请输入用户名" value={this.state.UserName} allowClear onChange={this.onInputChangeName.bind(this)} />
                                </div>
                                <div className="input-box">
                                    <Input type="password" placeholder="请输入登录密码" value={this.state.UserPassword} allowClear onChange={this.onInputChangePassword.bind(this)} />
                                </div>
                            </div>

                            {/* <img style={!this.state.isfingerprint ? { display: 'none' } : {}} src={fingerprint} className="fingerprint" alt="fingerprint" />
                            <div style={{ color: '#fff' }}>
                                {

                                    this.state.isfingerprint ? this.state.ToDrive ? this.state.explain ? this.state.explain : <div><Icon type="loading" />正在链接指纹采集仪</div> : <div>驱动不存在<a href={Zkbioonline}>下载驱动</a></div> : ''

                                }
                            </div> */}

                        </div>

                        <div className="button-box" style={this.state.isfingerprint ? { display: 'none' } : {}}>
                            <Button type="primary" onClick={this.onLogin.bind(this)}>登录</Button>
                        </div>
                        {/* <div className="button-box">
                            <Button type="dashed" disabled onClick={this.onFingerprintLogin.bind(this)}>{this.state.fingerprintName}</Button>
                        </div> */}
                        {/* <div className="company">浙江控控科技股份有限公司</div> */}

                        <div className="memory-body" style={this.state.isfingerprint ? { display: 'none' } : {}}>
                            <div className="memory">
                                <Checkbox checked={this.state.memory} onChange={this.onCheckboxChange.bind(this)} />
                            </div>
                            记住密码 | <a>忘记密码？</a>

                        </div>
                    </div>

                    {
                        // this.state.isfingerprint ? <Fingerprint printing={this.printing} isfingerprint={this.state.isfingerprint} setPerFinger={this.setPerFinger} ToFingerprint={() => { }} /> : () => { }
                    }


                </div>

            </div>
        );
    }
}

export default Login;
