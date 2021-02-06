import React from 'react';
import { connect } from 'react-redux';

import Knob from '../../components/Knob';
import ParamKnob from '../../components/ParamKnob';

import { setSynthEnvelopeParams, setSynthOscillatorParams } from '../../actions';

import {
    KNOB_WRAPPER_STYLE,
    KNOB_WRAPPER_TEXT_STYLE,
    KNOB_SIZE,
} from './common';

// Wraps an object attribute such that it can be set by a ParamKnob.
class ParamWrapper {
    constructor(obj, attr) {
        this.obj = obj;
        this.attr = attr;
    }

    get value() {
        return this.obj[this.attr];
    }

    set value(rhs) {
        console.log(this.obj);
        return this.obj[this.attr] = rhs;
    }
}

class EnvelopeControl extends React.Component {

    render() {
        console.log(this.props);
        return <div style={KNOB_WRAPPER_STYLE}>
                 <span style={KNOB_WRAPPER_TEXT_STYLE}>
                   {this.props.name}
                 </span>
                 <ParamKnob width={KNOB_SIZE} height={KNOB_SIZE}
                            decimals={2}
                            value={this.props.params.attack}
                            highlightColor={this.props.color}
                            label={'attack'}
                            log
                            min={0.01}
                            max={10}
                            unit={'s'}
                            style={{marginBottom: '8px'}}
                            onChange={this.props.setAttack}
                            param={new ParamWrapper(this.props.envelope, 'attack')} />
                 <ParamKnob width={KNOB_SIZE} height={KNOB_SIZE}
                            decimals={2}
                            value={this.props.params.decay}
                            highlightColor={this.props.color}
                            label={'decay'}
                            log
                            min={0.01}
                            max={10}
                            unit={'s'}
                            style={{marginBottom: '8px'}}
                            onChange={this.props.setDecay}
                            param={new ParamWrapper(this.props.envelope, 'decay')} />
                 <ParamKnob width={KNOB_SIZE} height={KNOB_SIZE}
                            decimals={2}
                            value={this.props.params.sustain}
                            highlightColor={this.props.color}
                            label={'sustain'}
                            min={0}
                            max={1}
                            style={{marginBottom: '8px'}}
                            onChange={this.props.setSustain}
                            param={new ParamWrapper(this.props.envelope, 'sustain')}/>
                 <ParamKnob width={KNOB_SIZE} height={KNOB_SIZE}
                            decimals={2}
                            value={this.props.params.release}
                            highlightColor={this.props.color}
                            label={'release'}
                            log
                            min={0.01}
                            max={10}
                            unit={'s'}
                            style={{marginBottom: '8px'}}
                            onChange={this.props.setRelease}
                            param={new ParamWrapper(this.props.envelope, 'release')}/>
               </div>;
    };
}

const mapStateToProps = (state, ownProps) => ({
    params: state.synths[ownProps.synthId].params.envelopes[ownProps.envelopeId],
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    setAttack: t => dispatch(setSynthEnvelopeParams(
        ownProps.synthId, ownProps.envelopeId, { attack: t }
    )),
    setDecay: t => dispatch(setSynthEnvelopeParams(
        ownProps.synthId, ownProps.envelopeId, { decay: t }
    )),
    setSustain: t => dispatch(setSynthEnvelopeParams(
        ownProps.synthId, ownProps.envelopeId, { sustain: t }
    )),
    setRelease: t => dispatch(setSynthEnvelopeParams(
        ownProps.synthId, ownProps.envelopeId, { release: t }
    )),
    // setSemiTones: n => dispatch(setSynthOscillatorParams(
    //     ownProps.synthId, ownProps.oscillatorId, { semiTones: n }
    // )),
    // setDetune: n => dispatch(setSynthOscillatorParams(
    //     ownProps.synthId, ownProps.oscillatorId, { detune: n }
    // )),
    // setGain: g => dispatch(setSynthOscillatorParams(
    //     ownProps.synthId, ownProps.oscillatorId, { gain: g }
    // )),
    // setWaveform: w => dispatch(setSynthOscillatorParams(
    //     ownProps.synthId, ownProps.oscillatorId, { waveform: w }
    // ))
});

EnvelopeControl = connect(
    mapStateToProps,
    mapDispatchToProps
)(EnvelopeControl);

export default EnvelopeControl;
