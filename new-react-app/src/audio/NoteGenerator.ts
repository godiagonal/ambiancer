import { NoteString, Note } from "./Note";

export type OctaveRange = {
  min: number;
  max: number;
};

export class NoteGenerator {
  private _scale: NoteString[];
  private _octaveRange: OctaveRange;

  public constructor(
    scale: NoteString[],
    octaveRange: OctaveRange = { min: 1, max: 2 },
  ) {
    this._scale = scale;
    this._octaveRange = octaveRange;
  }

  public random(): Note | null {
    return this.fromXY(Math.random(), Math.random());
  }

  public fromXY(x: number, y: number): Note | null {
    if (!this._scale.length) {
      return null;
    }

    const noteIndex = Math.round(x * (this._scale.length - 1));
    const note = this._scale[noteIndex];

    const octaveSpan = this._octaveRange.max - this._octaveRange.min;
    const octave = Math.round((1 - y) * octaveSpan + this._octaveRange.min);

    return new Note(note, octave);
  }
}
