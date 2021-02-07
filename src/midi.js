const OP_KEYBOARD = 144;

let keyboardListeners = [];
export let inputDevice = null;

export const addKeyboardListener = (fn) => {
    keyboardListeners.push(fn);
};

export const removeKeyboardListener = (fn) => {
    keyboardListeners = keyboardListeners.filter(
        value => value !== fn
    );
};

export const getInputDevices = async () => {
    if (typeof navigator.requestMIDIAccess === 'function') {
        const access = await navigator.requestMIDIAccess();
        return Array.from(access.inputs.values());
    } else return []
};

if (typeof navigator.requestMIDIAccess === 'function') {
    navigator.requestMIDIAccess()
    .then(access => {
        access.inputs.forEach(input => {
            input.onmidimessage = (m) => {
                const op = m.data[0];
                const key = m.data[1];
                const value = m.data[2];

                switch (op) {
                case OP_KEYBOARD:
                    keyboardListeners.forEach(fn => fn(key, value / 128));
                    break;
                }
            };
        });
    })
} else {
    console.error('Bad browser. No MIDI support.')
}
