
export const makeBackgroundLines = (divisionSpacing, subdivisionSpacing) => {
    let backgroundImages = [
        'linear-gradient(to right, rgba(255, 255, 255, .2) 1px, transparent 1px, transparent)'
    ];
    if (subdivisionSpacing !== undefined) {
        for (let x = subdivisionSpacing; x < divisionSpacing; x = x + subdivisionSpacing) {
            const rx = Math.round(x);
            const gradients = [ 'linear-gradient(to right, transparent ' + rx + 'px',
                                'rgba(255, 255, 255, 0.1) ' + rx + 'px',
                                'transparent ' + (rx + 1) + 'px, transparent)' ];

            backgroundImages.push(gradients.join(','));
        }
    }

    return {
        backgroundImage: backgroundImages.join(','),
        backgroundSize: divisionSpacing + 'px 150px',
    };
};
