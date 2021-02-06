import React from 'react';
import { connect } from 'react-redux';
import './App.css';

import { BottomDrawer, BottomDrawerTab } from './components/BottomDrawer';

import ToolBar from './components/ToolBar';
import Timeline from './components/Timeline';
import PianoRoll from './components/PianoRoll';
import Mixer from './components/Mixer';
import BasicSynthComponent from './synth/basic/Component';
import BasicSynth from './synth/basic/synth';

import {
    mdiTuneVertical,
    mdiPiano,
} from '@mdi/js';

import * as Tone from 'tone';
import * as MIDI from './midi';
import * as Keyboard from './keyboard';


class App extends React.Component {
    constructor(props) {
        super(props);
        this.mySynth = new BasicSynth();

        this.onMIDI = this.onMIDI.bind(this);
    }

    onMIDI(key, velocity) {
        const f = Tone.Midi(key).toFrequency();
        if (velocity > 0) {
            this.mySynth.triggerAttack(f, Tone.now(), velocity);
        } else {
            this.mySynth.triggerRelease(f, Tone.now());
        }
    }

    componentDidMount() {
        MIDI.addKeyboardListener(this.onMIDI);
        Keyboard.addMIDIListener(this.onMIDI);
    }

    componentWillUnmount() {
        MIDI.removeKeyboardListener(this.onMIDI);
        Keyboard.removeMIDIListener(this.onMIDI);
    }

    render() {
        return (
            <div className="App">
              <ToolBar />
              <Timeline />
              <BottomDrawer>
                <BottomDrawerTab name={"Mixer"}
                                 icon={mdiTuneVertical}>
                  <Mixer />
                </BottomDrawerTab>
                <BottomDrawerTab name={"Piano Roll"}
                                 icon={mdiPiano}
                                 resizable>
                  <PianoRoll patternId={0}/>
                </BottomDrawerTab>

                <BottomDrawerTab name={"Synth"}
                                 icon={mdiPiano}
                                 resizable>
                  <BasicSynthComponent synth={this.mySynth} />
                </BottomDrawerTab>
              </BottomDrawer>
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => ({
    tracks: state.tracks
});
const mapDispatchToProps = (dispatch) => ({ });

App = connect(
    mapStateToProps,
    mapDispatchToProps
)(App);

export default App;
