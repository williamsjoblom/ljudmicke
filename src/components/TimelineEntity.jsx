import React from 'react';
import { connect } from 'react-redux';
import Entity from '../entity';
import Color from 'color';

import { editEntity } from '../actions';
import { getAudioBuffer } from '../audioStore';

const PIXELS_PER_SECOND = 30;

export default class TimelineEntity extends React.Component {

    constructor(props) {
        super(props);
        this.canvasRef = React.createRef();
        this.gridRef = React.createRef();

        this.dragInitialValue = 0;
        this.dragClientOrigin = 0;

        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
    }

    onMouseDown(event) {
        document.addEventListener('mousemove', this.onMouseMove);
        document.addEventListener('mouseup', this.onMouseUp);

        this.dragInitialValue = this.props.entity.position;
        this.dragClientOrigin = event.clientX;
    }

    onMouseUp(event) {
        document.removeEventListener('mousemove', this.onMouseMove);
        document.removeEventListener('mouseup', this.onMouseUp);
    }

    onMouseMove(event) {
        event.stopPropagation();
        event.preventDefault();

        const secondsPerBeat = 60 / this.props.beatsPerMinute;
        const movement = event.clientX - this.dragClientOrigin;
        const delta = movement/(this.props.pixelsPerSecond);
        let position = this.dragInitialValue + delta;

        const snapToBeat = !event.shiftKey;
        if (snapToBeat) position = Math.round(position/secondsPerBeat)*secondsPerBeat;

        this.props.setPosition(Math.max(position, 0));
    }

    render() {
        const pps = this.props.pixelsPerSecond;
        const pxWidth = this.props.entity.duration * pps;
        const pxPosition = this.props.entity.position * pps;

        const style = {
            border: '1px solid black',
            borderRadius: '3px',
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
                    ref={this.gridRef}>

                 <p style={{position:'absolute',
                            margin: '0 2px',
                            color: Color(this.props.color).darken(0.75),
                            width: pxWidth + 'px',
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                            userSelect: 'none',
                            fontWeight: '500',
                            }}>
                   {this.props.entity.name}
                 </p>
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
        editEntity(ownProps.id, ownProps.trackId, { position: position })
    ),
    editEntity: (changes) => dispatch(editEntity(ownProps.id, ownProps.trackId, changes)),
});

TimelineEntity = connect(
    mapStateToProps,
    mapDispatchToProps
)(TimelineEntity);
