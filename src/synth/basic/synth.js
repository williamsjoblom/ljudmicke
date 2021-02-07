import * as Tone from 'tone';

import Component from './Component';

/**
 * Transpose a note by the given number of semitones.
 */
const transposeNoteBySemitones = (note, semitones) => {
    const f = Tone.Frequency(note).toFrequency();
    const a = Math.pow(2, 1/12);
    return f*Math.pow(a, semitones);
};

/**
 * Build initial oscillator options from filter parameters.
 */
const makeOscillatorOptions = (params) => ({
    type: params.waveform,
    detune: params.detune,
});

/**
 * Build initial envelope options from filter parameters.
 */
const makeEnvelopeOptions = (params) => ({
    attack: params.attack,
    decay: params.decay,
    sustain: params.sustain,
    release: params.release,
});

/**
 * Build initial filter options from filter parameters.
 */
const makeFilterOptions = (params) => ({
    type: params.type,
    frequency: params.cutoff,
    Q: params.resonance,
});


/**
 * Build a WebAudio node compensating for the combined gain (normal
 * range) of the given gain signals.
 */
const makeGainNormalizer = (gains) => {
    return new Tone.WaveShaper(sample => {
        const totalGain = Math.max(
            gains.reduce((sum, gain) => sum + gain.value, 0),
            1);
        return sample / totalGain;
    });
};


/**
 * Get the magnitude of the resonant peak of the given biquad filter.
 */
const getResonantFreqMagnitude = (filter) => {
    const frequencies = new Float32Array(1);
    frequencies[0] = filter.frequency.value;

    const filterClone = filter.context.createBiquadFilter();
    filterClone.type = filter.type;
    filterClone.Q.value = filter.Q.value;
    filterClone.frequency.value = filter.frequency.value;
    filterClone.gain.value = filter.gain.value;

    const magnitudes = new Float32Array(1);
    const phases = new Float32Array(1);
    filterClone.getFrequencyResponse(frequencies, magnitudes, phases);

    return magnitudes[0];
};

/**
 * Basic monophonic subtractive synth.
 *
 *
 *                        +--------+
 *                        | Filter |
 *                        |Envelope|
 * +------+  +------+     +---+----+
 * | OSC1 +->| Gain +--+      | cutoff
 * +------+  +------+  |      v
 * +------+  +------+  |  +--------+  +--------------------+
 * | OSC2 +->| Gain |--+->| Filter +->| Gain Normalization +--+
 * +------+  +------+  |  +--------+  +--------------------+  |
 * +------+  +------+  |                       +-----------+  |
 * | OSC3 +->| Gain +--+      +------------+   | Amplitude |  |
 * +------+  +------+      +--+ Compressor |<--+  Envelope |<-+
 *                         |  +------------+   +-----------+
 *                         v
 *                      Output
 *
 * TODO: Gain normalization does not account for the resonant
 * frequencies of the filter being outside of the normal range, so
 * with a sufficiently high filter Q-factor we may still see some
 * clipping.
 */
class BasicSynth  {
    constructor(params) {
        this.semiTones = 0;

        // Build compressor.
        this.compressor = new Tone.Compressor().toDestination();

        // Build amplitude envelope.
        this.ampEnvelope = new Tone.AmplitudeEnvelope(
            makeEnvelopeOptions(params.envelopes[1])
        );

        // Construct filter and frequency envelope.
        this.filter = new Tone.BiquadFilter(
            makeFilterOptions(params.filter)
        );
        this.filterGain = new Tone.Gain(
            params.filter.cutoff
        );
        this.filterEnvelope = new Tone.Envelope(
            makeEnvelopeOptions(params.envelopes[0])
        );
        this.filterEnvelope.chain(this.filterGain, this.filter.frequency);

        // Construct oscillators.
        const oscillatorGainNodes = params.oscillators.map(_ =>
            new Tone.Gain({units: 'normalRange'}).connect(this.filter)
        );
        this.oscillatorGains = params.oscillators.map((param, i) =>
            new Tone.Signal(param.gain).connect(oscillatorGainNodes[i].gain)
        );
        this.oscillators = params.oscillators.map((param, i) =>
            new Tone.OmniOscillator(
                makeOscillatorOptions(param)
            ).connect(oscillatorGainNodes[i])
        );

        // Construct gain normalizer.
        const gainNormalizer = makeGainNormalizer(this.oscillatorGains);
        this.filter.chain(gainNormalizer, this.ampEnvelope, this.compressor);

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
