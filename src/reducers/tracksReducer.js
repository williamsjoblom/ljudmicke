import * as Tracks from '../tracks';
import { AudioTrack, MIDITrack, AutomationTrack } from '../track';

const initialTracks = [
    AudioTrack("Audio 1", 0),
    MIDITrack("Synth 1", 1, 0),
];

const newTrackName = (trackType, tracks) => {
    const n = tracks.filter(t => t.type == trackType).length;
    const trackTypeName = {
        audio: 'Audio',
        midi: 'Synth',
        automation: 'Automation',
    }
    return `${trackTypeName[trackType]} ${n + 1}`;
};

/**
 * Construct Track object from the state and a ADD_TRACK action.
 */
const makeTrack = (tracks, action) => {
    console.assert(action.type === 'ADD_TRACK',
                   'Can only construct Track from ADD_TRACK actions');
    const name = action.name
            ? action.name
            : newTrackName(action.trackType, tracks);

    switch (action.trackType) {
    case 'audio':
        return AudioTrack(name, tracks.length);
    case 'midi':
        return MIDITrack(name, tracks.length, 0);
    case 'automation':
        return AutomationTrack(name, tracks.length);
    default:
        console.error(`Unknown track type: '${action.trackType}'`);
    }
};

const tracksReducer = (tracks=initialTracks, action) => {
    switch(action.type) {
    case 'ADD_ENTITY':
        return tracks.map(track => {
            if (track.id == action.trackId) {
                return {
                    ...track,
                    entities: track.entities.concat(action.entity)
                };
            };
            return track;
        })
    case 'EDIT_ENTITY':
        return tracks.map(track => {
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
        });
    case 'ADD_TRACK':
        const name = action.name
            ? action.name
            : newTrackName(action.trackType, tracks);

        let track = makeTrack(tracks, action);
        Tracks.addTrack(track); // FIXME: breaks reducer purity
        return tracks.concat(track);
    case 'SET_VOLUME':
        return tracks.map(track => {
            if (track.id !== action.trackId) return track;

            return {
                ...track,
                volume: action.volume
            };
        });
    case 'SET_PAN':
        return tracks.map(track => {
            if (track.id !== action.trackId) return track;
            return {
                ...track,
                pan: action.pan
            };
        });
    default:
        return tracks;
    }
};

export default tracksReducer;
