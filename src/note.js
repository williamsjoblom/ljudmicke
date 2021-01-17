/**
 * Position and duration in #beats.
 */
const Note = (id, key, position, duration, velocity=1.0) => ({
    id: id,
    key: key,
    position: position,
    duration: duration,
    velocity: velocity,
    markedForRemoval: false,
});

export default Note;
