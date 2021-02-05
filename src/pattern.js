import store from './store.js';

export const patternDurationInBeats = (patternOrId) => {
    const pattern = Number.isInteger(patternOrId)
          ? store.getState().patterns[patternOrId]
          : patternOrId;

    const durationInBeats = Math.max(
        ...pattern.notes
            .filter(note => !note.markedForRemoval)
            .map(note => note.position + note.duration)
    );

    return durationInBeats;
};

export const patternDurationInSeconds = (patternOrId) => {
    const secondsPerBeat = 60 / store.getState().timeline.beatsPerMinute;
    return patternDurationInBeats(patternOrId) * secondsPerBeat;
};

export const emptyPatternDurationInSeconds = () => {
    const secondsPerBeat = 60 / store.getState().timeline.beatsPerMinute;
    return 2*secondsPerBeat;
};
