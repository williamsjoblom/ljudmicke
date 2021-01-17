import React from 'react';
import { connect } from 'react-redux';
import * as Tone from 'tone';

import { uniqueId } from '../id';
import { freq } from '../audio';

import { makeBackgroundLines } from '../cssUtil';
import PianoRollNote from './PianoRollNote';
import TimelineAxis from './TimelineAxis';
import * as MIDI from '../midi';
import * as Colors from '../colors';

import Note from '../note';
import { addNote } from '../actions';

MIDI.getInputDevices().then(devices => console.log(devices));

const isSharp = (key) => {
    if (key < 0) return false;
    key %= 12; // normalize to single octave
    return key == 1 || key == 3 || key == 5 || key == 8 || key == 10;
};


const LINE_HEIGHT = 20;

const keyStyle = {
    position: 'relative',
    display: 'block',
    backgroundColor: 'white',
    width: '100%',
    borderRadius: '0 5px 5px 0',
    borderRight: '1px gray solid',
    borderBottom: '1px gray solid',
    boxShadow: 'inset 0px -2px 1px 0px rgba(0,0,0,0.1), inset 0px 2px 1px 0px rgba(0,0,0,0.1)'
};

const sharpKeyStyle = {
    zIndex: '10',
    position: 'relative',
    display: 'block',
    width: '60%',
    background:'linear-gradient(135deg, #222 0%, #555 100%)',
    borderRadius: '0 3px 3px 0',
    borderRight: '1px gray solid',
    borderTop: '1px gray solid',
    borderBottom: '1px gray solid',
    boxShadow: 'inset -5px 0px 2px 0px rgba(0,0,0,0.4)'
};

const getKeyStyle = (key) => {
    key %= 12; // normalize to single octave
    const prevSharp = isSharp(key - 1);
    const sharp = isSharp(key);
    const nextSharp = isSharp(key + 1);

    let height = LINE_HEIGHT - 1;
    height += prevSharp ? LINE_HEIGHT/2 : 0;
    height += nextSharp ? LINE_HEIGHT/2 : 0;

    let marginTop = sharp ? -LINE_HEIGHT/2 : 0;
    marginTop += prevSharp ? -LINE_HEIGHT/2 - 1 : 0;

    return {
        ...(sharp ? sharpKeyStyle : keyStyle),
        height: height + 'px',
        marginTop: marginTop + 'px',
    };
};

const pianoStyle = {
    display: 'inline-block',
    width: '108px',
};

const KEYS_PER_OCTAVE = 12;
const FIRST_OCTAVE = 4;
const OCTAVES = 5;

/**
 * Convert line index to MIDI key.
 */
const lineToKey = (line) => {
    const LAST_OCTAVE = (FIRST_OCTAVE + OCTAVES)*KEYS_PER_OCTAVE;
    return LAST_OCTAVE - line;
};

class PianoRoll extends React.Component {
    constructor(props) {
        super(props);
        this.onMIDI = this.onMIDI.bind(this);
        this.wrapperRef = React.createRef();

        this.keys = [];
        const nKeys = KEYS_PER_OCTAVE * OCTAVES;
        for (let i = 0; i < nKeys; i++) {
            this.keys.push(<div style={getKeyStyle(i)} key={i}></div>);
        }

        this.onClick = this.onClick.bind(this);
        this.synth = null;
        Tone.context.resume();
    }

    onMIDI(key, velocity) {
        const keys = this.wrapperRef.current.childNodes;
        const which = (keys.length - 1) - key % keys.length;
        const node = keys[which];

        const now = Tone.now();
        if (velocity == 0) {
            node.style.backgroundColor = isSharp(which) ? 'black' : 'white';
            this.synth.triggerRelease(freq(key), now);
        } else {
            node.style.backgroundColor = isSharp(which) ? 'gray' : 'silver';
            this.synth.triggerAttack(freq(key), now, velocity);
        }
    }

    componentDidMount() {
        this.synth = new Tone.PolySynth(Tone.Synth, {
	    oscillator: {
		partials: [0, 2, 3, 4],
	    }
	}).toDestination();
        MIDI.addKeyboardListener(this.onMIDI);
    }

    componentWillUnmount() {
        MIDI.removeKeyboardListener(this.onMIDI);
    }

    onClick(line, event) {
        const bound = event.target.getBoundingClientRect();
        const pxPosition = event.clientX - bound.left;
        let position = pxPosition / this.props.pixelsPerSecond;

        const snapToBeat = !event.shiftKey;
        if (snapToBeat) {
            const secondsPerBeat = 60 / this.props.beatsPerMinute;
            position = Math.floor(position/secondsPerBeat);
        }

        const key = lineToKey(line);
        const id = this.props.pattern.notes.length;
        this.props.addNote(Note(id, key, position, 1));
    }

    render() {
        const secondsPerBeat = 60 / this.props.beatsPerMinute;
        const pixelsPerBeat = secondsPerBeat * this.props.pixelsPerSecond;
        const pixelsPerBar = pixelsPerBeat * this.props.beatsPerBar;

        const divisionStyle = i => ({
            position: 'relative',
            height: LINE_HEIGHT + 'px',
            backgroundColor: i % 2 ? Colors.bgDarker : Colors.bgDark,
            ...makeBackgroundLines(Math.round(pixelsPerBar), Math.round(pixelsPerBeat))
        });

        return <div style={{display: 'flex'}}>
                 <div style={pianoStyle} ref={this.wrapperRef}>
                   { this.keys }
                 </div>
                 <div style={{ flex: '1' }}>
                   {
                       this.keys.map((key, i) => {
                           return <div style={divisionStyle(i)}
                                       onClick={e => this.onClick(i, e)}>
                                    {
                                        this.props.pattern.notes
                                            .filter(note => note.key === lineToKey(i) && !note.markedForRemoval)
                                            .map(note =>
                                                <PianoRollNote
                                                  patternId={this.props.pattern.id}
                                                  id={note.id}/>
                                            )
                                    }
                                  </div>;
                       })
                   }
                 </div>
               </div>;
    }
}

const mapStateToProps = (state, ownProps) => ({
    pixelsPerSecond: state.timeline.pixelsPerSecond,
    beatsPerMinute: state.timeline.beatsPerMinute,
    beatsPerBar: state.timeline.beatsPerBar,
    pattern: state.patterns[ownProps.patternId],
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    addNote: note => dispatch(addNote(ownProps.patternId, note)),
});

PianoRoll = connect(
    mapStateToProps,
    mapDispatchToProps
)(PianoRoll);

export default PianoRoll;
