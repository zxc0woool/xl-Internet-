

import $ from 'jquery';
import comm from './comm';
import axios from 'axios';

const SERVER_ADDRESS = "http://" + comm.SERVER_IP + ":" + comm.SERVER_PORT
// const SERVER_ADDRESS = "http://www.phonegap100.com/appapi.php";

//自定义http请求

const util =  {

    /**
     * 回调函数
     */
    then : function(){
     
    },
   
    $http : {
        //post请求
        post : function(usr, condition, implementSuccess, implementError,implementComplete){

            $.post(SERVER_ADDRESS + usr, condition, function(result) {
                if(typeof implementSuccess == "function"){
                    implementSuccess(result);
                }
              })
              .error(function(e) { 
                if(typeof implementError == "function"){
                    implementError(e);
                }
               })
              .complete(function(c) { //完成函数
                if(typeof implementError == "function"){
                    implementComplete(c);
                }
              });

            // $.post(SERVER_ADDRESS + usr,condition, implementSuccess, implementError);
            // return axios.post(SERVER_ADDRESS + usr, { condition },{ postCfg });
        },
        //get请求
        get : function(usr, condition, implementSuccess){

            $.get(SERVER_ADDRESS + usr, condition, implementSuccess);
        }



        
    },
    /**
     * 
     * @param {*} usr  usr地址
     * @param {*} params 参数
     * @param {*} implement  success 回调函数
     * @param {*} implementError  error回调函数
     */
    _httpGet : function (usr, params, implementSuccess, implementError) {
 
        // var timeoutmid = 15000;
        // var postCfg = {
        //     headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8' },
        //     timeout: timeoutmid
        // };

        // $.ajax({
        //     url: SERVER_ADDRESS + usr, 
        //     type:"GET",
        //     async: false,
        //     dataType: 'json',
        //     data: JSON.stringify(params),
        //     success: function (result) {
        //         if(typeof implementSuccess == "function"){
        //             implementSuccess(result);
        //         }
        //     },
        //     error:function(e){
        //         if(typeof implementError == "function"){
        //             implementError(e);
        //         }
        //     }
        // })
        axios.get(SERVER_ADDRESS + usr, params)
        .then(function (response) {

            if (typeof implementSuccess == "function") {
                implementSuccess(response);
            }
        })
        .catch(function (error) {
            if (typeof implementError == "function") {
                implementError(error);
            }
        })
        
    },
    /**
     * 
     * @param {*} usr  usr地址
     * @param {*} params 参数
     * @param {*} implement  success 回调函数
     * @param {*} implementError  error回调函数
     */
    _httpPost : function (usr, params, implementSuccess, implementError) {
 
        // var timeoutmid = 15000;
        // var postCfg = {
        //     headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8' },
        //     timeout: timeoutmid
        // };

        // $.ajax({
        //     url: SERVER_ADDRESS + usr, 
        //     type:"POST",
        //     async: false,
        //     dataType: 'json',
        //     data: JSON.stringify(params),
        //     success: function (result) {
        //         if(typeof implementSuccess == "function"){
        //             implementSuccess(result);
        //         }
        //     },
        //     error:function(e){
        //         if(typeof implementError == "function"){
        //             implementError(e);
        //         }
        //     }
        // })
        axios.post(SERVER_ADDRESS + usr, JSON.stringify(params))
            .then(function (response) {

                if (typeof implementSuccess == "function") {
                    implementSuccess(response);
                }
            })
            .catch(function (error) {
                if (typeof implementError == "function") {
                    implementError(error);
                }
            })
        
    }
}



export default util;









