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
        return 'resizeRight';
    } else {
        return 'move';
    }
};

class PianoRollNote extends React.Component {
    constructor(props) {
        super(props);

        this.dragAction = "";
        this.dragInitialValue = 0;
        this.dragClientOrigin = 0;

        this.ref = React.createRef();

        this.dispatchDragAction = this.dispatchDragAction.bind(this);
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.onDrag = this.onDrag.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onClick = this.onClick.bind(this);
        this.onRightClick = this.onRightClick.bind(this);
    }

    dispatchDragAction(value) {
        const actionToDispatch = {
            move: () => this.props.setPosition(value),
            resizeRight: () => this.props.setDuration(value),
        };

        actionToDispatch[this.dragAction]();
    }

    onDrag(event) {
        event.stopPropagation();
        event.preventDefault();

        const secondsPerBeat = 60 / this.props.beatsPerMinute;
        const movement = event.clientX - this.dragClientOrigin;
        const delta = movement/(secondsPerBeat*this.props.pixelsPerSecond);
        let value = this.dragInitialValue + delta;

        const snapToBeat = !event.shiftKey;
        if (snapToBeat) value = Math.round(value);

        this.dispatchDragAction(value);
    }

    onMouseDown(event) {
        event.stopPropagation();
        event.preventDefault();

        this.dragAction = getDragAction(event);
        switch (this.dragAction) {
        case 'move':
            this.dragInitialValue = this.props.note.position;
            break;
        case 'resizeRight':
            this.dragInitialValue = this.props.note.duration;
            break;
        }
        this.dragClientOrigin = event.clientX;

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
        case 'resizeRight':
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
        const width = this.props.note.duration * pixelsPerBeat - 2;

        const style = {
            position: 'absolute',
            height: '19px',
            width: width + 'px',
            left: position+ 'px',
            backgroundColor: 'green',
            borderRadius: '4px',
            border: '1px solid #002200',
            marginRight: '1px',
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
