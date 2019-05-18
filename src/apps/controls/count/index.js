

import React, { Component } from 'react';
import './index.css';


class Count extends Component {
  render() {

    return (
      <div className="count" style={{ backgroundColor: this.props.count.color }}>
        <div className="deviceInfo_cla">
          <div className="msg_cla">{this.props.count.textTitle}<span> {this.props.count.english}</span></div>
          <div className="count_cla"><span className="textNum">{this.props.count.textNum}</span></div>

        </div>
        <div className="icon-user-img">
          {
            this.props.count.Icon()
          }
        </div>

      </div>
    );
  }
}

export default Count;
