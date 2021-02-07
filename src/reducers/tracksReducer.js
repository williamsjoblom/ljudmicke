import * as Tracks from '../tracks';

const initialTracks = [
    {
        name: "Audio 1",
        type: "audio",
        id: 0,
        volume: 1,
        pan: 0,
        entities: [ /*new Entity(0, "foo", 0, 300, undefined)*/ ]
    },
    {
        name: "Synth 1",
        type: "midi",
        id: 1,
        volume: 1,
        pan: 0,
        entities: [ ]
    },
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

        const track = {
            name: name,
            type: action.trackType,
            id: tracks.length,
            volume: 1,
            pan: 0,
            entities: [ ]
        };

        // FIXME: breaks reducer purity, pls fix
        Tracks.addTrack(track);
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
