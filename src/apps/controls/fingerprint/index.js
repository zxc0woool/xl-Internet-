
import React, { Component } from 'react';
import { Icon, Button } from 'antd';
import BaseFpVerifyClearImage from '../../../images/src/base_fpVerify_clearImage.png';
import Util from '../../../uilt/http.utils';
import Zkbioonline from '../../../file/zkbioonline.exe'

import './index.css';

let collCount = '';
let timer = undefined;
export default class Fingerprint extends Component {

  constructor(props) {
    super(props);
    this.state = {
      explain: '',
      ToDrive:false,
      previewImage:'',
      acquisitionInstrument: true,
      comparison:false,
      timer: undefined
    };

  }
  componentDidMount() {

   
    
    // this.beginCapture()

    // this.getWebServerInfo(null, null, "1");

    // this.cancelCapture();
    this.ok()
  }

  componentDidUpdate() {


  }

  componentWillUnmount(){
    this.cancelCapture();
  }

  onGetImage = (previewImage) =>{
    this.setState({ previewImage })
  }

  getRandomNum = () => {
    let random = parseInt(Math.random() * 10000);
    return random;
  }

  printing = (explain) => {

    if(this.props.isfingerprint){
      this.props.printing(explain);
    }
   
    this.setState({ explain:explain })
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
    let _this = this;
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
          _this.setState({
            ToDrive:true,
            comparison:false
          })
          //连接指纹采集器失败
          _this.printing("未检测到指纹采集器");
        }
        else {
          //加载ZKFinger10失败
          _this.printing("加载动态库失败");
        }

      }
    }).catch(function (error) {
      _this.printing("请安装指纹驱动或启动该服务!");
    })

  }

  ok = () => {
    clearInterval(timer);
    //取消采集
    // this.cancelCapture();
    this.setState({
      comparison:true
    })
    this.beginCapture()
  }

  //开始采集
  beginCapture = () => {
    let _this = this;
    this.setState({
      acquisitionInstrument:false
    })
    //http://127.0.0.1:22001/ZKBIOOnline/fingerprint/beginCapture?type=1&FakeFunOn=0&random=8537
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
        _this.checkColl();
        //检查采集、显示图像
       timer = setInterval(() => {
        _this.checkColl();
       }, 1000)//比对开始
      }
      // if (ret == 4) {
      //   // verifyFlag = true;
      //   _this.checkColl();
      //   //检查采集、显示图像
      //  timer = setInterval(() => {
      //   _this.checkColl();
      //  }, 1000)//比对开始
      // }
      else if (ret == -2001) {
        //${base_fp_connectFail}:连接指纹采集器失败
        //显示框--采集提示
        _this.setState({
          comparison:false
        })
        _this.printing("未检测到指纹采集器");
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
      _this.setState({
        acquisitionInstrument:true
      })

    }).catch(function (error) {
      _this.setState({
        acquisitionInstrument:true
      })
      _this.printing("请安装指纹驱动或启动该服务!");
    })


  }
  //取消采集
  cancelCapture = () => {
    let _this = this;
    clearInterval(timer);
    Util._httpGet('http://127.0.0.1:22001/zkbioonline/fingerprint/cancelCapture',{
      random: this.getRandomNum()
    }).then((result) => {
      let _d =  result.data
      // _this.printing("请开始采集!");
      _this.setState({
        previewImage:'',
        comparison:false
      })

    }).catch(function (error) {
      _this.printing("请安装指纹驱动或启动该服务!");
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
          this.props.setPerFinger(_d.data.template);
          _this.printing("指纹登记成功");
        } else if (ret === -2003) {
          //录入指纹失败
          _this.printing("采集失败，请重新登记!");
        }
        _this.setState({
          comparison:false
        })
       
    }).catch(function (error) {
      _this.printing("请安装指纹驱动或启动该服务!");
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
      // _this.printing("按压剩余次数：" +  (3 - toCollCount));
      _this.printing("请按下采集指纹");
      if (collCount !== toCollCount) {
        if(base64FPImg !== "") _this.onGetImage('data:image/jpg;base64,' + base64FPImg);
        
        collCount = toCollCount
      }
      if (collCount === 3) {

        clearInterval(timer);
        _this.getTemplate();
       
      }
    }).catch(function (error) {
      _this.printing("请安装指纹驱动或启动该服务!");
    })

  }

  render() {

    return (
      <div className="fingerprint" style={this.props.isfingerprint?{display:'none'}:{}}>
        
            <div>
              <div className='fingerprint_tips'>
              {
              this.state.acquisitionInstrument?
                this.state.explain
                :
                <div><Icon type="loading" />正在链接指纹采集仪</div>
                
              }
              {
                this.state.ToDrive?
                ''
                :
                <div>驱动不存在<a href={Zkbioonline}>下载驱动</a></div>
              }
              </div>
            </div>
            <div className="fingerprint_tips_img">
              {
                this.state.previewImage!==""?
                <div>
                  <img className="fingerprint_tips_img1" alt="example" src={this.state.previewImage} /> 
                  <img alt="example" src={BaseFpVerifyClearImage} />  
                </div>
                :
                <img alt="example" src={BaseFpVerifyClearImage} />  
              }
              
            </div>
        
           <div className='fingerprint_button'>
                <Button disabled={!this.state.ToDrive} onClick={this.ok}>开始采集</Button>
                <Button disabled={!this.state.ToDrive} onClick={this.cancelCapture}>再次采集</Button>
                <Button disabled={this.state.comparison} onClick={(e)=>this.props.ToFingerprint(e,false)}>关闭</Button>
           </div>

      </div>

    );
  }
}

