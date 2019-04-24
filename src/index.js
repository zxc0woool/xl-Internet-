import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import 'antd/dist/antd.css'; // antd css 引用
import zhCN from 'antd/lib/locale-provider/zh_CN';//antd 国际化配置
import "babel-polyfill"; //IE 兼容性问题
import {LocaleProvider} from 'antd';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<LocaleProvider locale={zhCN}><App /></LocaleProvider>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
