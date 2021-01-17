
export const makeBackgroundLines = (divisionSpacing, subdivisionSpacing) => {
    let backgroundImages = [
        'linear-gradient(to right, rgba(255, 255, 255, .2) 1px, transparent 1px, transparent)'
    ];
    if (subdivisionSpacing !== undefined) {
        for (let x = subdivisionSpacing; x < divisionSpacing; x = x + subdivisionSpacing) {
            const gradients = [ 'linear-gradient(to right, transparent ' + x + 'px',
                                'rgba(255, 255, 255, 0.1) ' + x + 'px',
                                'transparent ' + (x + 1) + 'px, transparent)' ];

            backgroundImages.push(gradients.join(','));
        }
    }

    return {
        backgroundImage: backgroundImages.join(','),
        backgroundSize: divisionSpacing + 'px 150px',
    };
};
