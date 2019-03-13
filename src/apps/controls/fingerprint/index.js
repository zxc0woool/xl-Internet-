

import React, { Component } from 'react';
import $ from 'jquery';
import Util from '../../../uilt/http.utils';
import './index.css';

let collCount = '';
let timer = undefined;
export default class Fingerprint extends Component {

  constructor(props) {
    super(props);
    this.state = {
      value: '',
      timer: undefined
    };

  }
  componentDidMount() {

    // this.beginCapture()
    this.cancelCapture();
  }

  componentDidUpdate() {


  }
  getRandomNum = () => {
    let random = parseInt(Math.random() * 10000);
    return random;
  }


  /**
   * 获取webserver的信息
   * @author wenxin
   * @param 
   * @param paramArray 存放国际化元素的数组
   * @param isFPLogin 是否是指纹登录 true:是；false:否
   * @param type 0 表示发送完请求后,还有别的操作。1 表示发送完请求后，没有其余的操作了
   */
  getWebServerInfo(paramArray, isFPLogin, type) {
    Util._httpGet('http://127.0.0.1:22001/ZKBIOOnline/info').then((result) => {
      let _d =  result.data
      //检查驱动
      if (type == "0") {

      }
      //检查动态库连接
      else if (type == "1") {
        //返回码
        let ret = null;
        ret = _d.ret;
        //接口调用成功返回时
        if (ret == 0) {
          //${base_fp_connectFail}:连接指纹采集器失败
          console.log("未检测到指纹采集器")
        }
        else {
          //${base_fp_loadFail}:加载ZKFinger10失败
          console.log("加载动态库失败")

        }

      }
    }).catch(function (error) {
      debugger
    })

  }

  //开始采集
  beginCapture = () => {
    let _this = this;

    Util._httpGet('http://127.0.0.1:22001/ZKBIOOnline/fingerprint/beginCapture', {
      type: 1,
      FakeFunOn: 0,
      random: this.getRandomNum()
    }).then((result) => {
      let _d =  result.data
      //返回码
      let ret = null;
      ret = _d.ret;
      //接口调用成功返回时
      if (ret == 0) {
        // verifyFlag = true;
        //检查采集、显示图像
        _this.checkColl();
      }
      else if (ret == -2001) {
        //${base_fp_connectFail}:连接指纹采集器失败
        //显示框--采集提示
        console.log("未检测到指纹采集器")
      }
      else if (ret == -2002) {
        _this.getWebServerInfo(null, null, "1");
      }
      else if (ret == -2005) {
        //取消采集
        _this.cancelCapture();
        //开始采集
        _this.beginCapture();
      }

      timer = setInterval(() => {
        _this.checkColl();
      }, 500)//比对失败重新开始


    }).catch(function (error) {
      alert("请安装指纹驱动或启动该服务!");
    })


  }
  //取消采集
  cancelCapture = () => {
    let _this = this;
    Util._httpGet('http://127.0.0.1:22001/zkbioonline/fingerprint/cancelCapture',{
      random: this.getRandomNum()
    }).then((result) => {
      let _d =  result.data
   
    }).catch(function (error) {
      alert("请安装指纹驱动或启动该服务!");
    })

  }
  //获取模板
  getTemplate = () => {

    let _this = this;
    Util._httpGet('http://127.0.0.1:22001/zkbioonline/fingerprint/getTemplate',{
      random: this.getRandomNum()
    }).then((result) => {
        let _d =  result.data
        //返回码
        let ret = null;
        ret = _d.ret;
        if (ret === 0) {
          //录入指纹成功

        } else if (ret === -2003) {
          //录入指纹失败

        }
         //关闭
         _this.cancelCapture();
    }).catch(function (error) {
      alert("请安装指纹驱动或启动该服务!");
    })

  }

  checkColl = () => {
    let base64FPImg = "";

    //返回码
    let ret = null;
    let _this = this;

    Util._httpGet('http://127.0.0.1:22001/ZKBIOOnline/fingerprint/getImage',{
      random:this.getRandomNum()
    }).then((result) => {
      let _d =  result.data
      //指纹采集次数
      let toCollCount = 0;
      ret = _d.ret;
      if (ret === 0) {
        toCollCount = _d.data.enroll_index;
        base64FPImg = _d.data.jpg_base64;
      }
      if (collCount !== toCollCount) {
        _this.props.onGetImage('data:image/jpg;base64,' + base64FPImg);
        collCount = toCollCount
      }
      if (collCount === 3) {

        clearInterval(timer);
        _this.getTemplate();
       
      }
    }).catch(function (error) {
      alert("请安装指纹驱动或启动该服务!");
    })

  }
  render() {

    return (
      <div className="fingerprint">

      </div>

    );
  }
}

