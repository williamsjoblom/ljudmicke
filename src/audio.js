import store from './store';
import {
    setPlaybackPosition,
    setPlaying,
    setPaused,
    setStopped,
} from './actions';
import { registerAudioBuffer, getAudioBuffer } from './audioStore';
import * as Tracks from './tracks';

import * as Tone from 'tone';
import MIDIFile from 'midifile';

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

export const readMIDIFile = (file) => {
    return readFile(file).then(buffer => {
        return new MIDIFile(buffer);
    });
};

const makeTrackSink = (track) => {
    const effects = Tracks.getTrackEffectChain(track.id);

    const effectChain = [
        effects.gain,
        effects.pan,
    ];
    const output = effectChain.reduce((prevEffect, effect) => {
        prevEffect.connect(effect);
        return effect;
    });
    output.toDestination();

    return effectChain[0];
};

const SourceEndPromise = (source) => new Promise(resolve => {
    source.onended = () => {
        resolve();
    };
});

const makeSynth = () => {
    return new Tone.PolySynth(Tone.Synth, {
	oscillator: {
	    partials: [0, 2, 3, 4],
	}
    });
};

const trackEndTime = (track) => {
    return Math.max(
        ...track.entities.map(
            entity => entity.position + entity.duration
        )
    );

};

const scheduleAudioTrack = (state, track) => {
    const sink = makeTrackSink(track);

    let sources = track.entities.map(entity => {
        const buffer = getAudioBuffer(entity.bufferKey);
        const player = new Tone.Player(buffer).connect(sink);
        player.sync(); // Sync player with transport.
        player.start(entity.position);
    });
};

const scheduleMidiTrack = (state, track) => {
    const sink = makeTrackSink(track);
    const synth = makeSynth();
    synth.connect(sink);

    const secondsPerBeat = 60 / state.timeline.beatsPerMinute;
    track.entities.forEach(entity => {
        const pattern = state.patterns[entity.patternKey];
        new Tone.Part((time, value) => {
            synth.triggerAttackRelease(value.note, value.duration,
                                       time, value.velocity);
        }, pattern.notes.filter(note => !note.markedForRemoval).map(note => {
            return { time: note.position*secondsPerBeat,
                     note: freq(note.key),
                     velocity: note.velocity,
                     duration: note.duration*secondsPerBeat,
                   };
        })).start(entity.position);
    });
};

const trackScheduler = (trackType) => {
    switch (trackType) {
    case 'audio': return scheduleAudioTrack;
    case 'midi': return scheduleMidiTrack;
    default:
        console.error('unknown track type');
        return null;
    }
};

let interval = undefined;
let timeout = undefined;
export const play = async (tracks) => {
    const state = store.getState();

    Tone.Transport.cancel();

    state.tracks.forEach(track => {
        const schedule = trackScheduler(track.type);
        schedule(state, track);
    });

    const startTime = 0;
    const endTime = Math.max(...tracks.map(track => trackEndTime(track)));
    const playing = (endTime > startTime);
    if (playing) {
        Tone.Transport.stop();
        Tone.Transport.start(Tone.now(), state.timeline.position);
        store.dispatch(setPlaying());

        interval = setInterval(() => {
            store.dispatch(setPlaybackPosition(Tone.Transport.seconds));
        }, 1000/60);

        timeout = setTimeout(() => {
            clearInterval(interval)
            store.dispatch(setPlaybackPosition(startTime));
            store.dispatch(setPaused());
        }, (endTime - startTime)*1000);
    }
};

export const pause = () => {
    Tone.Transport.pause();
    store.dispatch(setPaused());

    if (interval !== undefined)
        clearInterval(interval);
    if (timeout !== undefined)
        clearTimeout(timeout);
};

export const stop = () => {
    Tone.Transport.stop();
    Tone.Transport.cancel();
    store.dispatch(setStopped());

    if (interval !== undefined)
        clearInterval(interval);
    if (timeout !== undefined)
        clearTimeout(timeout);
};
