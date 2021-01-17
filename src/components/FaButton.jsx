import React from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import * as Colors from '../colors';

class FaButton extends React.Component {
    render() {
        const buttonStyle = {
            display: 'inline-block',
            margin: '0 4px 0 0',
            padding: 0,
            boxShadow: 'none',
            borderRadius: '0px',
            border: '1px solid #444444',
            width: (this.props.width || 30) + 'px',
            height: (this.props.height || 30) + 'px',
            backgroundColor: '#2D2D2D',
        };

        return <button style={buttonStyle} onClick={this.props.onClick}>
                 <FontAwesomeIcon icon={this.props.icon} color={Colors.fgPrimary} />
               </button>;
    }
}

export default FaButton;
