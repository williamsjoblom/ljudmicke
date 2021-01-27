export const editEntity = (entityId, trackId, changes) => ({
    type: 'EDIT_ENTITY',
    entityId: entityId,
    trackId: trackId,
    changes: changes,
});

export const setPlaybackPosition = (position) => ({
    type: 'SET_PLAYBACK_POSITION',
    position: position
});

export const setVolume = (trackId, volume) => ({
    type: 'SET_VOLUME',
    trackId: trackId,
    volume: volume,
});

export const setPan = (trackId, pan) => ({
    type: 'SET_PAN',
    trackId: trackId,
    pan: pan,
});

export const addTrack = () => ({
    type: 'ADD_TRACK',
});

export const setTimelineResolution = (pixelsPerSecond) => ({
    type: 'SET_TIMELINE_RESOLUTION',
    pixelsPerSecond: pixelsPerSecond,
});

export const setBeatsPerMinute = bpm => ({
    type: 'SET_BPM',
    bpm: bpm,
});

export const addNote = (patternId, note) => ({
    type: 'ADD_NOTE',
    patternId: patternId,
    note: note,
});

export const markNoteForRemoval = (patternId, noteId) => ({
    type: 'MARK_NOTE_FOR_REMOVAL',
    patternId: patternId,
    noteId: noteId,
});

export const setNotePosition = (patternId, noteId, position, key) => ({
    type: 'SET_NOTE_POSITION',
    patternId: patternId,
    noteId: noteId,
    position: position,
    key: key,
});

export const setNoteDuration = (patternId, noteId, duration) => ({
    type: 'SET_NOTE_DURATION',
    patternId: patternId,
    noteId: noteId,
    duration: duration,
});
