import React from 'react';
import { connect } from 'react-redux';
import Color from 'color';

import TimelineAxis from './TimelineAxis';
import TimelineTrackControl from './TimelineTrackControl';
import TimelineTrack from './TimelineTrack';
import AddTrackDropdown from './AddTrackDropdown';

import { addTrack } from '../actions';

import { timelinePalette } from '../colors';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import * as Colors from '../colors';
import * as Tracks from '../tracks';

const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'auto 1fr',
};

class Timeline extends React.Component {
    constructor(props) {
        super(props);
        this.toggleAddTrackDropdown = this.toggleAddTrackDropdown.bind(this);
        this.addTrack = this.addTrack.bind(this);

        this.state = {
            showAddTrackDropdown: false,
        };
    }

    toggleAddTrackDropdown() {
        this.setState({
            showAddTrackDropdown: !this.state.showAddTrackDropdown,
        });
    }

    addTrack(type, name) {
        this.setState({
            showAddTrackDropdown: false,
        });
        this.props.addTrack(type);
    }

    render() {
        return <div>
                 <div style={gridStyle}>
                   <div>
                     <button style={{borderRadius: '0',
                                     margin: '0',
                                     border: '0',
                                     position: 'relative',
                                     width: '100%',
                                     height: '100%',
                                     backgroundColor: '#2D2D2D',
                                     color: Colors.fgPrimary}}
                             onClick={this.toggleAddTrackDropdown}>
                       <FontAwesomeIcon icon={faPlus}
                                        color={Colors.fgPrimary}
                                        style={{marginRight:"8px"}} />
                       Add Track
                     </button>
                     {
                         this.state.showAddTrackDropdown &&
                             <AddTrackDropdown onAdd={this.addTrack}/>
                     }
                   </div>

                   <TimelineAxis/>
                   {
                       this.props.tracks.map(
                           (track, i) => ([
                               <TimelineTrackControl key={track.id*2 + 1}
                                                     id={track.id}
                                                     name={track.name}
                                                     color={timelinePalette[i]}
                                                     volumeParam={
                                                         Tracks
                                                             .getTrackEffectChain(track.id)
                                                             .gain
                                                             .gain
                                                     }
                                                     panParam={
                                                         Tracks
                                                             .getTrackEffectChain(track.id)
                                                             .pan
                                                             .pan
                                                     }/>,
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
    addTrack: (type, name) => dispatch(addTrack(type, name)),
});

Timeline = connect(
    mapStateToProps,
    mapDispatchToProps
)(Timeline);

export default Timeline;
