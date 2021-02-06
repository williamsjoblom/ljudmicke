import * as Tone from 'tone';

import Component from './Component';

const transposeNoteBySemitones = (note, semitones) => {
    const f = Tone.Frequency(note).toFrequency();
    console.log('FREQUENCY!!!', f);
    const a = Math.pow(2, 1/12);
    return f*Math.pow(a, semitones);
};

const makeOscillatorOptions = (params) => ({
    type: params.waveform,
    detune: params.detune,
});

const makeEnvelopeOptions = (params) => ({
    attack: params.attack,
    decay: params.decay,
    sustain: params.sustain,
    release: params.release,
});

const makeFilterOptions = (params) => ({
    type: 'lowpass',
    Q: params.resonance,
});

//NOTE: Based on 'yellow' preset from https://subtract.one/
class BasicSynth  {
    constructor(params) {
        this.semiTones = 0;

        this.compressor = new Tone.Compressor().toDestination();
        this.ampEnvelope = new Tone.AmplitudeEnvelope(
            makeEnvelopeOptions(params.envelopes[1])
        ).connect(this.compressor);

        this.filter = new Tone.BiquadFilter(
            makeFilterOptions(params.filter)
        ).connect(this.ampEnvelope);

        this.filterGain = new Tone.Gain(
            params.filter.cutoff
        ).connect(this.filter.frequency);

        this.filterEnvelope = new Tone.Envelope(
            makeEnvelopeOptions(params.envelopes[0])
        ).connect(this.filterGain);

        this.oscillatorGains = params.oscillators.map(param =>
            new Tone.Gain(param.gain).connect(this.filter)
        );

        this.oscillators = params.oscillators.map((param, i) =>
            new Tone.OmniOscillator(
                makeOscillatorOptions(param)
            ).connect(this.oscillatorGains[i])
        );

        this.oscillators.forEach(osc => osc.semitones = 0);

        const now = Tone.now();
        this.oscillators.forEach(osc => osc.start(now));

        this.triggerAttack = this.triggerAttack.bind(this);
        this.triggerRelease = this.triggerRelease.bind(this);
    }

    triggerAttack(note, time, velocity=1) {
        this.oscillators.forEach(osc => {
            const f = transposeNoteBySemitones(note, osc.semitones);
            osc.stop();
            osc.frequency.value = f;
            osc.start();
        });
        this.ampEnvelope.triggerAttack(time, velocity);
        this.filterEnvelope.triggerAttack(time, velocity);
    }

    triggerRelease(note, time) {
        this.ampEnvelope.triggerRelease(time);
        this.filterEnvelope.triggerRelease(time);
    }

    triggerAttackRelease(note, duration, time, velocity) {
        this.ampEnvelope.triggerAttackRelease(duration, time, velocity);
    }
};

export default BasicSynth;
