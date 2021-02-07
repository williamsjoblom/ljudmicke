import React from 'react';
import { connect } from 'react-redux';
import Color from 'color';

import { editEntity,
         setEntityPosition,
         setEntityDuration } from '../actions';
import styled from 'styled-components';

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

const NameLabel = styled.p`
    position: absolute;
    margin: 0 0px;
    color: ${props => props.color};
    width: ${props => props.width - 8}px;
    font-family: Roboto Mono;
    font-size: 10pt;
    background-color: rgba(0, 0, 0, 0.1);
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    user-select: none;
    font-weight: 500;
    text-align: left;
    padding: 0 0 0 8px;
    z-index: 300;
`;

export default class TimelineEntity extends React.Component {

    constructor(props) {
        super(props);
        this.canvasRef = React.createRef();

        this.dragAction = "";
        this.dragInitialValue = 0;
        this.dragClientOrigin = 0;

        this.onDrag = this.onDrag.bind(this);
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.onClick = this.onClick.bind(this);
        this.onRightClick = this.onRightClick.bind(this);
        this.dispatchDragAction = this.dispatchDragAction.bind(this);
    }

    onClick(event) {
        event.stopPropagation();
        // WARNING: We also use a doubleclick handler, so if things
        // need to be added here, think it through!
    }

    onRightClick(event) {
        event.stopPropagation();
        event.preventDefault();

        this.props.markForRemoval();
    }

    onMouseDown(event) {
        event.stopPropagation();
        event.preventDefault();

        this.dragAction = getDragAction(event);
        switch (this.dragAction) {
        case 'move':
            this.dragInitialValue = this.props.entity.position;
            break;
        case 'resizeRight':
            this.dragInitialValue = this.props.entity.duration;
            break;
        }
        this.dragClientOrigin = event.clientX;

        document.addEventListener('mousemove', this.onDrag);
        document.addEventListener('mouseup', this.onMouseUp);
    }

    onMouseUp(event) {
        event.stopPropagation();

        document.removeEventListener('mousemove', this.onDrag);
        document.removeEventListener('mouseup', this.onMouseUp);
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
        const delta = movement/(this.props.pixelsPerSecond);
        let value = this.dragInitialValue + delta;

        const snapToBeat = !event.shiftKey;
        if (snapToBeat) value = Math.round(value/secondsPerBeat)*secondsPerBeat;

        this.dispatchDragAction(value);
    }

    onMouseMove(event) {
        const dragAction = getDragAction(event);
        switch (dragAction) {
        case 'move':
            event.target.style.cursor = 'move';
            break;
        case 'resizeRight':
            event.target.style.cursor = 'ew-resize';
            break;
        }
    }

    render() {
        const pps = this.props.pixelsPerSecond;
        const pxWidth = this.props.entity.duration * pps;
        const pxPosition = this.props.entity.position * pps;

        const style = {
            border: '1px solid black',
            borderRadius: '0px',
            height: '100px',
            marginTop: '4px',
            marginBottom: '4px',
            width: pxWidth + 'px',
            position: 'absolute',
            top: '0px',
            left: pxPosition + 'px',
            backgroundColor: this.props.color,
            cursor: 'move'
        };
        return <div style={style}
                    onMouseDown={this.onMouseDown}
                    onMouseMove={this.onMouseMove}
                    onClick={this.onClick}
                    onDoubleClick={this.props.onDoubleClick}
                    onContextMenu={this.onRightClick}>
                 <NameLabel color={Color(this.props.color).darken(0.75)}
                            width={pxWidth}>
                   {this.props.entity.name}
                 </NameLabel>
                 { this.props.children }
               </div>;
    }
}


const mapStateToProps = (state, ownProps) => ({
    pixelsPerSecond: state.timeline.pixelsPerSecond,
    beatsPerMinute: state.timeline.beatsPerMinute,
    entity: state.tracks[ownProps.trackId].entities[ownProps.id],
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    setPosition: (position) => dispatch(
        setEntityPosition(ownProps.id, ownProps.trackId, position)
    ),
    setDuration: (duration) => dispatch(
        setEntityDuration(ownProps.id, ownProps.trackId, duration)
    ),
    markForRemoval: () => dispatch(
        editEntity(ownProps.id, ownProps.trackId, { markedForRemoval: true })
    ),
    editEntity: (changes) => dispatch(editEntity(ownProps.id, ownProps.trackId, changes)),
});

TimelineEntity = connect(
    mapStateToProps,
    mapDispatchToProps
)(TimelineEntity);
