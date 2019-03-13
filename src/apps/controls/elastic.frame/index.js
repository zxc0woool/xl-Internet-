

import React, { Component } from 'react';
import { Icon, Button } from 'antd';
// import $ from 'jquery'
// import Echarts from 'echarts';
import './index.css';




class ElasticFrame extends Component {

  constructor(props) {
    super(props);
    this.state = {
      value: ''

    };

  }

  componentDidMount() {

    // let dom = document.getElementById('elastic-frame-dhxwin_hdr-div');
  
    this.dragAndDrop();
  }

  //拖拽功能
  /**
   * mod
   */
  dragAndDrop=()=>{
    let mod = document.getElementById('elastic-frame-dhxwin_hdr-div')
    let mod2 = document.getElementById('elastic-frame-dhxwin_hdr')
    mod2.onmousedown = function (ev) {

      let distanceX = ev.clientX - mod.offsetLeft;
      let distanceY = ev.clientY - mod.offsetTop;

      document.onmousemove = function (ev) {
        mod.style.left = ev.clientX - distanceX + 'px';
        mod.style.top = ev.clientY - distanceY + 'px';
      };

      document.onmouseup = function () {
        document.onmousemove = null;
        document.onmouseup = null;
      };
    }
  }


  render() {

    return (
      <div className="elastic-frame">
        <div className="dhxwin_active" style={this.props.style} id={'elastic-frame-dhxwin_hdr-div'}>
          {/* <div className="dhxwin_hdr"></div> */}
          <div className="dhxwin_hdr" id={'elastic-frame-dhxwin_hdr'}>
            <div className="dhxwin_text">
              <div className="dhxwin_text_inside">{this.props.title}</div>
            </div>
            <div className="dhxwin_btns">
              <div title="关闭" className="dhxwin_button dhxwin_button_close" onClick={this.props.close}>
                <Icon type="close" title="关闭" />
              </div>
            </div>
          </div>

          <div className="dhx_cell_wins">
            {
              this.props.renderDom()
            }
          </div>
          <div className="elastic_button">

              <Button>确定</Button>
              <Button onClick={this.props.close}>取消</Button>
          </div>

        </div>
      </div>

    );
  }
}

export default ElasticFrame