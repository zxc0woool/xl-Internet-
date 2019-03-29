import comm from './comm';
import axios from 'axios';
import qs from 'qs';

const SERVER_ADDRESS = "http://" + comm.SERVER_IP + ":" + comm.SERVER_PORT
// const SERVER_ADDRESS = "http://www.phonegap100.com/appapi.php";
axios.defaults.baseURL = SERVER_ADDRESS;
//http请求函数
const util = {

    /**
     * 回调函数
     */
    then: function () {

    },

    $http: {
        //post请求
        post: function (api, data, postCfg) {
            let param = qs.stringify(data);
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
    _httpPost: function (api, params) {

        var timeoutmid = 15000;
        var postCfg = {
            headers: { 'Content-Type': 'application/json' },
            // timeout: timeoutmid,
            dataType: 'jsonp',
            changeOrigin: true, //允许跨域
        };

        let param = qs.stringify(params)

        return new Promise((resolve, reject) => {
            axios.post(api, params, { ...postCfg }).then((res) => {
                resolve(res)
            })
        })

    }
}



export default util;









