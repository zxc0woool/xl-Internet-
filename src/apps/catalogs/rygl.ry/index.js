

import React, { Component } from 'react';
import DataTree from '../../controls/data.tree';
import './index.css';



class RyglRy extends Component {


  constructor(props) {
    super(props);
    this.state = {
   
      }

  }

  render() {
 
    return (
      <div className="rygl-ry">
        <DataTree {...this.props}/>
      
      </div>
    );
  }
}

export default RyglRy;
