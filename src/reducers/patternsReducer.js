const initialPatterns = [
    {
        name: "Pattern 1",
        id: 0,
        notes: [ ],
    },
    {
        name: "Pattern 2",
        id: 1,
        notes: [ ],
    },
];

const patternsReducer = (patterns=initialPatterns, action) => {
    switch(action.type) {
    case 'ADD_NOTE':
        return patterns.map(pattern => {
            if (pattern.id !== action.patternId) return pattern;
            return {
                ...pattern,
                notes: pattern.notes.concat(action.note)
            };
        });
    case 'SET_NOTE_POSITION':
        if (action.position < 0) return patterns;
        return patterns.map(pattern => {
            if (pattern.id !== action.patternId) return pattern;
            return {
                ...pattern,
                notes: pattern.notes.map(note => {
                    if (note.id !== action.noteId) return note;
                    return {
                        ...note,
                        position: action.position,
                        key: action.key || note.key,
                    };
                }),
            };
        });
    case 'SET_NOTE_DURATION':
        if (action.duration <= 0) return patterns;
        return patterns.map(pattern => {
            if (pattern.id !== action.patternId) return pattern;
            return {
                ...pattern,
                notes: pattern.notes.map(note => {
                    if (note.id !== action.noteId) return note;
                    return {
                        ...note,
                        duration: action.duration,
                    };
                }),
            };
        });
    case 'MARK_NOTE_FOR_REMOVAL':
        return patterns.map(pattern => {
            if (pattern.id !== action.patternId) return pattern;
            return {
                ...pattern,
                notes: pattern.notes.map(note => {
                    if (note.id !== action.noteId) return note;
                    return {
                        ...note,
                        markedForRemoval: true,
                    };
                }),
            };
        });
    default:
        return patterns;
    }
};

export default patternsReducer;
