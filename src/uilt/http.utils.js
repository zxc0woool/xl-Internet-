import comm from './comm';
import axios from 'axios';
import qs from 'qs';

const SERVER_ADDRESS = "http://" + comm.SERVER_IP + ":" + comm.SERVER_PORT
// const SERVER_ADDRESS = "http://www.phonegap100.com/appapi.php";
axios.defaults.baseURL = SERVER_ADDRESS;
//http请求函数
const util =  {

    /**
     * 回调函数
     */
    then : function(){
     
    },
   
    $http : {
        //post请求
        post : function(api, data){
            let param =  qs.stringify(data);
            return new Promise((resolve,reject)=>{
                axios.post(api,param).then((res)=>{
                    resolve(res)
                })
            })
        },
        //get请求
        get : function(api, data){
            let param =  qs.stringify(data);
            return new Promise((resolve,reject)=>{
                axios.get(api,param).then((res)=>{
                    resolve(res)
                })
            })
        }



        
    },
    /**
     * 
     * @param {*} api  usr地址
     * @param {*} params 参数
     */
    _httpGet : function (api, params) {

        let param =  qs.stringify(params);
        return new Promise((resolve,reject)=>{
            axios.get(api,param).then((res)=>{
                resolve(res)
            })
        })
        
    },
    /**
     * 
     * @param {*} api  usr地址
     * @param {*} params 参数
     */
    _httpPost : function (api, params) {
 
        // var timeoutmid = 15000;
        // var postCfg = {
        //     headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8' },
        //     timeout: timeoutmid
        // };

        let param =  qs.stringify(params);
        return new Promise((resolve,reject)=>{
            axios.post(api,param).then((res)=>{
                resolve(res)
            })
        })
        
    }
}



export default util;









