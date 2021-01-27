import React from 'react';
import { connect } from 'react-redux';
import Color from 'color';

import TimelineAxis from './TimelineAxis';
import TimelineTrackControl from './TimelineTrackControl';
import TimelineTrack from './TimelineTrack';
import Fader from './Fader';

import { addTrack } from '../actions';

import { timelinePalette } from '../colors';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import * as Colors from '../colors';

const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'auto 1fr',
};

class Timeline extends React.Component {
    constructor(props) {
        super(props);
        this.addTrack = this.addTrack.bind(this);
    }

    addTrack() {
        this.props.addTrack();
    }

    render() {
        return <div>
                 <div style={gridStyle}>
                   <button style={{borderRadius: '0',
                                   margin: '0',
                                   border: '0',
                                   backgroundColor: '#2D2D2D',
                                   color: Colors.fgPrimary}}
                           onClick={this.addTrack}>
                     <FontAwesomeIcon icon={faPlus}
                                      color={Colors.fgPrimary}
                                      style={{marginRight:"8px"}} />
                     Add Track
                   </button>

                   <TimelineAxis/>
                   {
                       this.props.tracks.map(
                           (track, i) => ([
                               <TimelineTrackControl key={track.id*2 + 1}
                                                     id={track.id}
                                                     name={track.name}
                                                     color={timelinePalette[i]}/>,
                               <TimelineTrack key={track.id*2}
                                              id={track.id}
                                              number={track.id+1}
                                              color={timelinePalette[i]} />
                               ])
                       )
                   }
                 </div>
                 {/* <Fader width={50} height={300}/> */}
        </div>;
    }
}

const mapStateToProps = (state, ownProps) => ({
    tracks: state.tracks,
});
const mapDispatchToProps = (dispatch) => ({
    addTrack: () => dispatch(addTrack()),
});

Timeline = connect(
    mapStateToProps,
    mapDispatchToProps
)(Timeline);

export default Timeline;
