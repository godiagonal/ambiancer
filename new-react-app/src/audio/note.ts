export type NoteString =
  | "A"
  | "A#"
  | "B"
  | "C"
  | "C#"
  | "D"
  | "D#"
  | "E"
  | "F"
  | "F#"
  | "G"
  | "G#";

export class Note {
  public constructor(
    public readonly note: NoteString,
    public readonly octave: number,
  ) {}
}
