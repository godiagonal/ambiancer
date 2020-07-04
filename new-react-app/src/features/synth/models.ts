import { NoteString } from "../../audio";

export type SynthState = Readonly<{
  audioSettingsOpen: boolean;
  autoPlay: boolean;
  ambience: number;
  bpm: number;
  notes: NoteString[];
  octaveMin: number;
  octaveMax: number;
}>;
