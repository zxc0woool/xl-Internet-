import React from "react"
import { BrowserRouter as Router, Route, Switch } from 'react-router'

import RyglRy from './rygl.ry';         //人员页面
import RyglRzry from './rygl.lzry';     //离职人员页面
import RyglBm from './rygl.bm';         //部门页面
import RyglZw from './rygl.zw';         //职位页面
import BcglPc from './bcgl.pc';         //班次页面
import BcglSjd from './bcgl.sjd';       //时间段页面
import KqsbQy from './kqsb.qy';         //区域页面
import KqsbSb from './kqsb.sb';         //设备页面
import TjbbYmxbb from './tjbb.ymxbb';   //月明细报表页面
import TjbbYtjbb from './tjbb.ytjbb';   //月统计报表页面

import NotFound from "../not-found";


class RouterMap extends React.Component {
    render() {
        return (
            // <HashRouter>
            //     <Switch>
            //         <Route path='/pers/rygl_ry' component={RyglRy}></Route> 
            //         <Route path='/pers/rygl_lzry' component={RyglRzry}></Route>
            //         <Route path='/pers/rygl_bm' component={RyglBm}></Route>
            //         <Route path='/pers/rygl_zw' component={RyglZw}></Route>
            //         <Route path='/att/bcgl_pc' component={BcglPc}></Route>
            //         <Route path='/att/bcgl_sjd' component={BcglSjd}></Route>
            //         <Route path='/att/kqsb_qy' component={KqsbQy}></Route>
            //         <Route path='/att/kqsb_sb' component={KqsbSb}></Route>
            //         <Route path='/att/tjbb_ymxbb' component={TjbbYmxbb}></Route>
            //         <Route path='/att/tjbb_ytjbb' component={TjbbYtjbb}></Route>
            //         <Route component={NotFound}></Route>
            //     </Switch>
            // </HashRouter> 

            <Router>
                <Switch>
                    <Route path='/pers/rygl_ry' component={RyglRy}></Route>
                    <Route path='/pers/rygl_lzry' component={RyglRzry}></Route>
                    <Route path='/pers/rygl_bm' component={RyglBm}></Route>
                    <Route path='/pers/rygl_zw' component={RyglZw}></Route>
                    <Route path='/att/bcgl_pc' component={BcglPc}></Route>
                    <Route path='/att/bcgl_sjd' component={BcglSjd}></Route>
                    <Route path='/att/kqsb_qy' component={KqsbQy}></Route>
                    <Route path='/att/kqsb_sb' component={KqsbSb}></Route>
                    <Route path='/att/tjbb_ymxbb' component={TjbbYmxbb}></Route>
                    <Route path='/att/tjbb_ytjbb' component={TjbbYtjbb}></Route>
                    <Route component={NotFound}></Route>

                </Switch>
            </Router>

        )
    }
}

export default RouterMap;