const baseEntity = (id, name, position, duration) => ({
    id: id,
    name: name,
    position: position,
    duration: duration,
});

export const audioEntity = (id, name, position, duration, bufferKey) => ({
    type: 'audio',
    ...baseEntity(id, name, position, duration),
    bufferKey: bufferKey,
});

export const patternEntity = (id, name, position, duration, patternKey) => ({
    type: 'pattern',
    ...baseEntity(id, name, position, duration),
    patternKey: patternKey,
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
