import React from 'react';

import * as Colors from '../colors';
import Icon from '@mdi/react';

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

        const ICON_STYLE = {
            height: this.props.height + 'px',
            lineHeight: this.props.height + 'px',
            margin: 'auto',
            padding: '0 3px',
            backgroundColor: Colors.bgDark,
            fontSize: '12px',
            color: Colors.fgSecondary,
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
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
                            border: '1px solid #44444',
                            marginRight: '4px'}}>
                 {
                     this.props.icon &&
                     <div style={ICON_STYLE}>
                       <Icon size={1} color={Colors.fgSecondary} path={this.props.icon}/>
                     </div>
                 }
                 <input type="text"
                        value={this.props.value || ""}
                        onChange={e => this.props.onChanged(e.target.value)}
                        style={INPUT_STYLE}>
                 </input>
                 {
                     this.props.label &&
                     <div style={ICON_STYLE}>{this.props.label}</div>
                 }

               </div>;
    }
}

export default LabeledInput;
