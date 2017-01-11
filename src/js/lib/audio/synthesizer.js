import StereoPannerNode from 'stereo-panner-node';
import Octavian from 'octavian';
import Context from './audio-context';
import Oscillator from './oscillator';
import AudioBus from './audio-bus';

// Polyfill for AudioContext.StereoPannerNode
StereoPannerNode.polyfill();

export default class Synthesizer {
  constructor(polyphonic = true, waveShape = 'sine', destination = Context.destination) {
    this.polyphonic = polyphonic;
    this.waveShape = waveShape;
    this.oscillators = {};
    this.octave = 3;
    this.autoPlayInterval = 250;
    
    this.audioBus = new AudioBus();
    this.audioBus.connect(destination);
    
    this.lastNote = null;
    this.lastFrequency = null;
  }
  
  toggleAutoPlay(noteGenerator) {
    if (this.autoPlayTimeout) {
      clearInterval(this.autoPlayTimeout);
      this.autoPlayTimeout = null;
      this.releaseAll();
    } else {
      this.autoPlayTimeout = setInterval(() => {
        const note = noteGenerator.random();
        this.playNote(note);
      }, this.autoPlayInterval);
    }
    
    if (this.handleToggleAutoPlay) {
      this.handleToggleAutoPlay(Boolean(this.autoPlayTimeout));
    }
  }
  
  setOctave(direction) {
    if (direction === 'up' && this.octave < 6) {
      this.octave += 1;
    } else if (direction === 'down' && this.octave > 1) {
      this.octave -= 1;
    }
    
    if (this.handleOctaveChanged) {
      this.handleOctaveChanged(this.octave);
    }
  }
  
  setWaveShape(shape) {
    this.waveShape = shape;
    
    if (this.handleWaveShapeChanged) {
      this.handleWaveShapeChanged(shape);
    }
  }
  
  playNote(note) {
    if (!this.polyphonic && this.lastNote) {
      this.releaseNote(this.lastNote);
    }
    
    const octave = this.octave + note.relOctave;
    this.oscillatorForNote(`${note.note}${octave}`).start();
    
    this.lastNote = note;
    
    if (this.handlePlayNote) {
      this.handlePlay(note);
    }
  }
  
  releaseNote(note) {
    const octave = this.octave + note.relOctave;
    this.oscillatorForNote(`${note.note}${octave}`).stop();
    
    if (this.handleReleaseNote) {
      this.handleRelease(note);
    }
  }
  
  playFrequency(freq) {
    if (!this.polyphonic && this.lastFrequency) {
      this.releaseFrequency(this.lastFrequency);
    }
    
    this.oscillatorForFrequency(freq).start();
    
    this.lastFrequency = freq;
    
    if (this.handlePlayFrequency) {
      this.handlePlayFrequency(freq);
    }
  }
  
  releaseFrequency(freq) {
    this.oscillatorForFrequency(freq).stop();
    
    if (this.handleReleaseFrequency) {
      this.handleReleaseFrequency(freq);
    }
  }
  
  releaseAll() {
    Object.keys(this.oscillators).forEach((freq) => {
      this.oscillators[freq].stop();
    });
  }
  
  oscillatorForNote(note) {
    const frequency = new Octavian.Note(note).frequency;
    return this.oscillatorForFrequency(frequency);
  }
  
  oscillatorForFrequency(frequency) {
    if (!this.oscillators[frequency]) {
      this.oscillators[frequency] = new Oscillator(frequency, this.audioBus.input);
    }
    
    this.oscillators[frequency].setType(this.waveShape);
    
    return this.oscillators[frequency];
  }
  
  onPlayNote(callback) {
    this.handlePlayNote = callback;
  }
  
  onReleaseNote(callback) {
    this.handleReleaseNote = callback;
  }
  
  onPlayFrequency(callback) {
    this.handlePlayFrequency = callback;
  }
  
  onReleaseFrequency(callback) {
    this.handleReleaseFrequency = callback;
  }
  
  onToggleAutoPlay(callback) {
    this.handleToggleAutoPlay = callback;
    callback(Boolean(this.autoPlayTimeout));
  }
  
  onWaveShapeChanged(callback) {
    this.handleWaveShapeChanged = callback;
    callback(this.waveShape);
  }
  
  onOctaveChanged(callback) {
    this.handleOctaveChanged = callback;
    callback(this.octave);
  }
}
