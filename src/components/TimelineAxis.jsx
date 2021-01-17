import React from 'react';
import { connect } from 'react-redux';
import Entity from '../entity';
import Color from 'color';
import { setPlaybackPosition, setTimelineResolution } from '../actions';
import * as Colors from '../colors';

const HEIGHT = 30;

const style = {
    height: HEIGHT + 'px',
    width: '100%',
    margin: '0',
    padding: '0',
};

class TimelineAxis extends React.Component {
    constructor(props) {
        super(props);
        this.canvasRef = React.createRef();
        this.ctxt = null;

        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);
        this.onWheel = this.onWheel.bind(this);
        this.mouseDown = false;

        this.draw = this.draw.bind(this);
    }

    onMouseDown(event) {
        const canvasBound = this.canvasRef.current.getBoundingClientRect();
        const localX = event.clientX - canvasBound.left;
        this.props.setPlaybackPosition(localX / this.props.pixelsPerSecond);

        this.mouseDown = true;
    }

    onMouseMove(event) {
        if (!this.mouseDown) return;

        const canvasBound = this.canvasRef.current.getBoundingClientRect();
        const localX = event.clientX - canvasBound.left;
        this.props.setPlaybackPosition(localX / this.props.pixelsPerSecond);
    }

    onMouseUp(event) {
        this.mouseDown = false;
    }

    onMouseLeave(event) {
        this.mouseDown = false;
    }

    onWheel(event) {
        event.stopPropagation();
        event.preventDefault();

        const delta = event.deltaY > 0 ? -1 : 1;
        this.props.setTimelineResolution(this.props.pixelsPerSecond + delta);
    }

    draw() {
        const ctxt = this.ctxt;
        const canvas = this.canvas;

        canvas.width = canvas.offsetWidth;
        // canvas.height = canvas.offsetHeight;

        ctxt.clearRect(0, 0, canvas.width, canvas.height);
        ctxt.fillStyle = '#2d2d2d';
        ctxt.fillRect(0, 0, canvas.width, canvas.height);

        const tickHeight = canvas.height*0.3;
        const arrowHeight = canvas.height - tickHeight - 2;
        const arrowWidth = 2/3*arrowHeight;

        const secondsPerBeat = 60 / this.props.beatsPerMinute;
        const secondsPerBar = this.props.beatsPerBar * secondsPerBeat;
        const pxPerBar = secondsPerBar * this.props.pixelsPerSecond;

        const timeUntilFirstWholeSecond = Math.ceil(this.props.start) - this.props.start;
        const pxUntilFirstMarker = timeUntilFirstWholeSecond*this.props.pixelsPerSecond;

        ctxt.font = '10px Roboto Mono';
        ctxt.fillStyle = 'white';
        const maxTextWidth = ctxt.measureText(Math.floor(canvas.width / pxPerBar) + 1).width + 4;
        if (pxPerBar > 1) {
            for (let [i, x] = [0, pxUntilFirstMarker]; x < canvas.width; i++, x += pxPerBar) {
                ctxt.beginPath();
                ctxt.moveTo(x, 0);
                ctxt.lineTo(x, canvas.height*0.3);
                ctxt.strokeStyle = 'white';
                ctxt.stroke();

                const text = i + 1;
                if (pxPerBar > maxTextWidth) {
                    ctxt.fillText(text, x + 4, 10);
                }
            }
        }

        const pxPosition = this.props.position*this.props.pixelsPerSecond;
        ctxt.beginPath();
        ctxt.moveTo(pxPosition, canvas.height);
        ctxt.lineTo(pxPosition - arrowWidth/2, canvas.height - arrowHeight);
        ctxt.lineTo(pxPosition + arrowWidth/2, canvas.height - arrowHeight);
        ctxt.fillStyle = 'orange';
        ctxt.fill();
    }

    componentDidMount() {
        this.canvas = this.canvasRef.current;
        this.ctxt = this.canvas.getContext('2d');

        this.draw();
        new ResizeObserver(() => {
            this.draw();
        }).observe(this.canvasRef.current);
    }

    componentDidUpdate() {
        this.draw();
    }

    render() {
        return <canvas style={style}
                       onMouseDown={this.onMouseDown}
                       onMouseMove={this.onMouseMove}
                       onMouseUp={this.onMouseUp}
                       onMouseLeave={this.onMouseLeave}
                       onWheel={this.onWheel}
                       ref={this.canvasRef}
                       height={HEIGHT}></canvas>;
    }
}

const mapStateToProps = (state, ownProps) => ({
    start: state.timeline.start,
    position: state.timeline.position,
    pixelsPerSecond: state.timeline.pixelsPerSecond,
    beatsPerMinute: state.timeline.beatsPerMinute,
    beatsPerBar: state.timeline.beatsPerBar,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    setPlaybackPosition: position => dispatch(setPlaybackPosition(position)),
    setTimelineResolution: pixelsPerSecond => dispatch(setTimelineResolution(pixelsPerSecond)),
});

TimelineAxis = connect(
    mapStateToProps,
    mapDispatchToProps
)(TimelineAxis);

export default TimelineAxis;
