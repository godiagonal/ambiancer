export type Note = 'A' | 'A#' | 'B' | 'C' | 'C#' | 'D' | 'D#' | 'E' | 'F' | 'F#' | 'G' | 'G#';

export type SynthState = Readonly<{
  audioSettingsOpen: boolean;
  autoPlay: boolean;
  ambience: number;
  bpm: number;
  notes: Note[];
}>;
