import React from 'react';
import { connect } from 'react-redux';
import Fader from './Fader';
import * as Colors from '../colors';

const style = {
    width: '100%',
    textAlign: 'left',
    backgroundColor: Colors.bgDarker,
    // padding: '16px',
};

class Mixer extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <div style={style}>
                 {
                     this.props.tracks.map(track =>
                         <Fader width={40}
                                height={250}
                                key={track.id}
                                trackId={track.id}
                                onChanged={undefined}/>
                     )
                 }
               </div>;
    }
}

const mapStateToProps = (state, ownProps) => ({
    tracks: state.tracks
});

const mapDispatchToProps = (dispatch, ownProps) => ({ });

Mixer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Mixer);

export default Mixer;
