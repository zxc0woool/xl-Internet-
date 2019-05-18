
import React, { Component } from 'react';
import ElasticFrame from '../elastic.frame';
import comm from '../../../uilt/comm';
import './index.css';

class About extends Component {
  constructor(props) {
    super(props);
    this.state = {
      localValue: '',

    }
  }

  render() {

    return (
      <div className='about'>
        <ElasticFrame
          style={{ width: 900, height: 480 }}
          title={'关于'}
          close={() => {

            this.props.onNewlyPopup({ title: '关于', switch: false })

          }}
          renderDom={(props) => {

            return <div className="body">
                <h4>版本号：</h4>
                <span>{comm.Edition}</span>
                <h4>本系统建议使用浏览器：</h4>
                <span>Internet Explorer 11+/Firefox 27+/Chrome 33+</span>
                <h4>显示器分辨率：</h4>
                <span>1024×768 及以上像素</span>
                <h4>软件运行环境：</h4>
                <span>Windows 7, Windows 8/8.1, Windows10, Windows Server 2008/2012, PostgreSQL, Oracle 11g/12c 2005/2008/2012</span>
            </div>

          }}
        />
      </div>
    );
  }
}
export default About;