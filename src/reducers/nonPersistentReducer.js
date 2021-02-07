const initialNonPersistent = {
    playing: false,
    midiDevices: [],
};

const nonPersistentReducer = (nonPersistent=initialNonPersistent, action) => {
    switch(action.type) {
    case 'PLAY':
        return {
            ...nonPersistent,
            playing: true,
        };
    case 'PAUSE':
        return {
            ...nonPersistent,
            playing: false,
        };
    case 'STOP':
        return {
            ...nonPersistent,
            playing: false,
        };
    case 'SET_MIDI_DEVICES':
        return {
            ...nonPersistent,
            midiDevices: action.devices,
        }
    default:
        return nonPersistent;
    }
};

export default nonPersistentReducer;
