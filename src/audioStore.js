import md5 from 'md5';

import { readAudioFile } from './audio';

const hashCode = (buffer) => {
    let h = 1;
    for (let i = 0; i < buffer.numberOfChannels; i++) {
        const data = new Int32Array(buffer.getChannelData(i));
        data.forEach(datum => {
            h = 31*h + datum;
            h |= 0; // -> 32-bit int.
        });
    }
    return h;
};


let audioBuffers = {};

export const getAudioBuffer = (key) => {
    const buffer = audioBuffers[key];
    if (buffer === undefined)
        throw 'No audio buffer with key: "' + key + '"';
    return buffer;
};

export const registerAudioBuffer = (buffer) => {
    const key = hashCode(buffer);
    const entry = audioBuffers[key];

    if (entry === undefined) {
        audioBuffers[key] = buffer;
    }

    return key;
};

export const registerAudioFile = async (file) => {
    const audioBuffer = await readAudioFile(new AudioContext(), file);
    return [registerAudioBuffer(audioBuffer), audioBuffer];
};
