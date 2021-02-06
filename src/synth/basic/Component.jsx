import React from 'react';
import Icon from '@mdi/react';
import {
    mdiSineWave,
} from '@mdi/js';

import Knob from '../../components/Knob';
import ParamKnob from '../../components/ParamKnob';
import * as Colors from '../../colors';
import LabeledInput from '../../components/LabeledInput';
import OscillatorControl from './OscillatorControl';
import FilterControl from './FilterControl';
import EnvelopeControl from './EnvelopeControl';

import { connect } from 'react-redux';
import { setSynthParams } from '../../actions';

import {
    KNOB_WRAPPER_STYLE,
    KNOB_WRAPPER_TEXT_STYLE,
    KNOB_SIZE,
} from './common';


class BasicSynthComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <div style={{
            backgroundColor: Colors.bgDarker
        }}>
                 <OscillatorControl name={'OSC 1'}
                                    synthId={0}
                                    oscillatorId={0}
                                    oscillator={this.props.synth.oscillators[0]}
                                    gain={this.props.synth.oscillatorGains[0]}/>
                 <OscillatorControl name={'OSC 2'}
                                    synthId={0}
                                    oscillatorId={1}
                                    oscillator={this.props.synth.oscillators[1]}
                                    gain={this.props.synth.oscillatorGains[1]}/>
                 <OscillatorControl name={'OSC 3'}
                                    synthId={0}
                                    oscillatorId={2}
                                    oscillator={this.props.synth.oscillators[2]}
                                    gain={this.props.synth.oscillatorGains[2]}/>

                 <FilterControl name={'FILT'}
                                synthId={0}
                                filter={this.props.synth.filter}
                                filterGain={this.props.synth.filterGain}
                                color={'#90BE6D'} />

                 <EnvelopeControl name={'FILT-EG'}
                                  color={'#90BE6D'}
                                  synthId={0}
                                  envelopeId={0}
                                  envelope={this.props.synth.filterEnvelope}/>

                 <EnvelopeControl name={'AMP-EG'}
                                  color={'#277DA1'}
                                  synthId={0}
                                  envelopeId={1}
                                  envelope={this.props.synth.ampEnvelope}/>
               </div>;
    }
}

const mapStateToProps = (state, ownProps) => ({
    params: state.synths[0].params,
});
const mapDispatchToProps = (dispatch) => ({
    setParam: (params) => dispatch(setSynthParams(0, params)),
});

BasicSynthComponent = connect(
    mapStateToProps,
    mapDispatchToProps
)(BasicSynthComponent);

export default BasicSynthComponent;
