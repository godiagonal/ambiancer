export const noteStrings = [
  "A",
  "A#",
  "B",
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
] as const;

export const isNoteString = (value: string): value is NoteString =>
  noteStrings.some((v) => v === value);

export type NoteString = typeof noteStrings[number];

export class Note {
  public constructor(
    public readonly note: NoteString,
    public readonly octave: number,
  ) {}
}
