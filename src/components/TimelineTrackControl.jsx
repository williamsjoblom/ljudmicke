import React from 'react';
import { connect } from 'react-redux';
import { faVolumeMute, faWaveSquare } from '@fortawesome/free-solid-svg-icons';
import { setVolume, setPan } from '../actions';

import Knob from './Knob';
import FaButton from './FaButton';

import * as Colors from '../colors';

class TimelineTrackControl extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const style = {
            display: 'inline-block',
            backgroundColor: Colors.bgLighter,
            display: 'flex',
            borderBottom: '1px solid ' + Colors.bgTrackDivider,
        };

        const buttonDivStyle = {
            display: 'block',
        };

        return <div style={style}>
                 <div style={{backgroundColor: this.props.color,
                              height: '100%',
                              width: '10px',
                              position: 'relative',
                              borderRight: "1px solid " + Colors.bgTrackDivider}}>
                 </div>
                 <div style={{flex: '1',
                              marginLeft: '8px',
                              paddingRight: '8px',
                              borderRight: "1px solid " + Colors.bgTrackDivider}}>
                   <h3 style={{color: Colors.fgPrimary}}>{this.props.name}</h3>

                   <Knob width={40}
                         height={40}
                         value={this.props.volume}
                         onChanged={this.props.setVolume}/>

                   <Knob width={40}
                         height={40}
                         value={this.props.pan}
                         onChanged={this.props.setPan}/>

                   <div style={buttonDivStyle}>
                     <FaButton icon={faVolumeMute} />
                     <FaButton icon={faWaveSquare} />
                   </div>
                 </div>
               </div>;
    }
}

const mapStateToProps = (state, ownProps) => ({
    volume: state.tracks[ownProps.id].volume,
    pan: state.tracks[ownProps.id].pan,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    setVolume: (volume) => dispatch(setVolume(ownProps.id, volume)),
    setPan: (pan) => dispatch(setPan(ownProps.id, pan))
});

TimelineTrackControl = connect(
    mapStateToProps,
    mapDispatchToProps
)(TimelineTrackControl);

export default TimelineTrackControl;
