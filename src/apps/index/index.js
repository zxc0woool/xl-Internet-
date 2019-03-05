import React, { Component } from 'react';
import { Input, Button } from 'antd';
import logo from '../../images/index/logo.png';

import IndexLogo from '../../images/index/index.jpg';
import './index.css';

class Index extends Component {

    constructor(props) {
        super(props);
        this.state = {
            UserName: '',
            UserPassword:'',
            memory:false
        };
      
    }

    
    componentDidMount(){
        //获取用户信息
        if(document.cookie){
            let user = JSON.parse(document.cookie)
            
        }
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

    onLogin(){

        //登录
        document.cookie = JSON.stringify({
            UserName:'admin',
            UserPassword:'admin',
            memory:false
        })

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
                                <Input placeholder="用户名" allowClear onChange={this.onInputChangeName.bind(this)} />
                            </div>
                            <div className="input-box">
                                <Input placeholder="密码" allowClear onChange={this.onInputChangePassword.bind(this)} />   
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
                                <Input type="checkbox" />
                            </div>
                            自动登录 | <a>忘记密码？</a>
                            
                        </div>
                    

                    </div>

                    
                </div>




            </div>
        );
    }
}

export default Index;
