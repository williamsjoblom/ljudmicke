import React from 'react';
import { connect } from 'react-redux';
import Entity from '../entity';
import Color from 'color';

import { editEntity } from '../actions';
import { getAudioBuffer } from '../audioStore';

const PIXELS_PER_SECOND = 30;

const drawWaveform = (ctxt, audioBuffer, color) => {
    const width = ctxt.canvas.width;
    const height = ctxt.canvas.height;

    const data = audioBuffer.getChannelData(0);
    const step = Math.ceil(data.length / width);
    const scale = height/2;

    ctxt.fillStyle = color;
    for (let i = 0; i < width; i++) {
        var min = 1.0;
        var max = -1.0;
        for (var j=0; j<step; j++) {
            var datum = data[(i*step)+j];
            if (datum < min)
                min = datum;
            if (datum > max)
                max = datum;
        }
        ctxt.fillRect(i, (1+min)*scale, 1, Math.max(1,(max-min)*scale));
    }
};

export default class TimelineEntity extends React.Component {

    constructor(props) {
        super(props);
        this.canvasRef = React.createRef();

        this.drawWaveform = this.drawWaveform.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);

        this.dragging = false;
        this.positionBeforeDrag = this.props.entity.position;
    }

    drawWaveform(buffer) {
        const ctxt = this.canvasRef.current.getContext('2d');
        const foreground = Color(this.props.color).lighten(0.8);
        drawWaveform(ctxt, buffer, foreground);
    }

    componentDidMount() {
        const ctxt = new AudioContext();
        const buffer = getAudioBuffer(this.props.entity.bufferKey);
        this.drawWaveform(buffer);
    }

    onMouseDown(event) {
        this.dragging = true;
        this.dragStart = event.clientX;
        this.positionBeforeDrag = this.props.entity.position;
    }

    onMouseUp(event) {
        this.dragging = false;
        this.positionBeforeDrag = this.props.entity.position;
    }

    onMouseMove(event) {
        if (!this.dragging) return;

        const entity = this.props.entity;
        const pxPositionBeforeDrag = this.positionBeforeDrag*this.props.pixelsPerSecond;
        let position = pxPositionBeforeDrag + (event.clientX - this.dragStart);
        position = Math.max(position, 0);

        this.props.setPosition(position / this.props.pixelsPerSecond);
    }


    render() {
        const pps = this.props.pixelsPerSecond;
        const pxWidth = this.props.entity.duration * pps;
        const pxPosition = this.props.entity.position * pps;

        const style = {
            border: '1px solid black',
            borderRadius: '3px',
            height: '140px',
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
                    onMouseUp={this.onMouseUp}
                    onMouseMove={this.onMouseMove}>

                 <p style={{position:'absolute',
                            margin: '0 2px',
                            color: 'white',
                            width: pxWidth + 'px',
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                            userSelect: 'none',
                            }}>
                   {this.props.entity.name}
                 </p>

                 <canvas ref={this.canvasRef}
                         style={{position:'relative',
                                 width: '100%',
                                 height: '100%'}}
                         width={300}></canvas>
               </div>;
    }
}


const mapStateToProps = (state, ownProps) => ({
    pixelsPerSecond: state.timeline.pixelsPerSecond,
    track: state.tracks[ownProps.trackId],
    entity: state.tracks[ownProps.trackId].entities[ownProps.id]
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
