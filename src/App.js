import { connect } from 'react-redux';
import './App.css';

import NewWindow from 'react-new-window';

import ToolBar from './components/ToolBar';
import Timeline from './components/Timeline';
import PianoRoll from './components/PianoRoll';
import Mixer from './components/Mixer';

let App = (props) => {
    return (
        <div className="App">
          <ToolBar />
          <Timeline />
          <PianoRoll patternId={0} />
          <Mixer />
        </div>
    );
};

const mapStateToProps = (state, ownProps) => ({
    tracks: state.tracks
});
const mapDispatchToProps = (dispatch) => ({ });

App = connect(
    mapStateToProps,
    mapDispatchToProps
)(App);

export default App;
