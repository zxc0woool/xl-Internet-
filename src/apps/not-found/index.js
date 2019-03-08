import React, { Component } from "react";
// 以CSS Modules方式引入404页样式
import "./index.css";

// 导出404页组件
class NotFound extends Component {
    render(){
   
        return <div className="container">
                  <p className="not-found">404</p>
               </div>
    }
}

export default NotFound;
