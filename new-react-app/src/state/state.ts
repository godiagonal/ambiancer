import { NoteString } from "../audio";

declare module "react-redux" {
  function useSelector<TState = RootState, TSelected = unknown>(
    selector: (state: TState) => TSelected,
    equalityFn?: (left: TSelected, right: TSelected) => boolean,
  ): TSelected;
}

export type RootState = Readonly<{
  audioSettingsOpen: boolean;
  audioSettingsHeight: number;
  autoPlay: boolean;
  ambience: number;
  bpm: number;
  notes: NoteString[];
  octaveMin: number;
  octaveMax: number;
  touchPosition: [number, number] | null;
}>;
