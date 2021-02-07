const initialTimeline = {
    start: 0,
    pixelsPerSecond: 30,
    position: 0,
    beatsPerMinute: 120,
    beatsPerBar: 4,
    patternToPaint: 0,
    patternToEdit: 0,
};

const timelineReducer = (timeline=initialTimeline, action) => {
    switch(action.type) {
    case 'SET_PLAYBACK_POSITION':
        return {
            ...timeline,
            position: action.position
        };
    case 'SET_TIMELINE_RESOLUTION':
        return {
            ...timeline,
            pixelsPerSecond: action.pixelsPerSecond
        };
    case 'SET_BPM':
        return {
            ...timeline,
            beatsPerMinute: action.bpm,
        };
    case 'SET_PATTERN_TO_PAINT':
        return {
            ...timeline,
            patternToPaint: action.id,
        }
    case 'SET_PATTERN_TO_EDIT':
        return {
            ...timeline,
            patternToEdit: action.id
        }
    case 'STOP':
        return {
            ...timeline,
            position: 0
        };
    default:
        return timeline;
    }
};

export default timelineReducer;
