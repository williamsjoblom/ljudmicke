import React from 'react';
import Color from 'color';
import { connect } from 'react-redux';

import TimelineEntity from './TimelineEntity';
import { fgTimelineEntity } from '../colors';
import { setPatternToEdit } from '../actions';

class PatternEntity extends React.Component {
    constructor(props) {
        super(props);
        this.canvasRef = React.createRef();
        this.draw = this.draw.bind(this);
        this.onDoubleClick = this.onDoubleClick.bind(this);
    }

    draw() {
        const ctxt = this.canvasRef.current.getContext('2d');
        ctxt.clearRect(0, 0, ctxt.canvas.width, ctxt.canvas.height);

        const secondsPerBeat = 60 / this.props.beatsPerMinute;
        const pixelsPerBeat = secondsPerBeat * this.props.pixelsPerSecond;

        const keys = this.props.pattern.notes
              .filter(note => !note.markedForRemoval)
              .map(note => note.key);

        const minKey = Math.min(...keys);
        const maxKey = Math.max(...keys);
        const keyIntervalLength = maxKey - minKey;

        const maxNoteHeight = 16;
        const noteHeight = Math.min(ctxt.canvas.height / (keyIntervalLength + 1), maxNoteHeight);
        const remainingYSpace = ctxt.canvas.height - noteHeight*(keyIntervalLength + 1);
        const centeringOffset = remainingYSpace / 2;

        ctxt.fillStyle = fgTimelineEntity(this.props.color);
        this.props.pattern.notes.forEach(note => {
            const normalizedKey = keyIntervalLength - (note.key - minKey);
            if (!note.markedForRemoval) {
                ctxt.fillRect(note.position*pixelsPerBeat, centeringOffset + normalizedKey*noteHeight,
                              note.duration*pixelsPerBeat, noteHeight);
            }
        });
    }

    onDoubleClick() {
        this.props.setAsPatternToEdit(this.props.pattern.id);
    }

    componentDidMount() {
        this.draw();
    }

    componentDidUpdate() {
        this.draw();
    }

    render() {
        return <TimelineEntity {...this.props}
                               onDoubleClick={this.onDoubleClick}>
                 <canvas ref={this.canvasRef}
                         width={this.props.entity.duration*this.props.pixelsPerSecond}
                         style={{ position: 'relative',
                                  width: '100%',
                                  height: '100%' }}/>
               </TimelineEntity>;
    }
}

const mapStateToProps = (state, ownProps) => ({
    beatsPerMinute: state.timeline.beatsPerMinute,
    pixelsPerSecond: state.timeline.pixelsPerSecond,
    entity: state.tracks[ownProps.trackId].entities[ownProps.id],
    pattern: state.patterns[state.tracks[ownProps.trackId].entities[ownProps.id].patternKey],
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    setAsPatternToEdit: id => dispatch(setPatternToEdit(id)),
});

PatternEntity = connect(
    mapStateToProps,
    mapDispatchToProps,
)(PatternEntity);

export default PatternEntity;
