import * as Tone from 'tone';

import Component from './Component';

const transposeNoteBySemitones = (note, semitones) => {
    const f = Tone.Frequency(note).toFrequency();
    console.log('FREQUENCY!!!', f);
    const a = Math.pow(2, 1/12);
    return f*Math.pow(a, semitones);
};

//NOTE: Based on 'yellow' preset from https://subtract.one/
class BasicSynth  {
    constructor(params) {
        const oscillatorOptions = {
            type: 'sine',
        };

        this.semiTones = 0;

        this.compressor = new Tone.Compressor().toDestination();
        this.ampEnvelope = new Tone.AmplitudeEnvelope().connect(this.compressor);

        this.filter = new Tone.BiquadFilter({type: 'lowpass'}).connect(this.ampEnvelope);
        this.filterGain = new Tone.Gain().connect(this.filter.frequency);
        this.filterEnvelope = new Tone.Envelope().connect(this.filterGain);

        this.oscillatorGains = [
            new Tone.Gain().connect(this.filter),
            new Tone.Gain().connect(this.filter),
            new Tone.Gain().connect(this.filter),
        ];

        this.oscillators = [
            new Tone.OmniOscillator(oscillatorOptions).connect(this.oscillatorGains[0]),
            new Tone.OmniOscillator(oscillatorOptions).connect(this.oscillatorGains[1]),
            new Tone.OmniOscillator(oscillatorOptions).connect(this.oscillatorGains[2]),
        ];
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
