import React, { Component } from 'react';
import style from './index.less';

class TextArea extends Component {

    render() {
        let { value } = this.props
        if (!value) {
            value = "";
        }
        let vals = []
        if (value.length > 0) {
            vals = value.split("\n")
        }


        return (
            <div id={this.props.id} className={style['TextArea']}>
                {
                    vals.map((_d, i) => {

                        return <div key={i}>{_d}</div>

                    })

                }

            </div>
        );
    }
}
export default TextArea;


