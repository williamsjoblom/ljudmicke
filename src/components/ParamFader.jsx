import React from 'react';

import Fader from './Fader';

class ParamFader extends React.Component {

    constructor(props) {
        super(props);

        this.onChange = this.onChange.bind(this);
        this.setValue = this.setValue.bind(this);

        this.setValue(this.props.value);
    }

    setValue(value) {
        if (Array.isArray(this.props.param)) {
            this.props.param.forEach(
                param => param.value = value
            );
        } else {
            this.props.param.value = value;
        }
    }

    onChange(value) {
        this.props.onChange(value);
        this.setValue(value);
    }

    render() {
        return <Fader {...this.props}
                      onChange={this.onChange}/>;
    }
}

export default ParamFader;
