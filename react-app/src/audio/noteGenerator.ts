import { NoteString, Note } from './note';

type OctaveRange = {
  start: number,
  end: number,
};

export class NoteGenerator {
  private _scale: NoteString[];
  private _octaveRange: OctaveRange;

  constructor(scale: NoteString[], octaveRange: OctaveRange = {start: 1, end: 2}) {
    if (!scale.length) {
      throw Error('No notes in scale.');
    }

    this._scale = scale;
    this._octaveRange = octaveRange;
  }
  
  random() {
    return this.fromXY(Math.random(), Math.random());
  }
  
  fromXY(x: number, y: number) {
    const noteIndex = Math.round(x * (this._scale.length - 1));
  
    const note = this._scale[noteIndex];
    const octaveSpan = this._octaveRange.end - this._octaveRange.start;
    const octave = Math.round((1 - y) * octaveSpan + this._octaveRange.start);
    
    return new Note(note, octave);
  }
}
