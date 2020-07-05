import React, { useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Checkbox,
  FormControl,
  Input,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  TextField,
  makeStyles,
  Slider,
} from "@material-ui/core";
import { debounce } from "ts-debounce";
import { NoteString, noteStrings, isNoteString } from "../audio";
import { PlayButton } from "../components";
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
const notesErrorText = "Select notes";

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
      <PlayButton
        className={classes.button}
        fullWidth
        playing={autoPlay}
        togglePlaying={toggleAutoPlay}
      >
        Auto play
      </PlayButton>
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
        BPM
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
        <InputLabel htmlFor="notes">Notes</InputLabel>
        <Select
          multiple
          fullWidth
          error={notes.length === 0}
          value={notes.length > 0 ? notes : [notesErrorText]}
          input={<Input id="notes" />}
          onChange={(e) =>
            setNotes((e.target.value as string[]).filter(isNoteString))
          }
          renderValue={(values) => (values as string[]).join(", ")}
        >
          {noteStrings.map((note) => (
            <MenuItem key={note} value={note}>
              <Checkbox color="primary" checked={notes.indexOf(note) > -1} />
              <ListItemText primary={note} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl className={classes.formControl} fullWidth>
        <InputLabel htmlFor="octave-from" shrink>
          Octave range
        </InputLabel>
        <div className={classes.rangeContainer}>
          <div className={classes.rangeFrom}>
            <TextField
              fullWidth
              label=" "
              type="number"
              value={octaveMin}
              onChange={(e) => {
                let value = Number(e.target.value);
                if (value < octaveMinMin) {
                  value = octaveMinMin;
                } else if (value > octaveMax) {
                  value = octaveMax;
                }
                setOctaveMin(value);
              }}
              inputProps={{ min: octaveMinMin, max: octaveMax, step: 1 }}
            />
          </div>
          <div className={classes.rangeSeparator}>-</div>
          <div className={classes.rangeTo}>
            <TextField
              fullWidth
              label=" "
              type="number"
              value={octaveMax}
              onChange={(e) => {
                let value = Number(e.target.value);
                if (value < octaveMin) {
                  value = octaveMin;
                } else if (value > octaveMaxMax) {
                  value = octaveMaxMax;
                }
                setOctaveMax(value);
              }}
              inputProps={{ min: octaveMin, max: octaveMaxMax, step: 1 }}
            />
          </div>
        </div>
      </FormControl>
    </div>
  );
};
