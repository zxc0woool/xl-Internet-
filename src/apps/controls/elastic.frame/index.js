

import React, { Component } from 'react';
import { Icon } from 'antd';
import $ from 'jquery'
import Echarts from 'echarts';
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
  
    this.dragAndDrop(document.getElementById('elastic-frame-dhxwin_hdr-div'));
  }

  //拖拽功能
  /**
   * mod
   */
  dragAndDrop=(mod)=>{
    mod.onmousedown = function (ev) {
      let oevent = ev;

      let distanceX = oevent.clientX - mod.offsetLeft;
      let distanceY = oevent.clientY - mod.offsetTop;

      document.onmousemove = function (ev) {
        let oevent = ev;
        mod.style.left = oevent.clientX - distanceX + 'px';
        mod.style.top = oevent.clientY - distanceY + 'px';
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
        <div className="dhxwin_active" id={'elastic-frame-dhxwin_hdr-div'}>
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

        </div>
      </div>

    );
  }
}

export default ElasticFrame