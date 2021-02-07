export const subdivisionsPerBeat = (beatsPerMinute, pixelsPerSecond) => {
    const secondsPerBeat = 60 / beatsPerMinute;

    const minPixels = 10;
    const pixelsPerSubdivision = secondsPerBeat * pixelsPerSecond;

    let divisor = 1;
    while (pixelsPerSubdivision / (divisor*2) > minPixels) {
        divisor *= 2;
    }

    return divisor;
};

export const snapToSubdivision = (positionInSeconds, beatsPerMinute, pixelsPerSecond) => {
    const secondsPerBeat = 60 / beatsPerMinute;
    const beatSubdivisions = subdivisionsPerBeat(beatsPerMinute, pixelsPerSecond);
    const secondsPerSubdivision = secondsPerBeat / beatSubdivisions;

    return Math.floor(positionInSeconds / secondsPerSubdivision) * secondsPerSubdivision;
};
