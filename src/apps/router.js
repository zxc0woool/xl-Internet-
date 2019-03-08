import React from "react"
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import Login from './login'; //登入页面
import Index from './index'; //首页
import Pers from './pers';   //人事页面
import Att from './att';     //考勤页面

import NotFound from "./not-found";


class RouterMap extends React.Component {
    render() {
        return (
            <BrowserRouter>
                <Switch>
                    <Route path='/pers' component={Pers}></Route> 
                    <Route path='/att' component={Att}></Route>
                    <Route path='/index' component={Index}></Route>
                    <Route path='/login' component={Login}></Route>
                    <Route path='/' component={Login}></Route>
                    <Route component={NotFound}></Route>
                </Switch>
            </BrowserRouter>
         
        )
    }
}

export default RouterMap;