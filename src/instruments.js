import BasicSynth from './synth/basic/synth';

export let instruments = [ ];

export const init = async (synths) => {
    const instrumentModules = await Promise.all(
        synths.map(synth => import(`./${synth.path}/synth`))
    );

    instruments = instrumentModules.map((Module, i) =>
        new Module.default(synths[i].params)
    );
};

export const getInstrument = (id) => instruments[id];
