export const editEntity = (entityId, trackId, changes) => ({
    type: 'EDIT_ENTITY',
    entityId: entityId,
    trackId: trackId,
    changes: changes,
});

export const setEntityPosition = (entityId, trackId, position) => ({
    type: 'EDIT_ENTITY',
    entityId: entityId,
    trackId: trackId,
    changes: { position: Math.max(0, position) },
});

export const setEntityDuration = (entityId, trackId, duration) => ({
    type: 'EDIT_ENTITY',
    entityId: entityId,
    trackId: trackId,
    changes: { duration: Math.max(0, duration) },
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

export const addTrack = (type, name) => ({
    type: 'ADD_TRACK',
    trackType: type,
    name: name,
});

export const setTimelineResolution = (pixelsPerSecond) => ({
    type: 'SET_TIMELINE_RESOLUTION',
    pixelsPerSecond: pixelsPerSecond,
});

export const setBeatsPerMinute = bpm => ({
    type: 'SET_BPM',
    bpm: bpm,
});

export const addPattern = () => ({
    type: 'ADD_PATTERN',
});

export const setPatternToPaint = id => ({
    type: 'SET_PATTERN_TO_PAINT',
    id: id,
});

export const setPatternToEdit = id => ({
    type: 'SET_PATTERN_TO_EDIT',
    id: id,
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

export const setSynthParams = (synthId, params) => ({
    type: 'SET_SYNTH_PARAMS',
    synthId: synthId,
    params: params,
});

export const setSynthOscillatorParams = (synthId, oscillatorId, params) => ({
    type: 'SET_SYNTH_OSCILLATOR_PARAMS',
    synthId: synthId,
    oscillatorId: oscillatorId,
    params: params,
});

export const setSynthEnvelopeParams = (synthId, envelopeId, params) => ({
    type: 'SET_SYNTH_ENVELOPE_PARAMS',
    synthId: synthId,
    envelopeId: envelopeId,
    params: params,
});

export const setPlaying = () => ({
    type: 'PLAY',
});

export const setPaused = () => ({
    type: 'PAUSE',
});

export const setStopped = () => ({
    type: 'STOP',
});
