import { NoteString, Note } from './note';

export class NoteGenerator {
  private _scale: NoteString[];
  private _octaveRange: number[];

  constructor(scale: NoteString[], octaveRange: number[] = [1, 2]) {
    if (!scale || !scale.length) {
      console.error('No notes in scale.');
    }

    this._scale = scale;
    this._octaveRange = octaveRange;
  }
  
  public random() {
    return this.fromXY(Math.random(), Math.random());
  }
  
  public fromXY(x: number, y: number) {
    const noteIndex = Math.round(x * (this._scale.length - 1));
  
    const note = this._scale[noteIndex];
    const octaveSpan = this._octaveRange[1] - this._octaveRange[0];
    const octave = Math.round((1 - y) * octaveSpan + this._octaveRange[0]);
    
    return new Note(note, octave);
  }
}
