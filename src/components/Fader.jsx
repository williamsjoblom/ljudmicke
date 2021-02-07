import React from 'react';
import { connect } from 'react-redux';
import { setVolume, setPan } from '../actions';
import * as Colors from '../colors';

const DIVISIONS = 31;

const drawSublines = (ctxt, n, x, y, width, height) => {
    for (let i = 0; i < n; i++) {
        ctxt.beginPath();
        ctxt.rect(1/8*width + 2, y, width - 4, 1);
        ctxt.fillStyle = "#1C1C1C";
        ctxt.fill();
    }
};

const labelStyle = {
    display: 'block',
    color: 'white',
    fontSize: '12pt'
};

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

class Fader extends React.Component {
    constructor(props) {
        super(props);
        this.canvasRef = React.createRef();

        this.draw = this.draw.bind(this);
        this.onMouse = this.onMouse.bind(this);
    }

    onMouse(event) {
        if (event.type === "mousemove") {
            const delta = -event.movementY;
            const volume = clamp(this.props.volume + delta/this.ctxt.canvas.height, 0, 1);
            this.props.setVolume(volume);
        } else if (event.type === "mousedown") {
            event.target.requestPointerLock();
            event.target.addEventListener("mousemove", this.onMouse, true);
        } else if (event.type === "mouseup") {
            document.exitPointerLock();
            event.target.removeEventListener("mousemove", this.onMouse, true);
        }
    }

    draw() {
        const ctxt = this.ctxt;
        const [width, height] = [ctxt.canvas.width, ctxt.canvas.height];

        const FADER_WIDTH = 3/4 * width;
        const FADER_HEIGHT = FADER_WIDTH*1.3;
        const FADER_LINE = 3;

        ctxt.clearRect(0, 0, width, height);

        ctxt.beginPath();
        ctxt.moveTo(width/2, FADER_HEIGHT/2);
        ctxt.lineTo(width/2, height - FADER_HEIGHT/2);
        ctxt.strokeStyle = 'white';
        ctxt.stroke();

        const DIVISION_HEIGHT = Math.round((height - FADER_HEIGHT) / (DIVISIONS - 1));
        for (let i = 0; i < DIVISIONS; i++) {
            const division_width = i % 5 ? 0 : 9;

            ctxt.beginPath();
            ctxt.moveTo(width/20 + division_width, i*DIVISION_HEIGHT + FADER_HEIGHT/2);
            ctxt.lineTo(0, i*DIVISION_HEIGHT + FADER_HEIGHT/2);
            ctxt.strokeStyle = Colors.fgTernary; //'white';
            ctxt.stroke();
        }

        const faderX = Math.round(1/8*width);
        const faderY = Math.round((1 - this.props.volume)*(height - FADER_HEIGHT));

        // Draw fader knob line.
        ctxt.beginPath();
        ctxt.rect(faderX, faderY + FADER_HEIGHT/2 - FADER_LINE/2, FADER_WIDTH, FADER_LINE);
        ctxt.fillStyle = Colors.fgSecondary; // '#FFFFFF';
        ctxt.fill();
    }

    componentDidUpdate() {
        requestAnimationFrame(this.draw);
    }

    componentDidMount() {
        this.ctxt = this.canvasRef.current.getContext('2d');
        requestAnimationFrame(this.draw);
    }

    render() {
        const bg = (this.props.trackId % 2) ? Colors.bgDarkest : Colors.bgDarker;

        return <div style={{display: 'inline-block',
                            padding: '0',
                            textAlign: 'center',
                            borderRight: '2px solid ' + Colors.bgDark}}>

                 <div style={{display: 'block',
                              backgroundColor: Colors.timelinePalette[this.props.track.id],
                              width: '100%',
                              height: '10px'}}></div>

                 <div style={{display: 'inline-block',
                              paddingLeft: '16px',
                              paddingRight: '16px',
                              textAlign: 'center',
                              backgroundColor: bg}}>
                   <h1 style={labelStyle}>{this.props.track.name}</h1>
                   <canvas ref={this.canvasRef}
                           width={this.props.width}
                           height={this.props.height}
                           onMouseDown={this.onMouse}
                           onMouseUp={this.onMouse}
                           style={{}}></canvas>
                 </div>
               </div>;
    }
}

const mapStateToProps = (state, ownProps) => ({
    track: state.tracks[ownProps.trackId],
    volume: state.tracks[ownProps.trackId].volume,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    setVolume: volume => dispatch(setVolume(ownProps.trackId, volume))
});

Fader = connect(
    mapStateToProps,
    mapDispatchToProps
)(Fader);

export default Fader;
