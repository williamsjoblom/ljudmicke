import React from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVolumeMute, faWaveSquare } from '@fortawesome/free-solid-svg-icons';
import { setVolume, setPan } from '../actions';

import Knob from './Knob';
import ParamKnob from './ParamKnob';
import FaButton from './FaButton';

import * as Colors from '../colors';

import Icon from '@mdi/react';
import { mdiPiano,
         mdiWaveform,
         mdiFunctionVariant,
  mdiVolumeMute,
  mdiRobotExcitedOutline} from '@mdi/js';

const buttonStyle = {
    display: 'inline-block',
    margin: '0 4px 0 0',
    padding: 0,
    boxShadow: 'none',
    borderRadius: '0px',
    border: '1px solid #444444',
    width:  '30px',
    height: '100%',
    backgroundColor: '#2D2D2D',
};

const getTrackIcon = (trackType) => {
    switch (trackType) {
    case 'audio': return mdiWaveform;
    case 'midi': return mdiPiano;
    case 'automation': return mdiRobotExcitedOutline;
    default:
        console.error('unknown track type: "' + this.props.trackType + '"');
        return null;
    }
};

class TimelineTrackControl extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const style = {
            display: 'inline-block',
            backgroundColor: Colors.bgDark,
            display: 'flex',
            width: '155pt',
            borderTop: '2px solid ' + Colors.bgTrackDivider,
        };

        const buttonDivStyle = {
            display: 'block',
        };

        const topBarEntryStyle = {
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            marginBottom: '6px',
            paddingLeft: '6px',
            paddingRight: '6px',
        };

        return <div style={style}>
                 <div style={{backgroundColor: this.props.color,
                              height: '100%',
                              width: '10px',
                              position: 'relative',
                              borderRight: "1px solid " + Colors.bgTrackDivider}}>
                 </div>
                 <div style={{flex: '1',
                              borderRight: "1px solid " + Colors.bgTrackDivider}}>
                   <div style={{
                       width: '100%',
                       borderBottom: '2px solid ' + Colors.bgLight,
                       display: 'grid',
                       gridGap: '0',
                       gridTemplateColumns: '1fr auto auto',
                   }}>
                     <div style={topBarEntryStyle}>
                       <Icon path={getTrackIcon(this.props.trackType)}
                             color={Colors.fgPrimary}
                             size={1}
                             style={{display: 'inline-block'}}/>

                       <span style={{
                           color: Colors.fgPrimary,
                           fontSize: '10pt',
                           fontWeight: '500',
                           marginLeft: '4px'}}>
                         {this.props.name}
                       </span>
                     </div>

                     <div style={{
                         ...topBarEntryStyle,
                         borderLeft: '2px solid' + Colors.bgLight,
                     }}>
                         <Icon path={mdiFunctionVariant}
                               color={Colors.fgSecondary}
                               size={.8}
                               style={{}}/>
                     </div>
                     <div style={{
                         ...topBarEntryStyle,
                         alignText: 'center',
                         borderLeft: '2px solid' + Colors.bgLight,
                     }}>
                         <Icon path={mdiVolumeMute}
                               color={Colors.fgSecondary}
                               size={.8}/>
                     </div>
                   </div>


                   <div style={{display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'space-around',
                                paddingTop: '8px'}}>
                     <ParamKnob width={40}
                                height={40}
                                decimal={2}
                                value={this.props.volume}
                                highlightColor={this.props.color}
                                label={'vol'}
                                min={0}
                                max={2}
                                onChange={this.props.setVolume}
                                param={this.props.volumeParam} />

                     <ParamKnob width={40}
                                height={40}
                                decimal={2}
                                origin={0}
                                min={-1}
                                max={1}
                                value={this.props.pan}
                                label={'pan'}
                                highlightColor={this.props.color}
                                onChange={this.props.setPan}
                                param={this.props.panParam}/>
                   </div>
                 </div>
               </div>;
    }
}

const mapStateToProps = (state, ownProps) => ({
    trackType: state.tracks[ownProps.id].type,
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
