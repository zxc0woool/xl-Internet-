import React, { Component } from 'react';
import style from './index.less';

class TextArea extends Component {


    componentDidUpdate(){
        let DIV = this.refs.textAreaKet;
        DIV.parentNode.scrollTop = DIV.scrollHeight;
    }

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
            <div id={this.props.id} ref={"textAreaKet"} className={style['TextArea']}>
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


