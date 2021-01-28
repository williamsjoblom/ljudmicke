import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import * as Colors from '../colors';

class FaButton extends React.Component {
    render() {
        const buttonStyle = {
            display: 'inline',
            margin: '0 4px 0 0',
            padding: 0,
            boxShadow: 'none',
            borderRadius: '0px',
            border: '1px solid #444444',
            width: (this.props.width || 30) + 'px',
            height: (this.props.height || 30) + 'px',
            backgroundColor: Colors.bgDark,
        };

        return <button style={buttonStyle} onClick={this.props.onClick}>
                 <FontAwesomeIcon
                   style={{height: '100%', display: 'inline'}}
                   icon={this.props.icon}
                   color={Colors.fgSecondary} />
               </button>;
    }
}

export default FaButton;
