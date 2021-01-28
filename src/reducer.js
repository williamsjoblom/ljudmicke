import { audioEntity, patternEntity } from './entity';
import Note from './note';

const initialState = {
    timeline: {
        start: 0,
        pixelsPerSecond: 30,
        position: 0,
        beatsPerMinute: 120,
        beatsPerBar: 4,
    },
    tracks: [
        {
            name: "Track 1",
            type: "audio",
            id: 0,
            volume: 0.5,
            pan: 0.5,
            entities: [ /*new Entity(0, "foo", 0, 300, undefined)*/ ]
        },
        {
            name: "Synth 1",
            type: "midi",
            id: 1,
            volume: 0.5,
            pan: 0.5,
            entities: [ patternEntity(0, "Pattern 1", 0, 12, 0) ]
        },
    ],
    patterns: [
        {
            name: "Pattern 1",
            id: 0,
            notes: [ ],
        },
        {
            name: "Pattern 2",
            id: 1,
            notes: [ ],
        },
    ]
};

const reducer = (state=initialState, action) => {
    switch (action.type) {
    case 'ADD_ENTITY':
        return {
            ...state,
            tracks: state.tracks.map(track => {
                if (track.id == action.trackId) {
                    return {
                        ...track,
                        entities: track.entities.concat(action.entity)
                    };
                };
                return track;
            })
        };
    case 'EDIT_ENTITY':
        return {
            ...state,
            tracks: state.tracks.map(track => {
                if (track.id !== action.trackId)
                    return track;

                return {
                    ...track,
                    entities: track.entities.map(entity => {
                        if (entity.id !== action.entityId)
                            return entity;

                        return {
                            ...entity,
                            ...action.changes,
                        };
                    })
                };
            })
        };

    case 'SET_PLAYBACK_POSITION':
        return {
            ...state,
            timeline: {
                ...state.timeline,
                position: action.position
            }
        };
    case 'ADD_TRACK':
        return {
            ...state,
            tracks: [
                ...state.tracks,
                {
                    name: "Track " + (state.tracks.length + 1),
                    type: "midi",
                    id: state.tracks.length,
                    volume: 0.5,
                    pan: 0.5,
                    entities: [ ]
                }
            ]
        };
    case 'SET_VOLUME':
        return {
            ...state,
            tracks: state.tracks.map(track => {
                if (track.id !== action.trackId) return track;

                return {
                    ...track,
                    volume: action.volume
                };
            })
        };
    case 'SET_PAN':
        return {
            ...state,
            tracks: state.tracks.map(track => {
                if (track.id !== action.trackId) return track;
                return {
                    ...track,
                    pan: action.pan
                };
            })
        };
    case 'SET_TIMELINE_RESOLUTION':
        return {
            ...state,
            timeline: {
                ...state.timeline,
                pixelsPerSecond: action.pixelsPerSecond
            }
        };
    case 'SET_BPM':
        return {
            ...state,
            timeline: {
                ...state.timeline,
                beatsPerMinute: action.bpm,
            }
        };
    case 'SET_NOTE_POSITION':
        if (action.position < 0) return state;
        return {
            ...state,
            patterns: state.patterns.map(pattern => {
                if (pattern.id !== action.patternId) return pattern;
                return {
                    ...pattern,
                    notes: pattern.notes.map(note => {
                        if (note.id !== action.noteId) return note;
                        return {
                            ...note,
                            position: action.position,
                            key: action.key || note.key,
                        };
                    }),
                };
            }),
        };
    case 'SET_NOTE_DURATION':
        if (action.duration <= 0) return state;
        return {
            ...state,
            patterns: state.patterns.map(pattern => {
                if (pattern.id !== action.patternId) return pattern;
                return {
                    ...pattern,
                    notes: pattern.notes.map(note => {
                        if (note.id !== action.noteId) return note;
                        return {
                            ...note,
                            duration: action.duration,
                        };
                    }),
                };
            }),
        };
    case 'ADD_NOTE':
        console.log(action);
        return {
            ...state,
            patterns: state.patterns.map(pattern => {
                if (pattern.id !== action.patternId) return pattern;
                return {
                    ...pattern,
                    notes: pattern.notes.concat(action.note)
                };
            })
        };

    case 'MARK_NOTE_FOR_REMOVAL':
        return {
            ...state,
            patterns: state.patterns.map(pattern => {
                if (pattern.id !== action.patternId) return pattern;
                return {
                    ...pattern,
                    notes: pattern.notes.map(note => {
                        if (note.id !== action.noteId) return note;
                        return {
                            ...note,
                            markedForRemoval: true,
                        };
                    }),
                };
            }),
        };

    default:
        console.warn("Unhandled reduce action: '" + action.type + "'");
        return state;
    }
};

export default reducer;
