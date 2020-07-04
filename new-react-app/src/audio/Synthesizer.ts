import Octavian from "octavian";
import { Oscillator } from "./Oscillator";
import { AudioBus } from "./AudioBus";
import { NoteGenerator } from "./NoteGenerator";
import { Note } from "./Note";

export class Synthesizer {
  private _context: AudioContext;
  private _polyphonic: boolean;
  private _waveShape: OscillatorType;
  private _oscillators: { [frequency: string]: Oscillator };
  private _baseOctave: number;
  private _audioBus: AudioBus;
  private _autoPlayNoteGenerator: NoteGenerator | null;
  private _autoPlayBpm: number;
  private _autoPlayTimeout?: NodeJS.Timer;
  private _lastNote: Note | null;
  private _lastFrequency: number | null;
  private _handleToggleAutoPlay?: (on: boolean) => void;
  private _handleOctaveChanged?: (octave: number) => void;
  private _handleWaveShapeChanged?: (shape: OscillatorType) => void;
  private _handlePlayNote?: (note: Note) => void;
  private _handleReleaseNote?: (note: Note) => void;
  private _handlePlayFrequency?: (freq: number) => void;
  private _handleReleaseFrequency?: (freq: number) => void;

  public constructor(
    context: AudioContext,
    polyphonic = true,
    waveShape: OscillatorType = "sine",
    destination = context.destination,
  ) {
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

  public get audioBus(): AudioBus {
    return this._audioBus;
  }

  public toggleAutoPlay(on: boolean): void {
    if (on) {
      this._startAutoPlay();
    } else {
      this._stopAutoPlay();
    }

    if (this._handleToggleAutoPlay) {
      this._handleToggleAutoPlay(!!this._autoPlayTimeout);
    }
  }

  public setAutoPlayNoteGenerator(noteGenerator: NoteGenerator): void {
    this._autoPlayNoteGenerator = noteGenerator;
  }

  public setAutoPlayBpm(bpm: number): void {
    this._autoPlayBpm = bpm;
    if (this._autoPlayTimeout) {
      this._stopAutoPlay();
      this._startAutoPlay();
    }
  }

  public setOctave(direction: "up" | "down"): void {
    if (direction === "up" && this._baseOctave < 6) {
      this._baseOctave += 1;
    } else if (direction === "down" && this._baseOctave > 1) {
      this._baseOctave -= 1;
    }

    if (this._handleOctaveChanged) {
      this._handleOctaveChanged(this._baseOctave);
    }
  }

  public setWaveShape(shape: OscillatorType): void {
    this._waveShape = shape;

    if (this._handleWaveShapeChanged) {
      this._handleWaveShapeChanged(shape);
    }
  }

  public playNote(note: Note): void {
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

  public releaseNote(note: Note): void {
    const octave = this._baseOctave + note.octave;
    this._oscillatorForNoteString(`${note.note}${octave}`).stop();

    if (this._handleReleaseNote) {
      this._handleReleaseNote(note);
    }
  }

  public playFrequency(freq: number): void {
    if (!this._polyphonic && this._lastFrequency) {
      this.releaseFrequency(this._lastFrequency);
    }

    this._oscillatorForFrequency(freq).start();

    this._lastFrequency = freq;

    if (this._handlePlayFrequency) {
      this._handlePlayFrequency(freq);
    }
  }

  public releaseFrequency(freq: number): void {
    this._oscillatorForFrequency(freq).stop();

    if (this._handleReleaseFrequency) {
      this._handleReleaseFrequency(freq);
    }
  }

  public releaseAll(): void {
    Object.keys(this._oscillators).forEach((freq) => {
      this._oscillators[freq].stop();
    });
  }

  public onPlayNote(callback: (note: Note) => void): void {
    this._handlePlayNote = callback;
  }

  public onReleaseNote(callback: (note: Note) => void): void {
    this._handleReleaseNote = callback;
  }

  public onPlayFrequency(callback: (freq: number) => void): void {
    this._handlePlayFrequency = callback;
  }

  public onReleaseFrequency(callback: (freq: number) => void): void {
    this._handleReleaseFrequency = callback;
  }

  public onToggleAutoPlay(callback: (on: boolean) => void): void {
    this._handleToggleAutoPlay = callback;
    callback(!!this._autoPlayTimeout);
  }

  public onWaveShapeChanged(callback: (shape: OscillatorType) => void): void {
    this._handleWaveShapeChanged = callback;
    callback(this._waveShape);
  }

  public onOctaveChanged(callback: (octave: number) => void): void {
    this._handleOctaveChanged = callback;
    callback(this._baseOctave);
  }

  private _stopAutoPlay() {
    if (this._autoPlayTimeout) {
      clearInterval(this._autoPlayTimeout);
      this._autoPlayTimeout = undefined;
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
        } else if (this._lastNote) {
          this.releaseNote(this._lastNote);
        }
      }
    }, interval);
  }

  private _oscillatorForNoteString(noteOctaveString: string) {
    const frequency = new Octavian.Note(noteOctaveString).frequency;
    return this._oscillatorForFrequency(frequency);
  }

  private _oscillatorForFrequency(frequency: number) {
    const frequencyKey = String(frequency);
    if (!this._oscillators[frequencyKey]) {
      this._oscillators[frequencyKey] = new Oscillator(
        this._context,
        frequency,
        this._audioBus.input,
      );
    }

    this._oscillators[frequencyKey].setType(this._waveShape);

    return this._oscillators[frequencyKey];
  }
}
