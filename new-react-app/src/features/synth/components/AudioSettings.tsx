import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
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
import { NoteString, noteStrings, isNoteString } from "../../../audio";
import { PlayButton } from "../../../components";
import { RootState } from "../../../store";
import { synthActions, synthSelectors } from "..";

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

export type AudioSettingsProps = {
  autoPlay: boolean;
  ambience: number;
  bpm: number;
  notes: NoteString[];
  octaveMin: number;
  octaveMax: number;
  toggleAutoPlay: (playing: boolean) => any;
  updateAmbience: (ambience: number) => any;
  updateBpm: (bpm: number) => any;
  selectNotes: (notes: NoteString[]) => any;
  updateOctaveMin: (octave: number) => any;
  updateOctaveMax: (octave: number) => any;
};

const CoreAudioSettings: React.FC<AudioSettingsProps> = ({
  autoPlay,
  ambience,
  bpm,
  notes,
  octaveMin,
  octaveMax,
  toggleAutoPlay,
  updateAmbience,
  updateBpm,
  selectNotes,
  updateOctaveMin,
  updateOctaveMax,
}) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <PlayButton
        className={classes.button}
        fullWidth
        playing={autoPlay}
        onTogglePlaying={toggleAutoPlay}
      >
        Auto play
      </PlayButton>
      <FormControl className={classes.formControl} fullWidth>
        Ambience
        <Slider
          value={ambience}
          onChange={(_, value) => updateAmbience(value as number)}
          valueLabelDisplay="auto"
          step={1}
          min={0}
          max={100}
        />
      </FormControl>
      <FormControl className={classes.formControl} fullWidth>
        BPM
        <Slider
          value={bpm}
          onChange={(_, value) => updateBpm(value as number)}
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
            selectNotes((e.target.value as string[]).filter(isNoteString))
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
                updateOctaveMin(value);
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
                updateOctaveMax(value);
              }}
              inputProps={{ min: octaveMin, max: octaveMaxMax, step: 1 }}
            />
          </div>
        </div>
      </FormControl>
    </div>
  );
};

export const AudioSettings = connect(
  (state: RootState) => ({
    autoPlay: synthSelectors.getAutoPlay(state.synth),
    ambience: synthSelectors.getAmbience(state.synth),
    bpm: synthSelectors.getBpm(state.synth),
    notes: synthSelectors.getNotes(state.synth),
    octaveMin: synthSelectors.getOctaveMin(state.synth),
    octaveMax: synthSelectors.getOctaveMax(state.synth),
  }),
  (dispatch) =>
    bindActionCreators(
      {
        toggleAutoPlay: synthActions.toggleAutoPlay,
        updateAmbience: synthActions.updateAmbience,
        updateBpm: synthActions.updateBpm,
        selectNotes: synthActions.selectNotes,
        updateOctaveMin: synthActions.updateOctaveMin,
        updateOctaveMax: synthActions.updateOctaveMax,
      },
      dispatch,
    ),
)(CoreAudioSettings);
