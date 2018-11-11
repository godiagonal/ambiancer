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

  public get audioBus() {
    return this._audioBus;
  }
  
  public toggleAutoPlay() {
    if (this._autoPlayTimeout) {
      this.stopAutoPlay();
    } else {
      this.startAutoPlay();
    }
    
    if (this._handleToggleAutoPlay) {
      this._handleToggleAutoPlay(Boolean(this._autoPlayTimeout));
    }
  }

  public stopAutoPlay() {
    if (this._autoPlayTimeout) {
      clearInterval(this._autoPlayTimeout);
      this._autoPlayTimeout = null;
    }
    this.releaseAll();
  }

  public startAutoPlay() {
    if (!this._autoPlayNoteGenerator) {
      console.error('Missing note generator.');
      return;
    }

    const interval = 60000 / this._autoPlayBpm; // 60,000ms (60s) / bpm
    this._autoPlayTimeout = setInterval(() => {
      const note = this._autoPlayNoteGenerator!.random();
      this.playNote(note);
    }, interval);
  }

  public setAutoPlayNoteGenerator(noteGenerator: NoteGenerator) {
    this._autoPlayNoteGenerator = noteGenerator;
  }
  
  public setAutoPlayBpm(bpm: number) {
    this._autoPlayBpm = bpm;
    if (this._autoPlayTimeout) {
      this.stopAutoPlay();
      this.startAutoPlay();
    }
  }
  
  public setOctave(direction: 'up' | 'down') {
    if (direction === 'up' && this._baseOctave < 6) {
      this._baseOctave += 1;
    } else if (direction === 'down' && this._baseOctave > 1) {
      this._baseOctave -= 1;
    }
    
    if (this._handleOctaveChanged) {
      this._handleOctaveChanged(this._baseOctave);
    }
  }
  
  public setWaveShape(shape: OscillatorType) {
    this._waveShape = shape;
    
    if (this._handleWaveShapeChanged) {
      this._handleWaveShapeChanged(shape);
    }
  }
  
  public playNote(note: Note) {
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
  
  public releaseNote(note: Note) {
    const octave = this._baseOctave + note.octave;
    this._oscillatorForNoteString(`${note.note}${octave}`).stop();
    
    if (this._handleReleaseNote) {
      this._handleReleaseNote(note);
    }
  }
  
  public playFrequency(freq: number) {
    if (!this._polyphonic && this._lastFrequency) {
      this.releaseFrequency(this._lastFrequency);
    }
    
    this._oscillatorForFrequency(freq).start();
    
    this._lastFrequency = freq;
    
    if (this._handlePlayFrequency) {
      this._handlePlayFrequency(freq);
    }
  }
  
  public releaseFrequency(freq: number) {
    this._oscillatorForFrequency(freq).stop();
    
    if (this._handleReleaseFrequency) {
      this._handleReleaseFrequency(freq);
    }
  }
  
  public releaseAll() {
    Object.keys(this._oscillators).forEach((freq) => {
      this._oscillators[freq].stop();
    });
  }
  
  public onPlayNote(callback: (note: Note) => void) {
    this._handlePlayNote = callback;
  }
  
  public onReleaseNote(callback: (note: Note) => void) {
    this._handleReleaseNote = callback;
  }
  
  public onPlayFrequency(callback: (freq: number) => void) {
    this._handlePlayFrequency = callback;
  }
  
  public onReleaseFrequency(callback: (freq: number) => void) {
    this._handleReleaseFrequency = callback;
  }
  
  public onToggleAutoPlay(callback: (on: boolean) => void) {
    this._handleToggleAutoPlay = callback;
    callback(Boolean(this._autoPlayTimeout));
  }
  
  public onWaveShapeChanged(callback: (shape: OscillatorType) => void) {
    this._handleWaveShapeChanged = callback;
    callback(this._waveShape);
  }
  
  public onOctaveChanged(callback: (octave: number) => void) {
    this._handleOctaveChanged = callback;
    callback(this._baseOctave);
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
