import store from './store';
import { setPlaybackPosition } from './actions';
import { registerAudioBuffer, getAudioBuffer } from './audioStore';

import * as Tone from 'tone';


/**
 * Convert midi note to frequency given 440 Hz tuning.
 */
export const freq = (midi) => {
    const tuning = 440;

    if (0 <= midi && midi < 128)
        return Math.pow(2, (midi - 69) / 12) * tuning;
    else
        return null;
};

export const readFile = (file) => {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
        reader.onerror = (e) => {
            reader.abort();
            reject(e);
        };

        reader.onload = (event) => {
            resolve(event.target.result);
        };

        reader.readAsArrayBuffer(file);
    });
};

export const readAudioFile = (context, file) => {
    return readFile(file).then(buffer => {
        return context.decodeAudioData(buffer);
    });
};


const makeTrackSink = (context, destination, track) => {
    const effectChain = [
        new GainNode(context, { gain: track.volume*2 }),
        new StereoPannerNode(context, { pan: track.pan*2 - 1 }),
    ];

    const output = effectChain.reduce((prevEffect, effect) => {
        prevEffect.connect(effect);
        return effect;
    });
    output.connect(destination);

    return effectChain[0];
};

const SourceEndPromise = (source) => new Promise(resolve => {
    source.onended = () => {
        resolve();
    };
});

export const play = async (tracks) => {

    const state = store.getState();

    const secondsPerBeat = 60 / state.timeline.beatsPerMinute;
    console.log(secondsPerBeat);

    const synth = new Tone.PolySynth(Tone.Synth, {
	oscillator: {
	    partials: [0, 2, 3, 4],
	}
    }).toDestination();

    const pattern = state.patterns[0];
    const part = new Tone.Part((time, value) => {
        synth.triggerAttackRelease(value.note, value.duration,
                                   time, value.velocity);
    }, pattern.notes.filter(note => !note.markedForRemoval).map(note => {
        return { time: note.position*secondsPerBeat,
                 note: freq(note.key),
                 velocity: note.velocity,
                 duration: note.duration*secondsPerBeat,
               };
    })).start(0);
    Tone.Transport.stop();
    Tone.Transport.start();

    console.log(part);

    return;






    let context = new AudioContext();

    // NOTE: Code for playing regular timeline without tone.js
    const position = store.getState().timeline.position;
    let now = context.currentTime;

    let interval = null;

    let endPromises = [];
    tracks.forEach(track => {
        const sink = makeTrackSink(context, context.destination, track);

        let sources = track.entities.map(entity => {
            const buffer = getAudioBuffer(entity.bufferKey);
            let source = context.createBufferSource();
            source.buffer = buffer;
            source.connect(sink);
            return source;
        });

        sources.forEach((source, i) => {
            const entity = track.entities[i];

            const duration = 0;
            const when = Math.max(0, (now + entity.position) - position);
            const offset = Math.max(0, position - (now + entity.position));

            if (offset > source.buffer.duration) return;
            source.start(when, offset, /* duration */);
            endPromises.push(SourceEndPromise(source));
        });
    });

    const playing = (endPromises.length > 0);
    if (playing) {
        const interval = setInterval(() => {
            store.dispatch(setPlaybackPosition(position + context.currentTime - now));
        }, 1000/60);
        await Promise.all(endPromises);
        clearInterval(interval);
        store.dispatch(setPlaybackPosition(position));
    }
};

export const pause = () => {

};
