import React from 'react';
import { connect } from 'react-redux';

import Knob from '../../components/Knob';
import ParamKnob from '../../components/ParamKnob';
import { setSynthOscillatorParams, setSynthParams } from '../../actions';

import {
    KNOB_WRAPPER_STYLE,
    KNOB_WRAPPER_TEXT_STYLE,
    KNOB_SIZE,
} from './common';

class FilterControl extends React.Component  {
    render() {
        return <div style={KNOB_WRAPPER_STYLE}>
                 <span style={KNOB_WRAPPER_TEXT_STYLE}>
                   {this.props.name}
                 </span>
                 <ParamKnob width={KNOB_SIZE} height={KNOB_SIZE}
                            value={this.props.params.cutoff}
                            label={'cutoff'}
                            min={10}
                            max={10000}
                            unit={'Hz'}
                            param={this.props.filterGain.gain}
                            style={{marginBottom: '8px'}}
                            highlightColor={this.props.color}
                            onChange={this.props.setCutoff}/>

                 <ParamKnob width={KNOB_SIZE} height={KNOB_SIZE}
                            value={this.props.params.resonance}
                            label={'resonance'}
                            min={0}
                            max={40}
                            param={this.props.filter.Q}
                            style={{marginBottom: '8px'}}
                            highlightColor={this.props.color}
                            onChange={this.props.setResonance}/>

                 <Knob width={KNOB_SIZE} height={KNOB_SIZE}
                       value={this.props.params.envelopeIntensity}
                       highlightColor={this.props.color}
                       label={'eg int'}
                       style={{marginBottom: '8px'}}
                       onChange={this.props.setEnvelopeIntensity}/>
               </div>;
    }
};

const mapStateToProps = (state, ownProps) => ({
    params: state.synths[ownProps.synthId].params.filter,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    setCutoff: f => dispatch(setSynthParams(
        ownProps.synthId, { filter: { cutoff: f } }
    )),
    setResonance: n => dispatch(setSynthParams(
        ownProps.synthId, { filter: { resonance: n } }
    )),
    setEnvelopeIntensity: i => dispatch(setSynthParams(
        ownProps.synthId, { filter: { envelopeIntensity: i} }
    )),
});

FilterControl = connect(
    mapStateToProps,
    mapDispatchToProps
)(FilterControl);

export default FilterControl;
