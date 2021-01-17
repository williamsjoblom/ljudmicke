import React from 'react';

import * as Colors from '../colors';


class LabeledInput extends React.Component {
    render() {
        const LABEL_STYLE = {
            height: this.props.height + 'px',
            lineHeight: this.props.height + 'px',
            margin: 0,
            padding: '0 3px',
            backgroundColor: Colors.bgDarkest,
            fontSize: '12px',
            color: Colors.fgSecondary,
            textAlign: 'center',
        };

        const INPUT_STYLE = {
            height: this.props.height + 'px',
            padding: 0,
            margin: 0,
            border: 0,
            outline: 'none',
            fontFamily: 'Roboto Mono',
            width: this.props.width + 'px',
            textAlign: 'center',
            backgroundColor: Colors.bgDark,
            color: Colors.fgPrimary,
        };

        return <div style={{display: 'inline-flex',
                            height: this.props.height + 'px',
                            border: '1px solid #44444'}}>
                   <input type="text"
                          value={this.props.value || ""}
                          onChange={e => this.props.onChanged(e.target.value)}
                          style={INPUT_STYLE}>
                   </input>
                 <span style={LABEL_STYLE}>{this.props.label}</span>
               </div>;
    }
}

export default LabeledInput;
