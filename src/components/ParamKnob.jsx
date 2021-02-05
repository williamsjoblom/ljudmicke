import React from 'react';

import Knob from './Knob';

class ParamKnob extends React.Component {

    constructor(props) {
        super(props);

        this.onChange = this.onChange.bind(this);
        this.props.param.value = this.props.value;
    }

    onChange(value) {
        this.props.onChange(value);
        this.props.param.value = value;
    }

    render() {
        return <Knob {...this.props}
                     onChange={this.onChange}/>;
    }
}

export default ParamKnob;
