

import React, { Component } from 'react';
import { Icon } from 'antd';
import './index.css';


export default class Chart extends Component {

  constructor(props) {
    super(props);
    this.state = {
      value: ''
      
    };
  
  }


  render() {

    return (
      <div className="chart_content_cla">
            <div className="chart_container_box">

              <div className="chart_toolbar">
                <div className="chart_title">{this.props.title}</div>
                
                <div className="chart_btn_bar">
                  <div className="zk-icon-loop">
                    <Icon type="sync" />
                  </div>
                </div>
              </div>
              <div className="chart_container">
                <div className="timeSelect">
                  {
                    this.props.chartlist?
                    this.props.chartlist.map((val,key)=>{
                      return <div key={key} onClick={(e) => this.props.onClick(e,val.value)} className={this.props.event === val.value?'activation':''}>{val.value}</div>
                    })
                    :
                    ''
                  }

                </div>
                  {
                    
                    this.props.renderDom()
                  }
              </div>

            </div>
          </div>

    );
  }
}

