import React from 'react';

import * as Colors from '../colors';

class Envelope extends React.Component {
    constructor(props) {
        super(props);

        this.canvasRef = React.createRef();
        this.draw = this.draw.bind(this);
    }

    componentDidMount() {
        this.ctxt = this.canvasRef.current.getContext('2d');
        this.draw();
    }

    componentDidUpdate() {
        this.draw();
    }

    draw() {
        const ctxt = this.ctxt;
        const width = this.canvasRef.current.width;
        const height = this.canvasRef.current.height;
        ctxt.clearRect(0, 0, width, height);

        const attack  = this.props.attack;
        const decay   = this.props.decay;
        const sustain = this.props.sustain;
        const release = this.props.release;
        // const attackCurve = this.props.attackCurve;
        // const releaseCurve = this.props.releaseCurve;

        const adrTime = attack + decay + release;
        const sustainWidth = width/3;
        const pixelsPerSecond = (width - sustainWidth) / adrTime;

        ctxt.fillStyle = Colors.fgTernary;
        const peakX = Math.round(pixelsPerSecond*attack);
        ctxt.beginPath();
        ctxt.moveTo(0, height);
        ctxt.lineTo(peakX, 0);

        const sustainStartX = Math.round((attack+decay)*pixelsPerSecond);
        const sustainEndX = sustainStartX + sustainWidth;
        const sustainY = Math.round(height - sustain*height);
        ctxt.lineTo(sustainStartX, sustainY);
        ctxt.lineTo(sustainEndX, sustainY);
        ctxt.lineTo(width, height);

        ctxt.closePath();
        ctxt.fill();

        ctxt.strokeStyle = Colors.bgDark;
        ctxt.setLineDash([2, 2]);
        ctxt.beginPath();

        ctxt.moveTo(peakX, 0);
        ctxt.lineTo(peakX, height);
        ctxt.stroke();

        ctxt.beginPath();
        ctxt.moveTo(sustainStartX, sustainY);
        ctxt.lineTo(sustainStartX, height);
        ctxt.stroke();

        ctxt.beginPath();
        ctxt.moveTo(sustainEndX, sustainY);
        ctxt.lineTo(sustainEndX, height);
        ctxt.stroke();


    }

    render() {
        return <canvas ref={this.canvasRef}
                       width={this.props.width}
                       height={this.props.height}
                       style={{
                           width: `${this.props.width}px`,
                           height: `${this.props.height}px`,
                       }}>
               </canvas>;
    }
}

export default Envelope;
