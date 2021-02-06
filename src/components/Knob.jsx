import React from 'react';

import * as Colors from '../colors';
import { clamp, lerp, invlerp } from '../math';

const SENSITIVITY = 0.005;

class Knob extends React.Component {
    static defaultProps = {
        min: 0,
        max: 1,
        origin: 0,
    }

    constructor(props) {
        super(props);
        console.assert(!(props.min <= 0 && props.log),
                       'Logarithmic knobs must have a range excluding zero');

        this.state = {
            label: props.label
        };

        this.canvasRef = React.createRef();

        this.onMouse = this.onMouse.bind(this);
        this.draw = this.draw.bind(this);
        this.getRotation = this.getRotation.bind(this);
        this.getRotationLog = this.getRotationLog.bind(this);
        this.getRotationLin = this.getRotationLin.bind(this);
        this.getValue = this.getValue.bind(this);
        this.getValueLin = this.getValueLin.bind(this);
        this.getValueLog = this.getValueLog.bind(this);
    }

    getRotation(value) {
        if (this.props.log) {
            const rot = this.getRotationLog(value);
            console.log(`${value} => ${rot}`);
            return rot;
        } else
            return this.getRotationLin(value);
    }

    getRotationLog(value) {
        if (value === 0) return 0;

        const minV = Math.log(this.props.min);
        const maxV = Math.log(this.props.max);
        const scale = maxV - minV;

        return (Math.log(value) - minV) / scale;
    }

    getRotationLin(value) {
        return invlerp(value, this.props.min, this.props.max);
    }

    getValue(rotation) {
        if (this.props.log)
            return this.getValueLog(rotation);
        else
            return this.getValueLin(rotation);
    }

    getValueLog(rotation) {
        const minV = Math.log(this.props.min);
        const maxV = Math.log(this.props.max);
        const scale = maxV - minV;

        return Math.exp(rotation * scale + minV);
    }

    getValueLin(rotation) {
        return lerp(rotation, this.props.min, this.props.max);
    }

    render() {
        return <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            ...this.props.style
        }}>
                 <canvas ref={this.canvasRef}
                         onMouseDown={this.onMouse}
                         onMouseUp={this.onMouse}
                         width={this.props.width}
                         height={this.props.height}
                         style={{
                             display: 'block',
                             width: `${this.props.width}px`,
                             height: `${this.props.height}px`
                         }}></canvas>
                 { this.props.label &&
                   <span style={{fontWeight: '400',
                                 fontSize: '10pt',
                                 color: Colors.fgPrimary}}>
                     { this.state.label }
                   </span>
                 }
               </div>;
    }

    onMouse(event) {
        const decimalCount = this.props.decimals === undefined
              ? 2
              : this.props.decimals;
        const labelValue = this.props.value.toFixed(decimalCount);
        const unit = this.props.unit
              ? ` ${this.props.unit}`
              : '';

        if (event.type === "mousemove") {
            const [min, max] = [this.props.min, this.props.max];

            const rotationDelta = -event.movementY * SENSITIVITY; // * (max - min));
            const rotation = this.getRotation(this.props.value);
            const newRotation = rotation + rotationDelta;
            const newValue = clamp(this.getValue(newRotation), min, max);

            // const value = clamp(this.props.value + delta, min, max);



            if (this.props.onChange)
                this.props.onChange(newValue);

            this.setState({ label: `${labelValue} ${unit}` });
        } else if (event.type === "mousedown") {
            event.target.requestPointerLock();
            this.dragging = true;
            this.setState({ label: `${labelValue} ${unit}` });
            event.target.addEventListener("mousemove", this.onMouse, true);
        } else if (event.type === "mouseup") {
            document.exitPointerLock();
            this.setState({ label: this.props.label });
            event.target.removeEventListener("mousemove", this.onMouse, true);
        }
    }

    draw(actualValue) {
        // Normalize the value to a 0...1 interval.
        const [min, max] = [this.props.min, this.props.max];
        const value = this.getRotation(actualValue); //invlerp(actualValue, min, max);
        const origin = this.getRotation(this.props.origin); // invlerp(this.props.origin, min, max);

        let ctxt = this.ctxt;
        ctxt.clearRect(0, 0, ctxt.canvas.width, ctxt.canvas.height);

        const lineWidth = 5;

        const minDimension = Math.min(this.props.height, this.props.width);
        const radius = (minDimension - lineWidth)/2;

        const centerX = this.props.width / 2;
        const centerY = this.props.height / 2;

        const startAngle = -Math.PI*5/4;
        const endAngle = Math.PI/4;
        const angle = value*(endAngle - startAngle);


        const startActive = startAngle + origin*(endAngle - startAngle);

        // Draw inactive ring.
        ctxt.beginPath();
        ctxt.moveTo(centerX, centerY);
        ctxt.arc(centerX, centerY, radius, startAngle, endAngle);
        ctxt.fillStyle = "gray";
        ctxt.closePath();
        ctxt.fill();

        // Draw active ring.
        ctxt.beginPath();

        ctxt.moveTo(centerX, centerY);
        {
            const start = value < origin ? startAngle + angle : startActive;
            const end = value < origin ? startActive : startAngle + angle;
            ctxt.arc(centerX, centerY, radius, start, end);
        }
        ctxt.fillStyle = this.props.highlightColor || 'orange';
        ctxt.closePath();
        ctxt.fill();

        // Draw actual knob.
        ctxt.beginPath();
        ctxt.arc(centerX, centerY, 0.8*radius, 0, 2*Math.PI);

        let wheelGradient = ctxt.createRadialGradient(centerX, centerY,
                                                      Math.max(radius*0.85, radius - 10),
                                                      centerX, centerY, radius);
        wheelGradient.addColorStop("0", "#2D2D2D");
        wheelGradient.addColorStop("1", "#888888");
        ctxt.fillStyle = wheelGradient;
        ctxt.fill();

        // Draw dot.
        const dotOffset = 0.5*radius;
        const dotX = centerX + dotOffset*Math.cos(startAngle + angle);
        const dotY = centerY + dotOffset*Math.sin(startAngle + angle);
        const dotRadius = radius/7;

        ctxt.beginPath();
        ctxt.arc(dotX, dotY, dotRadius, 0, 2*Math.PI);

        let dotGradient = ctxt.createRadialGradient(dotX, dotY, dotRadius/2,
                                                    dotX, dotY, dotRadius);
        dotGradient.addColorStop("0", "#FFFFFF");
        dotGradient.addColorStop("1", "#999999");
        ctxt.fillStyle = dotGradient;

        ctxt.fill();
    }

    componentDidMount() {
        this.ctxt = this.canvasRef.current.getContext('2d');
        this.draw(this.props.value);
    }

    componentDidUpdate() {
        this.draw(this.props.value);
    }
}

export default Knob;
