import store from './store';
import { getAudioBuffer } from './audioStore';
import { patternDurationInSeconds,
         emptyPatternDurationInSeconds } from './pattern';


const baseEntity = (id, name, position) => ({
    id: id,
    name: name,
    position: position,
    markedForRemoval: false,
});

export const audioEntity = (id, name, position, duration, bufferKey) => ({
    type: 'audio',
    ...baseEntity(id, name, position),
    bufferKey: bufferKey,
    duration: getAudioBuffer(bufferKey).duration,
});

export const patternEntity = (id, name, position, duration, patternKey) => ({
    type: 'pattern',
    ...baseEntity(id, name, position),
    patternKey: patternKey,
    duration: Math.max(
        patternDurationInSeconds(patternKey),
        emptyPatternDurationInSeconds(),
    ),
});

// export class AudioEntity {
//     constructor(id, name, position, duration, bufferKey) {
//         this.id = id;
//         this.name = name;
//         this.position = position;
//         this.bufferKey = bufferKey;
//         this.duration = duration;
//     }
// }
