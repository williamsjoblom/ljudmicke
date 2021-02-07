const BaseTrack = (name, type, id, volume=1, pan=0, entities=[]) => ({
    name,
    type,
    id,
    volume,
    pan,
    entities,
});

export const AudioTrack = (name, id) => ({
    ...BaseTrack(name, 'audio', id),
});

export const AutomationTrack = (name, id) => ({
    ...BaseTrack(name, 'automation', id)
});

export const MIDITrack = (name, id, instrumentId) => ({
    ...BaseTrack(name, 'midi', id),
    instrumentId,
});
