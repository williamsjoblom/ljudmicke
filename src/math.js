export const clamp = (value, min=0, max=1) => {
    return Math.min(Math.max(value, min), max);
}

export const lerp = (value, min, max) => {
    return min * (1 - value) + max * value;
};

export const invlerp = (value, min, max) => {
    return clamp((value - min) / (max - min));
}
