import React from 'react';
import { connect } from 'react-redux';
import Fader from './Fader';
import * as Colors from '../colors';
import styled from 'styled-components';
import { setVolume } from '../actions';

const MixerWrapper = styled.div`
    width: 100%;
    text-align: left;
    background-color: ${Colors.bgDarker};
`;

const FaderWrapper = styled.div`
    display: inline-block;
    padding: 0;
    text-align: center;
    border-right: 1px solid ${Colors.bgDarker};
`;

const FaderRibbon = styled.div`
    display: block;
    background-color: ${props => props.color};
    width: 100%;
    height: 10px;
`;

const FaderLabel = styled.h1`
    display: block;
    color: ${Colors.fgPrimary};
    font-size: 12pt;
`;

const FaderContainer = styled.div`
    display: inline-block;
    padding: 0 16px;
    text-align: center;
    background-color: ${Colors.bgDark};
`;


class Mixer extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <MixerWrapper>
                 {
                     this.props.tracks.map(track =>
                         <FaderWrapper>
                           <FaderRibbon color={Colors.timelinePalette[track.id]}/>
                           <FaderContainer>
                             <FaderLabel>{track.name}</FaderLabel>
                             <Fader width={40}
                                    height={250}
                                    key={track.id}
                                    value={track.volume}
                                    highlightColor={Colors.timelinePalette[track.id]}
                                    trackId={track.id}
                                    onChange={v => this.props.setVolume(track.id, v)}/>
                           </FaderContainer>
                         </FaderWrapper>
                     )
                 }
               </MixerWrapper>;
    }
}

const mapStateToProps = (state, ownProps) => ({
    tracks: state.tracks
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    setVolume: (trackId, volume) => dispatch(setVolume(trackId, volume)),
});

Mixer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Mixer);

export default Mixer;
