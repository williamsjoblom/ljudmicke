import React from 'react';
import { connect } from 'react-redux';
import * as Tone from 'tone';
import styled from 'styled-components';

import { uniqueId } from '../id';
import { freq } from '../audio';

import { makeBackgroundLines } from '../cssUtil';
import PianoRollNote from './PianoRollNote';
import LabeledInput from './LabeledInput';
import * as MIDI from '../midi';
import * as Colors from '../colors';

import Note from '../note';
import { addNote, setNotePosition, setPatternToEdit } from '../actions';

import { mdiPiano } from '@mdi/js';

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
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
        flexDirection: 'column',
        alignItems: 'flex-end',
    };
};

const pianoStyle = {
    display: 'inline-block',
    width: '108px',
};

const StickyHeader = styled.div`
    position: sticky;
    background: ${Colors.bgDarker};
    top: 0;
    left: 0;

    height: 30px;
    flex: 0;
    z-index: 1000;
    text-align: left;
`;

const KEYS_PER_OCTAVE = 12;
const FIRST_OCTAVE = 1;
const OCTAVES = 5;

/**
 * Convert line index to MIDI key.
 */
const lineToKey = (line) => {
    const LAST_OCTAVE = (FIRST_OCTAVE + OCTAVES)*KEYS_PER_OCTAVE;
    return LAST_OCTAVE - line;
};

const keyToString = (key) => {
    const octave = Math.floor(key/12);
    const note = (key - 1) % 12;
    const noteToString = ['C', 'C#', 'D', 'D#', 'E',
                          'F', 'F#', 'G', 'G#', 'A',
                          'A#', 'B'];

    return `${noteToString[note]}${octave}`;
};

class PianoRoll extends React.Component {
    constructor(props) {
        super(props);
        this.onMIDI = this.onMIDI.bind(this);
        this.wrapperRef = React.createRef();
        this.gridRef = React.createRef();

        this.keys = [];
        const nKeys = KEYS_PER_OCTAVE * OCTAVES;
        for (let i = 0; i < nKeys; i++) {
            this.keys.push(<div style={getKeyStyle(i)} key={i}>
                             {
                                 lineToKey(i) % 12 === 1
                                     ? <span style={{
                                         marginRight: '4px',
                                         fontStyle: 'italic',
                                         color: '#A0A0A0',
                                         fontWeight: 400
                                     }}>{keyToString(lineToKey(i))}</span>
                                 : null
                             }
                           </div>);
        }

        this.keyUnderMouse = 0;

        this.onChangePatternToEdit = this.onChangePatternToEdit.bind(this);
        this.eventToNotePosition = this.eventToNotePosition.bind(this);
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.onDrag = this.onDrag.bind(this);

        this.synth = null;
        Tone.context.resume();
    }

    eventToNotePosition(event) {
        const bound = this.gridRef.current.getBoundingClientRect();
        const pxPosition = event.clientX - bound.left;
        const position = pxPosition / this.props.pixelsPerSecond;
        const snapToBeat = !event.shiftKey;

        const secondsPerBeat = 60 / this.props.beatsPerMinute;
        if (snapToBeat) {
            return Math.floor(position/secondsPerBeat);
        } else {
            return position/secondsPerBeat;
        }
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
        console.log(this.props);
    }

    componentWillUnmount() { }

    onMouseDown(event) {
        const id = this.props.pattern.notes.length;
        // const key = lineToKey(line);
        const position = this.eventToNotePosition(event);
        this.props.addNote(Note(id, this.keyUnderMouse, position, 1));

        document.addEventListener('mousemove', this.onDrag);
    }

    onMouseUp(event) {
        document.removeEventListener('mousemove', this.onDrag);
    }

    onDrag(event) {
        const position = this.eventToNotePosition(event);
        const notes = this.props.pattern.notes;
        const note = notes[notes.length - 1];
        this.props.setNotePosition(note, position, this.keyUnderMouse);
    }

    onChangePatternToEdit(event) {
        this.props.setPatternToEdit(+event.target.value);
    }

    render() {
        const secondsPerBeat = 60 / this.props.beatsPerMinute;
        const pixelsPerBeat = secondsPerBeat * this.props.pixelsPerSecond;
        const pixelsPerBar = pixelsPerBeat * this.props.beatsPerBar;

        const divisionStyle = i => ({
            position: 'relative',
            height: LINE_HEIGHT + 'px',
            backgroundColor: i % 2 ? Colors.bgDarker : Colors.bgDark,
            ...makeBackgroundLines(pixelsPerBar, pixelsPerBeat)
        });

        return [
            <StickyHeader>
              <LabeledInput value={"Pattern 1"}
                            icon={mdiPiano}
                            width={150}
                            height={30}>
                <select value={this.props.patternId}
                        onChange={this.onChangePatternToEdit}>
                  {
                      this.props.patterns.map(pattern =>
                          <option key={pattern.id} value={pattern.id}>
                            {pattern.name}
                          </option>
                      )
                  }
                </select>
              </LabeledInput>
            </StickyHeader>,
            <div style={{display: 'flex'}}>

              <div style={pianoStyle} ref={this.wrapperRef}>
                { this.keys }
              </div>
              <div style={{ flex: '1' }}
                   ref={this.gridRef}>
                {
                this.keys.map((key, i) => {
                    return <div style={divisionStyle(i)}
                                onMouseDown={this.onMouseDown}
                                onMouseUp={this.onMouseUp}
                                key={i}
                                onMouseOver={() => this.keyUnderMouse = lineToKey(i)}>
                             {
                                 this.props.pattern.notes
                                     .filter(note =>
                                         note.key === lineToKey(i) && !note.markedForRemoval
                                     ).map(note =>
                                         <PianoRollNote
                                           key={note.id}
                                           patternId={this.props.patternId}
                                           id={note.id} />
                                     )
                             }
                           </div>;
                })
                }
              </div>
            </div>
        ];
    }
}

const mapStateToProps = (state, ownProps) => ({
    pixelsPerSecond: state.timeline.pixelsPerSecond,
    beatsPerMinute: state.timeline.beatsPerMinute,
    beatsPerBar: state.timeline.beatsPerBar,
    pattern: state.patterns[ownProps.patternId],
    patterns: state.patterns,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    addNote: note => dispatch(
        addNote(ownProps.patternId, note)
    ),
    setNotePosition: (note, position, key) => dispatch(
        setNotePosition(ownProps.patternId, note.id, position, key)
    ),
    setPatternToEdit: id => dispatch(setPatternToEdit(id)),
});

PianoRoll = connect(
    mapStateToProps,
    mapDispatchToProps
)(PianoRoll);

export default PianoRoll;
