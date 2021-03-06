import React from 'react';
import { connect } from 'react-redux';
import './App.css';

import { BottomDrawer, BottomDrawerTab } from './components/BottomDrawer';

import ToolBar from './components/ToolBar';
import Timeline from './components/Timeline';
import PianoRoll from './components/PianoRoll';
import Mixer from './components/Mixer';
import * as Instruments from './instruments';

import {
    mdiTuneVertical,
    mdiPiano,
} from '@mdi/js';

import * as Tone from 'tone';
import * as MIDI from './midi';
import * as Keyboard from './keyboard';
import { setMIDIDevices } from './actions';


class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            instrumentsReady: false,
        };

        this.onMIDI = this.onMIDI.bind(this);
    }

    onMIDI(key, velocity) {
        const f = Tone.Midi(key).toFrequency();
        if (velocity > 0) {
            Instruments.getInstrument(0).triggerAttack(f, Tone.now(), velocity);
        } else {
            Instruments.getInstrument(0).triggerRelease(f, Tone.now());
        }
    }

    componentDidMount() {

        MIDI.getInputDevices()
            .then(devices => {
                this.props.setMIDIDevices(
                    devices.map(device => device.name)
                );
            });

        Instruments.init(this.props.synths)
            .then(() => {
                this.setState({ instrumentsReady: true });
                MIDI.addKeyboardListener(this.onMIDI);
                Keyboard.addMIDIListener(this.onMIDI);
            });


    }

    componentWillUnmount() {
        if (this.state.instrumentsReady) {
            MIDI.removeKeyboardListener(this.onMIDI);
            Keyboard.removeMIDIListener(this.onMIDI);
        }
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
                  <PianoRoll patternId={this.props.patternToEdit}/>
                </BottomDrawerTab>
                  {
                      this.state.instrumentsReady ?
                          this.props.synths.map(synth => {
                              return <BottomDrawerTab name={synth.name}
                                                      icon={mdiPiano}
                                                      resizable>
                                         { Instruments.getInstrument(synth.id).component() }
                                     </BottomDrawerTab>
                          }) : null
                  }
              </BottomDrawer>
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => ({
    tracks: state.tracks,
    synths: state.synths,
    patternToEdit: state.timeline.patternToEdit,
});
const mapDispatchToProps = (dispatch) => ({
    setMIDIDevices: devices => dispatch(setMIDIDevices(devices)),
});

App = connect(
    mapStateToProps,
    mapDispatchToProps
)(App);

export default App;
