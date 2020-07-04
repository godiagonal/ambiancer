import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  StyleRulesCallback,
  Checkbox,
  FormControl,
  Input,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  TextField,
  Theme,
  WithStyles,
  withStyles,
  Slider,
} from "@material-ui/core";
import { debounce } from "ts-debounce";
import { NoteString } from "../../../audio";
import { PlayButton } from "../../../components";
import { RootState } from "../../../store";
import { synthActions, synthSelectors } from "..";

const styles: StyleRulesCallback<Theme, any> = (theme) => ({
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
});

type AudioSettingsProps = {
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

type CssClasses =
  | "root"
  | "button"
  | "formControl"
  | "rangeContainer"
  | "rangeFrom"
  | "rangeTo"
  | "rangeSeparator";
type PropsWithStyles = AudioSettingsProps & WithStyles<CssClasses>;

type State = {
  ambience: number;
  bpm: number;
};

class CoreAudioSettings extends React.Component<PropsWithStyles, State> {
  private allNotes: NoteString[] = [
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
  ];
  private notesErrorText = "Select notes";
  private octaveMinMin = 1;
  private octaveMaxMax = 7;

  public constructor(props: PropsWithStyles) {
    super(props);

    this.state = {
      ambience: props.ambience || 0,
      bpm: props.bpm || 0,
    };

    this.renderNotesValue = this.renderNotesValue.bind(this);
    this.handleAmbienceChange = this.handleAmbienceChange.bind(this);
    this.handleBpmChange = this.handleBpmChange.bind(this);
    this.handleNotesChange = this.handleNotesChange.bind(this);
    this.handleOctaveMinChange = this.handleOctaveMinChange.bind(this);
    this.handleOctaveMaxChange = this.handleOctaveMaxChange.bind(this);
  }

  public static getDerivedStateFromProps(
    nextProps: PropsWithStyles,
    prevState: State,
  ) {
    const state: Partial<State> = {};
    if (nextProps.ambience !== prevState.ambience) {
      state.ambience = nextProps.ambience;
    }
    if (nextProps.bpm !== prevState.bpm) {
      state.bpm = nextProps.bpm;
    }
    return state;
  }

  public render() {
    const {
      classes,
      autoPlay,
      notes,
      octaveMin,
      octaveMax,
      toggleAutoPlay,
    } = this.props;
    const { ambience, bpm } = this.state;

    return (
      <div className={classes.root}>
        <PlayButton
          className={classes.button}
          fullWidth
          playing={autoPlay}
          onValueChange={toggleAutoPlay}
        >
          Auto play
        </PlayButton>
        <FormControl className={classes.formControl} fullWidth>
          Ambience
          <Slider
            value={ambience}
            onChange={this.handleAmbienceChange}
            step={1}
            min={0}
            max={100}
          />
        </FormControl>
        <FormControl className={classes.formControl} fullWidth>
          BPM
          <Slider
            value={bpm}
            onChange={this.handleBpmChange}
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
            value={notes.length > 0 ? notes : [this.notesErrorText]}
            input={<Input id="notes" />}
            onChange={this.handleNotesChange}
            renderValue={this.renderNotesValue}
          >
            {this.allNotes.map((note) => (
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
                onChange={this.handleOctaveMinChange}
                inputProps={{ min: this.octaveMinMin, max: octaveMax, step: 1 }}
              />
            </div>
            <div className={classes.rangeSeparator}>-</div>
            <div className={classes.rangeTo}>
              <TextField
                fullWidth
                label=" "
                type="number"
                value={octaveMax}
                onChange={this.handleOctaveMaxChange}
                inputProps={{ min: octaveMin, max: this.octaveMaxMax, step: 1 }}
              />
            </div>
          </div>
        </FormControl>
      </div>
    );
  }

  private renderNotesValue(selected: unknown) {
    return (selected as NoteString[]).join(", ");
  }

  private handleAmbienceChange(e: any, value: number | number[]) {
    this.setState({ ambience: value as number });
    this.handleAmbienceChangeDelayed();
  }

  private handleAmbienceChangeDelayed = debounce(() => {
    const { updateAmbience } = this.props;
    const { ambience } = this.state;
    updateAmbience(ambience ? ambience : 0);
  }, 200);

  private handleBpmChange(e: any, value: number | number[]) {
    this.setState({ bpm: value as number });
    this.handleBpmChangeDelayed();
  }

  private handleBpmChangeDelayed = debounce(() => {
    const { updateBpm } = this.props;
    const { bpm } = this.state;
    updateBpm(bpm ? bpm : 0);
  }, 200);

  private handleNotesChange(e: any) {
    const { selectNotes } = this.props;
    selectNotes(
      e.target.value.filter((value: string) => value !== this.notesErrorText),
    );
  }

  private handleOctaveMinChange(e: any) {
    const { updateOctaveMin, octaveMax } = this.props;
    let value = Number(e.target.value);
    if (value < this.octaveMinMin) {
      value = this.octaveMinMin;
    } else if (value > octaveMax) {
      value = octaveMax;
    }
    updateOctaveMin(value);
  }

  private handleOctaveMaxChange(e: any) {
    const { updateOctaveMax, octaveMin } = this.props;
    let value = Number(e.target.value);
    if (value < octaveMin) {
      value = octaveMin;
    } else if (value > this.octaveMaxMax) {
      value = this.octaveMaxMax;
    }
    updateOctaveMax(value);
  }
}

export const AudioSettings = withStyles(styles)(
  connect(
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
  )(CoreAudioSettings),
);
