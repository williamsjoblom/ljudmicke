import React from 'react';
import { connect } from 'react-redux';

import { setBeatsPerMinute } from '../actions';

import { faPlay, faPause, faCircle } from '@fortawesome/free-solid-svg-icons';
import FaButton from './FaButton';
import LabeledInput from './LabeledInput';

import { play } from '../audio';

import * as Colors from '../colors';


const style = {
    width: '100%',
    height: '40px',
    backgroundColor: Colors.bgLight,//'#545454',
    borderBottom: '1px solid #444444',
    paddingTop: '8px',
    margin: '0',
    textAlign: 'left',
};

class ToolBar extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <nav style={style}>

                 <h1 style={{ display: 'inline',
                              color: Colors.fgSecondary,
                              fontVariant: 'small-caps',
                              margin: '0 12px'}}>
                   Ljudmicke
                 </h1>
                 <FaButton icon={faPlay}
                           width={30}
                           height={30}
                           onClick={() => play(this.props.tracks)}/>
                 <FaButton icon={faCircle}
                           width={30}
                           height={30}
                           onClick={() => alert('not implemented')}/>
                 <LabeledInput value={this.props.beatsPerMinute}
                               label={'bpm'}
                               width={30}
                               height={30}
                               onChanged={this.props.setBeatsPerMinute}/>
               </nav>;
    }
}

const mapStateToProps = (state) => ({
    tracks: state.tracks,
    beatsPerMinute: state.timeline.beatsPerMinute,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    setBeatsPerMinute: bpm => dispatch(setBeatsPerMinute(bpm)),
});

ToolBar = connect(
    mapStateToProps,
    mapDispatchToProps
)(ToolBar);

export default ToolBar;
