import deepmerge from 'deepmerge';

const initialSynths = [
    {
        name: "Synth",
        id: 0,
        params: {
            oscillators: [
                {
                    id: 0,
                    waveform: 'sawtooth',
                    semiTones: 0,
                    detune: 0,
                    gain: 1,
                },
                {
                    id: 1,
                    waveform: 'triangle',
                    semiTones: 0,
                    detune: 0,
                    gain: 0.65,
                },
                {
                    id: 2,
                    waveform: 'square',
                    semiTones: 0,
                    detune: 0,
                    gain: 0,
                }
            ],
            filter: {
                cutoff: 202,
                envelopeIntensity: 0.36,
                resonance: 96/4,
            },
            envelopes: [
                // Filter:
                {
                    id: 0,
                    attack: 0.55,
                    decay: 7.56,
                    sustain: 0.28,
                    release: 0.13,
                },
                // Amplitude:
                {
                    id: 1,
                    attack: 0.18,
                    decay: 6.52,
                    sustain: 1,
                    release: 0.25,
                },
            ],
        }
    }

];

const synthsReducer = (synths=initialSynths, action) => {
    switch(action.type) {
    case 'SET_SYNTH_PARAMS':
        return synths.map(synth => {
            if (synth.id !== action.synthId) return synth;
            return {
                ...synth,
                params: deepmerge(synth.params, action.params)
            };
        });
    case 'SET_SYNTH_OSCILLATOR_PARAMS':
        return synths.map(synth => {
            if (synth.id !== action.synthId) return synth;
            return {
                ...synth,
                params: {
                    ...synth.params,
                    oscillators: synth.params.oscillators.map(osc => {
                        if (osc.id !== action.oscillatorId) return osc;

                        return {
                            ...osc,
                            ...action.params,
                        }
                    })
                }
            };

        });
    case 'SET_SYNTH_ENVELOPE_PARAMS':
        return synths.map(synth => {
            if (synth.id !== action.synthId) return synth;
            return {
                ...synth,
                params: {
                    ...synth.params,
                    envelopes: synth.params.envelopes.map(env => {
                        if (env.id !== action.envelopeId) return env;

                        return {
                            ...env,
                            ...action.params,
                        }
                    })
                }
            };

        });
    default:
        return synths;
    }
};

export default synthsReducer;
