import React from 'react';
import { connect } from 'react-redux';

import { setNotePosition,
         setNoteDuration,
         markNoteForRemoval } from '../actions';


/**
 * Get drag action given mouse event.
 */
const getDragAction = (event) => {
    const bound = event.target.getBoundingClientRect();
    if (Math.abs(bound.right - event.clientX) < 5) {
        return 'resize';
    } else {
        return 'move';
    }
};

class PianoRollNote extends React.Component {
    constructor(props) {
        super(props);

        this.dragAction = "";

        this.ref = React.createRef();

        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.onDrag = this.onDrag.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onClick = this.onClick.bind(this);
        this.onRightClick = this.onRightClick.bind(this);
    }

    onDrag(event) {
        event.stopPropagation();
        event.preventDefault();

        const secondsPerBeat = 60 / this.props.beatsPerMinute;
        const delta = event.movementX/(secondsPerBeat*this.props.pixelsPerSecond);

        if (this.dragAction === 'move') {
            const position = this.props.note.position + delta;
            this.props.setPosition(position);
        } else if (this.dragAction === 'resize') {
            const duration = this.props.note.duration + delta;
            this.props.setDuration(duration);
        }
    }

    onMouseDown(event) {
        event.stopPropagation();
        event.preventDefault();

        this.dragAction = getDragAction(event);

        document.addEventListener('mousemove', this.onDrag, true);
        document.addEventListener('mouseup', this.onMouseUp, true);
    }

    onMouseUp(event) {
        event.stopPropagation();
        event.preventDefault();

        document.removeEventListener('mousemove', this.onDrag, true);
        document.removeEventListener('mouseup', this.onMouseUp, true);
    }

    onMouseMove(event) {
        const dragAction = getDragAction(event);
        switch (dragAction) {
        case 'move':
            this.ref.current.style.cursor = 'move';
            break;
        case 'resize':
            this.ref.current.style.cursor = 'ew-resize';
        }
    }

    onClick(event) {
        event.stopPropagation();
        event.preventDefault();
    }

    onRightClick(event) {
        event.stopPropagation();
        event.preventDefault();

        this.props.markForRemoval();
    }

    render() {
        const secondsPerBeat = 60 / this.props.beatsPerMinute;
        const pixelsPerBeat = secondsPerBeat * this.props.pixelsPerSecond;

        if (!this.props.note) debugger;
        const position = this.props.note.position * pixelsPerBeat;
        const width = this.props.note.duration * pixelsPerBeat;

        const style = {
            position: 'absolute',
            height: '20px',
            width: width + 'px',
            left: position+ 'px',
            backgroundColor: 'green',
            borderRadius: '4px'
        };

        return <div style={style}
                    ref={this.ref}
                    onMouseDown={this.onMouseDown}
                    onClick={this.onClick}
                    onContextMenu={this.onRightClick}
                    onMouseMove={this.onMouseMove}></div>;
    }
}

const mapStateToProps = (state, ownProps) => ({
    pixelsPerSecond: state.timeline.pixelsPerSecond,
    beatsPerMinute: state.timeline.beatsPerMinute,
    beatsPerBar: state.timeline.beatsPerBar,
    note: state.patterns[ownProps.patternId].notes[ownProps.id],
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    setPosition: position => dispatch(setNotePosition(ownProps.patternId, ownProps.id, position)),
    setDuration: duration => dispatch(setNoteDuration(ownProps.patternId, ownProps.id, duration)),
    markForRemoval: () => dispatch(markNoteForRemoval(ownProps.patternId, ownProps.id)),
});

PianoRollNote = connect(
    mapStateToProps,
    mapDispatchToProps
)(PianoRollNote);

export default PianoRollNote;
