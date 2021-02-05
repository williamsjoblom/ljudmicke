const initialNonPersistent = {
    playing: false,
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
    default:
        return nonPersistent;
    }
};

export default nonPersistentReducer;
