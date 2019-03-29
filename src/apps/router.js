import React from "react"
import { HashRouter as Router, Route, Switch } from 'react-router-dom'
// import { Router, Route, Switch } from 'react-router'
import Login from './login'; //登入页面
import Index from './index'; //首页
import Pers from './pers';   //人事页面
import Att from './att';     //考勤页面

import RyglRy from './catalogs/rygl.ry';         //人员页面
import RyglRzry from './catalogs/rygl.lzry';     //离职人员页面
import RyglBm from './catalogs/rygl.bm';         //部门页面
import RyglZw from './catalogs/rygl.zw';         //职位页面
import BcglPc from './catalogs/bcgl.pc';         //班次页面
import BcglSjd from './catalogs/bcgl.sjd';       //时间段页面
import KqsbQy from './catalogs/kqsb.qy';         //区域页面
import KqsbSb from './catalogs/kqsb.sb';         //设备页面
import TjbbYmxbb from './catalogs/tjbb.ymxbb';   //月明细报表页面
import TjbbYtjbb from './catalogs/tjbb.ytjbb';   //月统计报表页面


import NotFound from "./not-found";


class RouterMap extends React.Component {
    render() {
        return (
            // <BrowserRouter> HashRouter
            //     <Switch>
            //         <Route path='/pers' component={Pers}></Route> 
            //         <Route path='/att' component={Att}></Route>
            //         <Route path='/index' component={Index}></Route>
            //         <Route path='/login' component={Login}></Route>
            //         <Route path='/' component={Login}></Route>
            //         <Route component={NotFound}></Route>
            //     </Switch>
            // </BrowserRouter>
            <Router>
                <Switch>

                    <Route path='/pers' component={Pers}></Route>
                    <Route path='/att' component={Att}></Route>
                    <Route path='/index' component={Index}></Route>
                    <Route path='/login' component={Login}></Route>
                    <Route path='/' component={Login}></Route>

                    {/* <Route path='/rygl_ry' component={RyglRy}></Route>
                    <Route path='/rygl_lzry' component={RyglRzry}></Route>
                    <Route path='/rygl_bm' component={RyglBm}></Route>
                    <Route path='/rygl_zw' component={RyglZw}></Route>
                    <Route path='/bcgl_pc' component={BcglPc}></Route>
                    <Route path='/bcgl_sjd' component={BcglSjd}></Route>
                    <Route path='/kqsb_qy' component={KqsbQy}></Route>
                    <Route path='/kqsb_sb' component={KqsbSb}></Route>
                    <Route path='/tjbb_ymxbb' component={TjbbYmxbb}></Route>
                    <Route path='/tjbb_ytjbb' component={TjbbYtjbb}></Route> */}

                    <Route component={NotFound}></Route>

                </Switch>
            </Router>

        )
    }
}

export default RouterMap;

// const RouterMap = ({ history }) =>
//     <Router>
//         <Route path='/pers' component={Pers}></Route>
//         <Route path='/att' component={Att}></Route>
//         <Route path='/index' component={Index}></Route>
//         <Route path='/login' component={Login}></Route>
//         <Route path='/' component={Login}></Route>
//         <Route component={NotFound}></Route>
//     </Router>;

// // RouterMap.propTypes = {
// //     history: PropTypes.any
// // };
// export default RouterMap;