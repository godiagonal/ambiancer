import React, { useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FormControl, makeStyles, Slider } from "@material-ui/core";
import { Pause, PlayArrow } from "@material-ui/icons";
import { debounce } from "ts-debounce";
import { NoteString, noteStrings, isNoteString } from "../audio";
import { GridSelect, ToggleButton } from "../components";
import { rootActions } from "../state";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
  button: {
    marginBottom: theme.spacing(3),
  },
  formControl: {
    marginBottom: theme.spacing(2),
  },
  rangeContainer: {
    display: "flex",
    alignItems: "flex-end",
  },
  rangeFrom: {
    flex: "1 1 calc(100% - 15px)",
    minWidth: 0,
  },
  rangeTo: {
    flex: "1 1 calc(100% - 15px)",
    minWidth: 0,
  },
  rangeSeparator: {
    flex: "0 0 30px",
    minWidth: 0,
    paddingBottom: 8,
    textAlign: "center",
  },
}));

const octaveMinMin = 1;
const octaveMaxMax = 7;

export const AudioSettings: React.FC = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  // Auto play
  const autoPlay = useSelector((state) => state.autoPlay);
  const toggleAutoPlay = useCallback(
    (value: boolean) => dispatch(rootActions.toggleAutoPlay(value)),
    [dispatch],
  );

  // Notes
  const notes = useSelector((state) => state.notes);
  const setNotes = useCallback(
    (value: NoteString[]) => dispatch(rootActions.setNotes(value)),
    [dispatch],
  );

  // Octave min
  const octaveMin = useSelector((state) => state.octaveMin);
  const setOctaveMin = useCallback(
    (value: number) => dispatch(rootActions.setOctaveMin(value)),
    [dispatch],
  );

  // Octave max
  const octaveMax = useSelector((state) => state.octaveMax);
  const setOctaveMax = useCallback(
    (value: number) => dispatch(rootActions.setOctaveMax(value)),
    [dispatch],
  );

  // Ambience - Has internal state to debounce root state changes
  const ambience = useSelector((state) => state.ambience);
  const [ambienceInternal, setAmbienceInternal] = useState(ambience);
  const setAmbience = useCallback(
    (value: number) => dispatch(rootActions.setAmbience(value)),
    [dispatch],
  );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSetAmbience = useCallback(
    debounce((value) => setAmbience(value), 200),
    [setAmbience],
  );
  useEffect(() => debouncedSetAmbience(ambienceInternal), [
    ambienceInternal,
    debouncedSetAmbience,
  ]);

  // BPM - Has internal state to debounce root state changes
  const bpm = useSelector((state) => state.bpm);
  const [bpmInternal, setBpmInternal] = useState(bpm);
  const setBpm = useCallback(
    (value: number) => dispatch(rootActions.setBpm(value)),
    [dispatch],
  );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSetBpm = useCallback(
    debounce((value) => setBpm(value), 200),
    [setBpm],
  );
  useEffect(() => debouncedSetBpm(bpmInternal), [bpmInternal, debouncedSetBpm]);

  return (
    <div className={classes.root}>
      <ToggleButton
        className={classes.button}
        fullWidth
        color="primary"
        icons={[<Pause key="pause" />, <PlayArrow key="play" />]}
        value={autoPlay}
        onChange={toggleAutoPlay}
      >
        {autoPlay ? "Pause" : "Play"}
      </ToggleButton>
      <FormControl className={classes.formControl} fullWidth>
        Ambience
        <Slider
          value={ambienceInternal}
          onChange={(_, value) => setAmbienceInternal(value as number)}
          valueLabelDisplay="auto"
          step={1}
          min={0}
          max={100}
        />
      </FormControl>
      <FormControl className={classes.formControl} fullWidth>
        Beats Per Minute
        <Slider
          value={bpmInternal}
          onChange={(_, value) => setBpmInternal(value as number)}
          valueLabelDisplay="auto"
          step={1}
          min={60}
          max={300}
        />
      </FormControl>
      <FormControl className={classes.formControl} fullWidth>
        Octave Range
        <Slider
          value={[octaveMin, octaveMax]}
          onChange={(_, values) => {
            if (!Array.isArray(values)) {
              return;
            }
            const [min, max] = values;
            setOctaveMin(min);
            setOctaveMax(max);
          }}
          valueLabelDisplay="auto"
          step={1}
          min={octaveMinMin}
          max={octaveMaxMax}
        />
      </FormControl>
      <FormControl className={classes.formControl} fullWidth>
        Notes
        <GridSelect
          color="primary"
          spacing={1}
          size={{
            xs: 2,
            sm: 3,
          }}
          multiple
          values={noteStrings.map((note) => ({
            value: note,
            label: note,
          }))}
          value={notes}
          onChange={(values) => setNotes(values.filter(isNoteString))}
        />
      </FormControl>
    </div>
  );
};
