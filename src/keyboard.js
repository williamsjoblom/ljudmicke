import * as Tone from 'tone';

const keyToKeyMap = {
    'a': 'C',
    'w': 'C#', //#
    's': 'D',
    'e': 'Eb', //#
    'd': 'E',
    'f': 'F',
    't': 'F#', //#
    'g': 'G',
    'y': 'G#', //#
    'h': 'A',
    'u': 'A#', //#
    'j': 'B'
}

const octaves = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']

// document > Redux lol
document.octave = 4
document.keysDown = new Set()

let keyboardListeners = [];
document.addEventListener("keydown", event => {
    if (event.key in keyToKeyMap && !document.keysDown.has(event.key)) {
        const midiKey = Tone.Frequency(keyToKeyMap[event.key] + document.octave)
              .toMidi();
        keyboardListeners.forEach(fn => fn(midiKey, 1));
        document.keysDown.add(event.key);
    } else if (event.key in octaves) {
        document.octave = event.key
    }
});

document.addEventListener("keyup", event => {
    if (event.key in keyToKeyMap) {
        const midiKey = Tone.Frequency(keyToKeyMap[event.key] + document.octave)
              .toMidi();
        keyboardListeners.forEach(fn => fn(midiKey, 0));
        document.keysDown.delete(event.key);
    }
});


export const addMIDIListener = (fn) => {
    keyboardListeners.push(fn);
};

export const removeMIDIListener = (fn) => {
    keyboardListeners = keyboardListeners.filter(
        value => value !== fn
    );
};
