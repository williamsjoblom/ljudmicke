import React from 'react';
import { connect } from 'react-redux';

import { setBeatsPerMinute, setPatternToPaint } from '../actions';

import { faPlay, faPause, faStop, faCircle } from '@fortawesome/free-solid-svg-icons';
import FaButton from './FaButton';
import LabeledInput from './LabeledInput';

import { play, pause, stop } from '../audio';

import * as Colors from '../colors';


import Icon from '@mdi/react';
import {
    mdiMidi,
    mdiMetronome,
    mdiMidiPort,
    mdiFormatPaint,
} from '@mdi/js';


const style = {
    width: '100%',
    height: '40px',
    backgroundColor: Colors.bgLight,//'#545454',
    borderBottom: '1px solid #444444',
    padding: '5px 0',
    margin: '0',
    textAlign: 'left',
};

class ToolBar extends React.Component {
    constructor(props) {
        super(props);
        this.onChangePatternToPaint = this.onChangePatternToPaint.bind(this);
    }

    onChangePatternToPaint(event) {
        this.props.setPatternToPaint(+event.target.value);
    }

    render() {
        return <nav style={style}>

                 <h1 style={{ display: 'inline',
                              color: Colors.fgTernary,
                              fontSize: '27pt',
                              fontWeight: '400',
                              margin: '0 12px'}}>
                   ljud<span style={{color: Colors.fgSecondary}}>micke</span>
                 </h1>

                 <FaButton icon={!this.props.playing ? faPlay : faPause}
                           width={30}
                           height={30}
                           onClick={() =>
                               !this.props.playing
                                   ? play(this.props.tracks)
                                   : pause()
                           }/>
                 <FaButton icon={faStop}
                           width={30}
                           height={30}
                           onClick={() => stop()}/>
                 <FaButton icon={faCircle}
                           width={30}
                           height={30}/>

                 <LabeledInput value={this.props.beatsPerMinute}
                               icon={mdiMetronome}
                               label={'bpm'}
                               width={30}
                               height={30}>
                   <input type="text"
                          value={this.props.beatsPerMinute}
                          onChange={e => this.props.setBeatsPerMinute(e.target.value)}>
                   </input>
                 </LabeledInput>

                 <LabeledInput value={"Pattern 1"}
                               icon={mdiFormatPaint}
                               width={150}
                               height={30}>
                   <select value={this.props.patternToPaint}
                           onChange={this.onChangePatternToPaint}>
                     {
                         this.props.patterns.map(pattern =>
                             <option key={pattern.id} value={pattern.id}>
                               {pattern.name}
                             </option>
                         )
                     }
                   </select>
                 </LabeledInput>

                 <LabeledInput icon={mdiMidi}
                               width={160}
                               height={30}>
                   <select>
                     <option>M-Audio KeyStudio</option>
                   </select>
                 </LabeledInput>
               </nav>;
    }
}

const mapStateToProps = (state) => ({
    tracks: state.tracks,
    patterns: state.patterns,
    beatsPerMinute: state.timeline.beatsPerMinute,
    playing: state.nonPersistent.playing,
    patternToPaint: state.timeline.patternToPaint,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    setBeatsPerMinute: bpm => dispatch(setBeatsPerMinute(bpm)),
    setPatternToPaint: id => dispatch(setPatternToPaint(id)),
});

ToolBar = connect(
    mapStateToProps,
    mapDispatchToProps
)(ToolBar);

export default ToolBar;
