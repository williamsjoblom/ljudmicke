import Note from './note';

import nonPersistentReducer from './reducers/nonPersistentReducer';
import timelineReducer from './reducers/timelineReducer';
import tracksReducer from './reducers/tracksReducer';
import patternsReducer from './reducers/patternsReducer';
import synthsReducer from './reducers/synthsReducer';
import { combineReducers } from 'redux';

const updateObject = (oldObject, newValues) => {
    return Object.assign({}, oldObject, newValues);
};

const updateArrayItem = (array, itemId, updateCallback) => {
    return array.map(item => {
        if (item.id !== itemId) return item;
        return updateCallback(item);
    });
};

const appendArrayItem = (array, item) => {
    return array.concat(item);
};

const reducer = combineReducers({
    nonPersistent: nonPersistentReducer,
    timeline: timelineReducer,
    tracks: tracksReducer,
    patterns: patternsReducer,
    synths: synthsReducer,
});

export default reducer;
