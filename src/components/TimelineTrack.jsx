import React from 'react';
import { connect } from 'react-redux';
import { audioEntity, patternEntity } from '../entity';

import WaveformEntity from './WaveformEntity';
import PatternEntity from './PatternEntity';

import { readMIDIFile } from '../audio';
import { registerAudioFile } from '../audioStore';
import { makeBackgroundLines } from '../cssUtil';
import * as Colors from '../colors';

const componentFromEntityType = (type) => {
    switch (type) {
    case 'pattern': return PatternEntity;
    case 'audio': return WaveformEntity;
    default:
        console.error(`Unknown entity type: '${type}'`);
        return null;
    }
};

const trackCursor = (trackType) => {
    switch(trackType) {
    case 'automation': // Fallthrough
    case 'audio':
        return 'default';
    case 'midi':
        return 'cell';
    default:
        console.error(`Unknown track type: '${trackType}'`);
        return null;
    }
};

export default class TimelineTrack extends React.Component {
    constructor(props) {
        super(props);
        this.timelineRef = React.createRef();
        this.dragEnterCounter = 0;

        this.state = { draggedEntity: null };

        this.showDropZone = this.showDropZone.bind(this);
        this.hideDropZone = this.hideDropZone.bind(this);
        this.onDrop = this.onDrop.bind(this);
        this.onDrag = this.onDrag.bind(this);
        this.onDragEnter = this.onDragEnter.bind(this);
        this.onDragLeave = this.onDragLeave.bind(this);
        this.onClick = this.onClick.bind(this);
        this.addEntityFromFile = this.addEntityFromFile.bind(this);
    }

    componentDidMount() {
        ['dragenter', 'dragover'].forEach(e => {
            this.timelineRef.current.addEventListener(e, this.showDropZone);
        });
        ['dragleave', 'drop'].forEach(e => {
            this.timelineRef.current.addEventListener(e, this.hideDropZone);
        });
        this.timelineRef.current.addEventListener('drop', this.onDrop);
        this.timelineRef.current.addEventListener('dragover', this.onDrag);
        this.timelineRef.current.addEventListener('dragenter', this.onDragEnter);
        this.timelineRef.current.addEventListener('dragleave', this.onDragLeave);
    }

    async addEntityFromFile(file, position) {
        const [bufferKey, buffer] = await registerAudioFile(file);
        const id = this.props.track.entities.length;

        const entity = audioEntity(id,
                                   file.name,
                                   position,
                                   buffer.duration,
                                   bufferKey);

        this.props.addEntity(entity);
    }

    showDropZone(event) {
        event.preventDefault();
    }

    hideDropZone(event) {
        event.preventDefault();
    }

    onDrop(event) {
        event.preventDefault();
        event.stopPropagation();

        this.dragEnterCounter = 0;

        const timelineBound = this.timelineRef.current.getBoundingClientRect();
        const pxPosition = event.clientX - timelineBound.left;

        this.setState(state => {
            return {
                draggedEntity: null,
            };
        });

        const file = event.dataTransfer.files[0];
        this.addEntityFromFile(file, pxPosition/this.props.pixelsPerSecond);
    }

    onDrag(event) {
        const timelineBound = this.timelineRef.current.getBoundingClientRect();
        const length = 150;
        const offset = event.clientX - timelineBound.left;
    }

    onDragEnter(event) {
        this.dragEnterCounter++;
    }

    onDragLeave(event) {
        this.dragEnterCounter--;
        if (this.dragEnterCounter === 0) {
            this.setState(state => {
                return {
                    draggedEntity: null,
                };
            });
        }
    }

    onClick(event) {
        if (this.props.track.type !== 'midi') return;

        const secondsPerBeat = 60 / this.props.beatsPerMinute;
        const timelineBound = this.timelineRef.current.getBoundingClientRect();
        const pxPosition = event.clientX - timelineBound.left;
        let position = pxPosition/this.props.pixelsPerSecond;

        const snapToBeat = !event.shiftKey;
        if (snapToBeat)
            position = Math.round(position/secondsPerBeat)*secondsPerBeat;

        const duration = 10;

        this.props.addEntity(
            patternEntity(this.props.track.entities.length,
                          this.props.patternToPaint.name,
                          position,
                          duration,
                          this.props.patternToPaint.id,
                         )
        );
    }

    render() {
        const secondsPerBeat = 60 / this.props.beatsPerMinute;
        const pixelsPerBeat = secondsPerBeat * this.props.pixelsPerSecond;
        const pixelsPerBar = pixelsPerBeat * this.props.beatsPerBar;

        const style = {
            height: '110px',
            width: '100%',
            borderTop: "2px solid " + Colors.bgTrackDivider,
            backgroundColor: (this.props.id % 2) ? Colors.bgDarker : Colors.bgDark,
            position: 'relative',
            cursor: trackCursor(this.props.track.type),
            ...makeBackgroundLines(pixelsPerBar, pixelsPerBeat),
        };

        return <div style={style}
                    ref={this.timelineRef}
                    onClick={this.onClick}>
                 {
                     this.props.track.entities
                         .filter(a => !a.markedForRemoval)
                         .map(a => {
                         const C = componentFromEntityType(a.type);
                         return <C key={a.id}
                                   id={a.id}
                                   trackId={this.props.id}
                                   color={this.props.color} />;
                     })
                 }
               </div>;
    }
}

const mapStateToProps = (state, ownProps) => ({
    pixelsPerSecond: state.timeline.pixelsPerSecond,
    beatsPerMinute: state.timeline.beatsPerMinute,
    beatsPerBar: state.timeline.beatsPerBar,
    track: state.tracks[ownProps.id],
    patternToPaint: state.patterns[state.timeline.patternToPaint],
});

const addEntity = (trackId, entity) => ({
    type: 'ADD_ENTITY',
    trackId: trackId,
    entity: entity,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    addEntity: (entity) => dispatch(addEntity(ownProps.id, entity))
});

TimelineTrack = connect(
    mapStateToProps,
    mapDispatchToProps
)(TimelineTrack);
