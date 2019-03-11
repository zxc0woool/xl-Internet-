

import React, { Component } from 'react';
import DataTree from '../../controls/data.tree';
import DataTable from '../../controls/data.table';
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
        <div className="rygl-ry-data">
          <div className="rygl-ry-data-datatree">
            <DataTree {...this.props}/>
          </div>

          <div className="rygl-ry-data-datatable">
            <DataTable {...this.props} />
          </div>
        </div>
        
       
      </div>
    );
  }
}

export default RyglRy;
