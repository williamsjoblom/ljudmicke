import * as Tone from 'tone';

import store from './store';

const trackEffectChains = {};

class TrackEffect {
    constructor(track) {
        this.gain = new Tone.Gain(track.volume);
        this.pan = new Tone.Panner(track.pan);

        this.params = {
            volume: this.gain.gain,
            pan: this.pan.pan
        };
    }
}

export const addTrack = (track) => {
    return trackEffectChains[track.id] = new TrackEffect(track);
};

export const getTrackEffectChain = (trackId) => {
    return trackEffectChains[trackId];
};

export const init = () => {
    store.getState().tracks
        .forEach(addTrack);
};
