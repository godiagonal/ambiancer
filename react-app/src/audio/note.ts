export type NoteString = 'A' | 'A#' | 'B' | 'C' | 'C#' | 'D' | 'D#' | 'E' | 'F' | 'F#' | 'G' | 'G#';

export class Note {
  note: NoteString;
  octave: number;

  constructor(note: NoteString, octave: number) {
    this.note = note;
    this.octave = octave;
  }
}
