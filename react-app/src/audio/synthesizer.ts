import Octavian from 'octavian';
import { Oscillator } from './oscillator';
import { AudioBus } from './audioBus';
import { NoteGenerator } from './noteGenerator';
import { Note } from './note';

export class Synthesizer {
  private _context: AudioContext;
  private _polyphonic: boolean;
  private _waveShape: OscillatorType;
  private _oscillators: {[freq: number]: Oscillator};
  private _baseOctave: number;
  private _audioBus: AudioBus;
  private _autoPlayNoteGenerator: NoteGenerator | null;
  private _autoPlayBpm: number;
  private _autoPlayTimeout: NodeJS.Timer | null;
  private _lastNote: Note | null;
  private _lastFrequency: number | null;
  private _handleToggleAutoPlay: (on: boolean) => void;
  private _handleOctaveChanged: (octave: number) => void;
  private _handleWaveShapeChanged: (shape: OscillatorType) => void;
  private _handlePlayNote: (note: Note) => void;
  private _handleReleaseNote: (note: Note) => void;
  private _handlePlayFrequency: (freq: number) => void;
  private _handleReleaseFrequency: (freq: number) => void;

  constructor(context: AudioContext, polyphonic: boolean = true, waveShape: OscillatorType = 'sine', destination = context.destination) {
    this._context = context;
    this._polyphonic = polyphonic;
    this._waveShape = waveShape;
    this._oscillators = {};
    this._baseOctave = 0;
    this._autoPlayNoteGenerator = null;
    this._autoPlayBpm = 240;
    
    this._audioBus = new AudioBus(context);
    this._audioBus.connect(destination);
    
    this._lastNote = null;
    this._lastFrequency = null;
  }

  get audioBus() {
    return this._audioBus;
  }
  
  toggleAutoPlay(on: boolean) {
    if (on) {
      this._startAutoPlay();
    } else {
      this._stopAutoPlay();
    }
    
    if (this._handleToggleAutoPlay) {
      this._handleToggleAutoPlay(Boolean(this._autoPlayTimeout));
    }
  }

  setAutoPlayNoteGenerator(noteGenerator: NoteGenerator) {
    this._autoPlayNoteGenerator = noteGenerator;
  }
  
  setAutoPlayBpm(bpm: number) {
    this._autoPlayBpm = bpm;
    if (this._autoPlayTimeout) {
      this._stopAutoPlay();
      this._startAutoPlay();
    }
  }
  
  setOctave(direction: 'up' | 'down') {
    if (direction === 'up' && this._baseOctave < 6) {
      this._baseOctave += 1;
    } else if (direction === 'down' && this._baseOctave > 1) {
      this._baseOctave -= 1;
    }
    
    if (this._handleOctaveChanged) {
      this._handleOctaveChanged(this._baseOctave);
    }
  }
  
  setWaveShape(shape: OscillatorType) {
    this._waveShape = shape;
    
    if (this._handleWaveShapeChanged) {
      this._handleWaveShapeChanged(shape);
    }
  }
  
  playNote(note: Note) {
    if (!this._polyphonic && this._lastNote) {
      this.releaseNote(this._lastNote);
    }
    
    const octave = this._baseOctave + note.octave;
    this._oscillatorForNoteString(`${note.note}${octave}`).start();
    
    this._lastNote = note;
    
    if (this._handlePlayNote) {
      this._handlePlayNote(note);
    }
  }
  
  releaseNote(note: Note) {
    const octave = this._baseOctave + note.octave;
    this._oscillatorForNoteString(`${note.note}${octave}`).stop();
    
    if (this._handleReleaseNote) {
      this._handleReleaseNote(note);
    }
  }
  
  playFrequency(freq: number) {
    if (!this._polyphonic && this._lastFrequency) {
      this.releaseFrequency(this._lastFrequency);
    }
    
    this._oscillatorForFrequency(freq).start();
    
    this._lastFrequency = freq;
    
    if (this._handlePlayFrequency) {
      this._handlePlayFrequency(freq);
    }
  }
  
  releaseFrequency(freq: number) {
    this._oscillatorForFrequency(freq).stop();
    
    if (this._handleReleaseFrequency) {
      this._handleReleaseFrequency(freq);
    }
  }
  
  releaseAll() {
    Object.keys(this._oscillators).forEach((freq) => {
      this._oscillators[freq].stop();
    });
  }
  
  onPlayNote(callback: (note: Note) => void) {
    this._handlePlayNote = callback;
  }
  
  onReleaseNote(callback: (note: Note) => void) {
    this._handleReleaseNote = callback;
  }
  
  onPlayFrequency(callback: (freq: number) => void) {
    this._handlePlayFrequency = callback;
  }
  
  onReleaseFrequency(callback: (freq: number) => void) {
    this._handleReleaseFrequency = callback;
  }
  
  onToggleAutoPlay(callback: (on: boolean) => void) {
    this._handleToggleAutoPlay = callback;
    callback(Boolean(this._autoPlayTimeout));
  }
  
  onWaveShapeChanged(callback: (shape: OscillatorType) => void) {
    this._handleWaveShapeChanged = callback;
    callback(this._waveShape);
  }
  
  onOctaveChanged(callback: (octave: number) => void) {
    this._handleOctaveChanged = callback;
    callback(this._baseOctave);
  }

  private _stopAutoPlay() {
    if (this._autoPlayTimeout) {
      clearInterval(this._autoPlayTimeout);
      this._autoPlayTimeout = null;
    }
    this.releaseAll();
  }

  private _startAutoPlay() {
    const interval = 60000 / this._autoPlayBpm; // 60,000ms (60s) / bpm
    this._autoPlayTimeout = setInterval(() => {
      if (this._autoPlayNoteGenerator) {
        const note = this._autoPlayNoteGenerator.random();
        if (note) {
          this.playNote(note);
        }
        else if (this._lastNote) {
          this.releaseNote(this._lastNote);
        }
      }
    }, interval);
  }
  
  private _oscillatorForNoteString(noteOctaveString: string) {
    const frequency = new Octavian.Note(noteOctaveString).frequency;
    return this._oscillatorForFrequency(frequency);
  }
  
  private _oscillatorForFrequency(freq: number) {
    if (!this._oscillators[freq]) {
      this._oscillators[freq] = new Oscillator(this._context, freq, this._audioBus.input);
    }
    
    this._oscillators[freq].setType(this._waveShape);
    
    return this._oscillators[freq];
  }
}
