

import React, { Component } from 'react';
import { Alert } from 'antd'
import './index.css';


class Alert extends Component {
  render() {
 
    return (
      <Alert {...this.props} />
    );
  }
}

export default Alert;
