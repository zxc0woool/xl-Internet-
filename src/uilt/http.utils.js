import comm from './comm';
import axios from 'axios';
import qs from 'qs';
import cookie from './cookie';
import { message } from 'antd'
let SERVER_ADDRESS = ""
if (comm.IS_DEV) {
    SERVER_ADDRESS = "http://" + comm.SERVER_IP + ":" + comm.SERVER_PORT //手动指定服务地址
} else {
    SERVER_ADDRESS = "http://" + window.document.location.hostname + ":" + comm.SERVER_PORT //本地服务地址
}

axios.defaults.baseURL = SERVER_ADDRESS;


axios.interceptors.response.use(
    (response) => { return response },
    (error) => {

        // 针对特定的http状态码进行处理
        // console.log(error)
        if (error && error.response) {
            switch (error.response.status) {

                case 400: error.message = '请求错误'

                    break

                case 401: error.message = '未授权，请登录'

                    break

                case 403: error.message = '拒绝访问'

                    break

                case 404: error.message = `请求地址出错: ${error.response.config.url}`

                    break

                case 408: error.message = '请求超时'

                    break

                case 500: error.message = '服务器内部错误'

                    break

                case 501: error.message = '服务未实现'

                    break

                case 502: error.message = '网关错误'

                    break

                case 503: error.message = '服务不可用'

                    break

                case 504: error.message = '网关超时'

                    break

                case 505: error.message = 'HTTP版本不受支持'

                    break

                default:

            }
        }
        if(error.message.indexOf("timeout") !== -1) error.message = "网络连接超时";
        if(error.message.indexOf("Network Error") !== -1) error.message = "网络错误！";
        message.error(error.message)
        return error
    }
)


function getUserIP(onNewIP) { //  onNewIp - your listener function for new IPs
    //compatibility for firefox and chrome
    try {
        var myPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
        var pc = new myPeerConnection({
            iceServers: []
        }),
            noop = function () { },
            localIPs = {},
            ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g,
            key;

        function iterateIP(ip) {
            if (!localIPs[ip]) onNewIP(ip);
            localIPs[ip] = true;
        }

        //create a bogus data channel
        pc.createDataChannel("");

        // create offer and set local description
        pc.createOffer().then(function (sdp) {
            sdp.sdp.split('\n').forEach(function (line) {
                if (line.indexOf('candidate') < 0) return;
                line.match(ipRegex).forEach(iterateIP);
            });

            pc.setLocalDescription(sdp, noop, noop);
        }).catch(function (reason) {
            // An error occurred, so handle the failure to connect
        });

        //sten for candidate events
        pc.onicecandidate = function (ice) {
            if (!ice || !ice.candidate || !ice.candidate.candidate || !ice.candidate.candidate.match(ipRegex)) return;
            ice.candidate.candidate.match(ipRegex).forEach(iterateIP);
        };
    }
    catch (e) {
        //异常发生
        alert("e: " + e);

    }
}

//只允许本地访问系统
// getUserIP(function (ip) {
//     // alert("Got IP! :" + ip);
//     const SERVER_ADDRESS = "http://" + ip + ":" + comm.SERVER_PORT
//     axios.defaults.baseURL = SERVER_ADDRESS;
// });


//http请求函数
const util = {

    /**
     * 回调函数
     */
    then: function () {

    },

    htmlPreposition: SERVER_ADDRESS,

    $http: {
        //post请求
        post: function (api, data, postCfg) {
            let param = qs.stringify(data);

            // var postCfg = {
            //     ...postCfg,
            //     headers: { 'Content-Type': 'application/x-www-form-urlencoded'},
    
            // //     dataType: 'jsonp',
            //     // changeOrigin: true, //允许跨域
            // };
            return new Promise((resolve, reject) => {
                axios.post(api, param, { ...postCfg }).then((res) => {
                    resolve(res)
                })
            })
        },
        //get请求
        get: function (api, data, postCfg) {
            let param = qs.stringify(data);
            return new Promise((resolve, reject) => {
                axios.get(api, param, { ...postCfg }).then((res) => {
                    resolve(res)
                })
            })
        }




    },


    setAuthToken: (token) => {
        if (token) {
            // headers 每个请求都需要用到的
            // axios.defaults.headers.common["Token"] = token;
        } else {
            // delete axios.defaults.headers.common["Token"];
        }
    },


    /**
     * 
     * @param {*} api  api地址
     * @param {*} params 参数
     */
    _httpGet: function (api, params) {

        let param = qs.stringify(params);
        return new Promise((resolve, reject) => {
            axios.get(api, param).then((res) => {
                resolve(res)
            })
        })

    },
    /**
     * 
     * @param {*} api  api地址
     * @param {*} params 参数
     */
    _httpPost: function (api, params,Cfg) {
        //获取用户信息
        let obj = JSON.parse(cookie.getCookie('user'));
        let token = "";
        if (obj && obj.user) {
            //请求头添加token
            token = obj.user.token;
        }
        //所有接口添加默认参数
        // if(typeof params === "string"){
        //     let data = JSON.parse(params);
        //     data.token = token;
        //     params = JSON.stringify(data);
        // }else{
        //     params.token = token;
        // }
        var timeoutmid = 15000;
        var postCfg = {
            headers: { 'Content-Type': 'application/json','Token': token,},
            // timeout: timeoutmid,
            dataType: 'jsonp',
            // token:token,
            changeOrigin: true, //允许跨域
            ...Cfg
        };
        // debugger
        let param = qs.stringify(params)

        return new Promise((resolve, reject) => {
            axios.post(api, params, { ...postCfg }).then((res) => {
                if(res.data && res.data.errCode === "1000"){
                    
                    message.error(res.data.errMsg);

                    window.location.href="/"
                }
                resolve(res)
            })
        })

    }
}



export default util;









