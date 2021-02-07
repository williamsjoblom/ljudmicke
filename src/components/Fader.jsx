import React from 'react';
import * as Colors from '../colors';

const DIVISIONS = 31;

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

            const delta = this.props.horizontal
                  ? event.movementX / this.canvasRef.current.width
                  : -event.movementY / this.canvasRef.current.height;

            const value = clamp(this.props.value + delta, 0, 1);
            if (this.props.onChange)
                this.props.onChange(value);

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

        const padding = 2;
        ctxt.clearRect(0, 0, ctxt.canvas.width, ctxt.canvas.height);
        const [width, height] = !this.props.horizontal
              ? [ctxt.canvas.width, ctxt.canvas.height]
              : [ctxt.canvas.height, ctxt.canvas.width];

        if (this.props.horizontal) {
            ctxt.translate(0, width);
            ctxt.rotate(-Math.PI/2);
        }

        const FADER_WIDTH = Math.round(5/8 * width);
        const FADER_LINE = 3;

        // Draw subdivisions.
        const DIVISION_HEIGHT = Math.round((height - 2*padding) / (DIVISIONS - 1));
        for (let i = 0; i < DIVISIONS; i++) {
            const division_width = i % 5 ? 0 : 9;

            ctxt.beginPath();
            ctxt.moveTo(width/20 + division_width, i*DIVISION_HEIGHT + padding);
            ctxt.lineTo(0, i*DIVISION_HEIGHT + padding);
            ctxt.strokeStyle = Colors.fgTernary;
            ctxt.stroke();
        }



        const value = this.props.horizontal
              ? this.props.value
              : 1 - this.props.value;
        const faderX = Math.round((width - FADER_WIDTH)/2);
        const faderY = Math.round(value*(height - 2*padding - 2*FADER_LINE) + padding - FADER_LINE/2);

        const activeColor = this.props.highlightColor || Colors.fgTernary;
        const inactiveColor = Colors.fgTernary;

        // Draw groove.
        //
        // NOTE: this is rather nasty, we should really mirror the
        // canvas after its rotation to avoid more this nastyness.
        ctxt.beginPath();
        ctxt.moveTo(width/2, padding);
        ctxt.lineTo(width/2, faderY);
        ctxt.strokeStyle = this.props.horizontal ? activeColor : inactiveColor;
        ctxt.stroke();
        ctxt.beginPath();
        ctxt.moveTo(width/2, faderY);
        ctxt.lineTo(width/2, (DIVISIONS - 1)*DIVISION_HEIGHT + padding);
        ctxt.strokeStyle = this.props.horizontal ? inactiveColor : activeColor;
        ctxt.stroke();

        // Draw fader knob line.
        ctxt.beginPath();
        ctxt.rect(faderX, faderY, FADER_WIDTH, FADER_LINE);
        ctxt.fillStyle = Colors.fgSecondary;
        ctxt.fill();

        ctxt.setTransform(1, 0, 0, 1, 0, 0);
    }

    componentDidUpdate() {
        requestAnimationFrame(this.draw);
    }

    componentDidMount() {
        this.ctxt = this.canvasRef.current.getContext('2d');
        requestAnimationFrame(this.draw);
    }

    render() {
        return <canvas ref={this.canvasRef}
                       width={this.props.width}
                       height={this.props.height}
                       onMouseDown={this.onMouse}
                       onMouseUp={this.onMouse}
                       style={{
                           width: this.props.width,
                           height: this.props.height}}>
               </canvas>;
    }
}

export default Fader;
