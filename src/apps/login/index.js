import React, { Component } from 'react';
import { Input, Button, Checkbox } from 'antd';

import logo from '../../images/login/logo.png';
import IndexLogo from '../../images/login/index.jpg';
import Util from '../../uilt/http.utils'; 
import cookie from '../../uilt/cookie';


import './index.css';

class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            UserName: '',
            UserPassword:'',
            memory:false,
            userText:""
        };
      
    }

    componentDidMount(){
        //获取用户信息
       
        let obj = cookie.Get();

        if(obj.user){
            let user = obj.user;
            let UserPassword = "";
            if(user.memory){
                UserPassword = user.UserPassword
            }
            this.setState({
                UserName:user.UserName,
                UserPassword:UserPassword,
                memory:user.memory
            });
          
        }
        // debugger
        // const _this=this;    //先存一下this，以防使用箭头函数this会指向我们不希望它所指向的对象。http://192.168.2.116:8080/xinlai_war_exploded/login
        // axios.post('http://192.168.2.116:8080/xinlai_war_exploded/position/findPositionAll.do',{})
        // .then(function (response) {

        //   _this.setState({
        //     users:response.data,
        //     isLoaded:true
        //   });
        // })
        // .catch(function (error) {
        //   console.log(error);
        //   _this.setState({
        //     isLoaded:false,
        //     error:error
        //   })
        // })

      
    }
    onInputChangeName(e){
        this.setState({
            UserName:e.target.value
        })
    }
    onInputChangePassword(e){
        this.setState({
            UserPassword:e.target.value
        })
    }
    onCheckboxChange(e){
        this.setState({
            memory:e.target.checked
        })
    }
    onLogin(){



        if(this.state.UserName !== "" && this.state.UserPassword !== ""){
            
           
             //测试/xinlai_war_exploded/login
            Util._httpPost("/xinlai_war_exploded/login", {
                username:this.state.UserName,
                password:this.state.UserPassword
            }, (params) => {
                debugger
                 //登录成功后
                cookie.Set({
                user:{
                    UserName:this.state.UserName,
                    UserPassword:this.state.UserPassword,
                    memory:this.state.memory
                }
            })
            this.props.history.push('/index');



            }, (e) => {
                debugger
            })
        
        }else{

        }
       
    }
    onFingerprintLogin(){

        //指纹登录
    }


    render() {
        return (
            <div className="Index">
                <div className="background">
                    <img src={IndexLogo} className="Index-logo" alt="logo" />
                </div>

                <div className="Index-body">
                    <img src={logo} className="logo" alt="logo" />

                    <div className="Index-window">
                        <div className="input-Box">
                            <div className="input-box">
                                <Input placeholder="用户名" value={this.state.UserName} allowClear onChange={this.onInputChangeName.bind(this)} />
                            </div>
                            <div className="input-box">
                                <Input type="password" placeholder="密码" value={this.state.UserPassword} allowClear onChange={this.onInputChangePassword.bind(this)} />   
                            </div>
                        </div>
                        <div className="button-box">
                            <Button type="primary" icon="user" onClick={this.onLogin.bind(this)}>登录</Button>
                        
                        </div>
                        <div className="button-box">
                            <Button type="dashed" disabled onClick={this.onFingerprintLogin.bind(this)}>指纹登录</Button>
                        </div>
                        {/* <div className="company">浙江控控科技股份有限公司</div> */}
                        
                        <div className="memory-body">
                            <div className="memory">
                                <Checkbox checked={this.state.memory} onChange={this.onCheckboxChange.bind(this)} />
                            </div>
                            自动登录 | <a>忘记密码？</a>
                            
                        </div>
                    

                    </div>

                    
                </div>

            </div>
        );
    }
}

export default Login;
