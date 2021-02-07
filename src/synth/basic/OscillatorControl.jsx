import React from 'react';
import { connect } from 'react-redux';
import { setSynthOscillatorParams } from '../../actions';

import * as Colors from '../../colors';
import Knob from '../../components/Knob';
import ParamKnob from '../../components/ParamKnob';

import {
    KNOB_WRAPPER_STYLE,
    KNOB_WRAPPER_TEXT_STYLE,
    SELECT_STYLE,
    KNOB_SIZE,
} from './common';

class OscillatorControl extends React.Component {

    componentDidMount() {
        this.props.oscillator.stop();
        this.props.oscillator.type = this.props.params.waveform;
        this.props.oscillator.start();
    }

    render() {
        return <div style={KNOB_WRAPPER_STYLE}>
             <span style={{...KNOB_WRAPPER_TEXT_STYLE,}}>
               {this.props.name}
             </span>
             <select value={this.props.params.waveform}
                     style={SELECT_STYLE}
                     onChange={e => {
                         const w = e.target.value;
                         this.props.setWaveform(w);

                         this.props.oscillator.stop();
                         this.props.oscillator.type = w;
                         this.props.oscillator.start();
                     }}>
               <option value={'sine'}>SIN</option>
               <option value={'square'}>SQU</option>
               <option value={'triangle'}>TRI</option>
               <option value={'sawtooth'}>SAW</option>
             </select>

                 <Knob width={KNOB_SIZE} height={KNOB_SIZE}
                       decimals={0}
                       value={this.props.params.semiTones}
                       highlightColor={'#F94144'}
                       label={'semi'}
                       max={24}
                       min={-24}
                       style={{marginBottom: '8px'}}
                       onChange={n => {
                           this.props.setSemiTones(n);
                           this.props.oscillator.semitones = Math.round(n);
                       }} />

                 <ParamKnob width={KNOB_SIZE} height={KNOB_SIZE}
                            decimals={0}
                            value={this.props.params.detune}
                            highlightColor={'#F94144'}
                            label={'detune'}
                            unit={'ct'}
                            min={-100}
                            max={100}
                            style={{marginBottom: '8px'}}
                            onChange={this.props.setDetune}
                            param={this.props.oscillator.detune} />

                 <ParamKnob width={KNOB_SIZE} height={KNOB_SIZE}
                            decimals={2}
                            value={this.props.params.gain}
                            highlightColor={'#F94144'}
                            label={'gain'}
                            min={0}
                            max={1}
                            origin={0}
                            style={{marginBottom: '8px'}}
                            onChange={this.props.setGain}
                            param={this.props.gain} />
           </div>;
    }
}

const mapStateToProps = (state, ownProps) => ({
    params: state.synths[ownProps.synthId].params.oscillators[ownProps.oscillatorId],
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    setSemiTones: n => dispatch(setSynthOscillatorParams(
        ownProps.synthId, ownProps.oscillatorId, { semiTones: n }
    )),
    setDetune: n => dispatch(setSynthOscillatorParams(
        ownProps.synthId, ownProps.oscillatorId, { detune: n }
    )),
    setGain: g => dispatch(setSynthOscillatorParams(
        ownProps.synthId, ownProps.oscillatorId, { gain: g }
    )),
    setWaveform: w => dispatch(setSynthOscillatorParams(
        ownProps.synthId, ownProps.oscillatorId, { waveform: w }
    ))
});

OscillatorControl = connect(
    mapStateToProps,
    mapDispatchToProps
)(OscillatorControl);


export default OscillatorControl;
