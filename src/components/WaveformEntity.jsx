import React from 'react';
import Color from 'color';
import { connect } from 'react-redux';

import TimelineEntity from './TimelineEntity';
import { getAudioBuffer } from '../audioStore';
import { fgTimelineEntity } from '../colors';

const drawWaveform = (ctxt, audioBuffer, color) => {
    const width = ctxt.canvas.width;
    const height = ctxt.canvas.height;

    // TODO: account all channels.
    const data = audioBuffer.getChannelData(0);
    const step = Math.ceil(data.length / width);
    const scale = height/2;

    ctxt.fillStyle = color;
    for (let i = 0; i < width; i++) {
        var min = 1.0;
        var max = -1.0;
        for (var j=0; j < step; j++) {
            var datum = data[(i*step)+j];
            if (datum < min)
                min = datum;
            if (datum > max)
                max = datum;
        }
        ctxt.fillRect(i, (1+min)*scale, 1, Math.max(1,(max-min)*scale));
    }
};

class WaveformEntity extends React.Component {
    constructor(props) {
        super(props);

        this.canvasRef = React.createRef();
    }

    componentDidMount() {
        const ctxt = this.canvasRef.current.getContext('2d');
        const buffer = getAudioBuffer(this.props.entity.bufferKey);
        const foreground = fgTimelineEntity(this.props.color);
        drawWaveform(ctxt, buffer, foreground);
    }

    componentDidUpdate() {
        const ctxt = this.canvasRef.current.getContext('2d');
        const buffer = getAudioBuffer(this.props.entity.bufferKey);
        const foreground = fgTimelineEntity(this.props.color);

        // TODO: This redraw call causes severe unresponsiveness when
        // repositioning large audio files (tested with 23 MB PCM
        // file). Do we really this?
        drawWaveform(ctxt, buffer, foreground);
    }

    render() {
        return <TimelineEntity {...this.props}>
                 <canvas ref={this.canvasRef}
                         style={{ position: 'relative',
                                  width: '100%',
                                  height: '100%', }}
                 />
               </TimelineEntity>;
    }
}

const mapStateToProps = (state, ownProps) => ({
    entity: state.tracks[ownProps.trackId].entities[ownProps.id]
});

WaveformEntity = connect(
    mapStateToProps,
)(WaveformEntity);

export default WaveformEntity;
