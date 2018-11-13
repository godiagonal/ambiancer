import {
  Checkbox,
  FormControl,
  Input,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  TextField,
} from '@material-ui/core';
import {
  StyleRulesCallback,
  Theme,
  withStyles,
  WithStyles,
} from '@material-ui/core/styles';

import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { NoteString } from 'src/audio';

import { CustomSlider, PlayButton } from '../../../components';
import { RootState } from '../../../store';
import { synthActions, synthSelectors } from '..';

const styles: StyleRulesCallback = (theme: Theme) => ({
  root: {
    padding: theme.spacing.unit * 2,
  },
  button: {
    marginBottom: theme.spacing.unit * 3,
  },
  formControl: {
    marginBottom: theme.spacing.unit * 2,
  },
  rangeContainer: {
    display: 'flex',
    alignItems: 'flex-end',
  },
  rangeFrom: {
    flex: '1 1 calc(100% - 15px)',
    minWidth: 0,
  },
  rangeTo: {
    flex: '1 1 calc(100% - 15px)',
    minWidth: 0,
  },
  rangeSeparator: {
    flex: '0 0 30px',
    minWidth: 0,
    paddingBottom: 8,
    textAlign: 'center',
  },
});

type AudioSettingsProps = {
  autoPlay: boolean,
  ambience: number,
  bpm: number,
  notes: NoteString[],
  octaveMin: number,
  octaveMax: number,
  toggleAutoPlay: (playing: boolean) => any,
  updateAmbience: (ambience: number) => any,
  updateBpm: (bpm: number) => any,
  selectNotes: (notes: NoteString[]) => any,
  updateOctaveMin: (octave: number) => any,
  updateOctaveMax: (octave: number) => any,
}

type CssClasses = 'root' | 'button' | 'formControl' | 'rangeContainer' | 'rangeFrom' | 'rangeTo' | 'rangeSeparator';
type PropsWithStyles = AudioSettingsProps & WithStyles<CssClasses>;

const mapStateToProps = (state: RootState) => ({
  autoPlay: synthSelectors.getAutoPlay(state.synth),
  ambience: synthSelectors.getAmbience(state.synth),
  bpm: synthSelectors.getBpm(state.synth),
  notes: synthSelectors.getNotes(state.synth),
  octaveMin: synthSelectors.getOctaveMin(state.synth),
  octaveMax: synthSelectors.getOctaveMax(state.synth),
});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({
  toggleAutoPlay: synthActions.toggleAutoPlay,
  updateAmbience: synthActions.updateAmbience,
  updateBpm: synthActions.updateBpm,
  selectNotes: synthActions.selectNotes,
  updateOctaveMin: synthActions.updateOctaveMin,
  updateOctaveMax: synthActions.updateOctaveMax,
}, dispatch);

type State = {
  ambience: number,
  bpm: number,
};

class AudioSettings extends React.Component<PropsWithStyles, State> {
  private allNotes: NoteString[] = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#']
  private notesErrorText: string = 'Select notes';
  private octaveMinMin = 1;
  private octaveMaxMax = 7;

  constructor(props: PropsWithStyles) {
    super(props);

    this.state = {
      ambience: props.ambience || 0,
      bpm: props.bpm || 0,
    };

    this.renderNotesValue = this.renderNotesValue.bind(this);
    this.handleAmbienceChange = this.handleAmbienceChange.bind(this);
    this.handleAmbienceChangeEnd = this.handleAmbienceChangeEnd.bind(this);
    this.handleBpmChange = this.handleBpmChange.bind(this);
    this.handleBpmChangeEnd = this.handleBpmChangeEnd.bind(this);
    this.handleNotesChange = this.handleNotesChange.bind(this);
    this.handleOctaveMinChange = this.handleOctaveMinChange.bind(this);
    this.handleOctaveMaxChange = this.handleOctaveMaxChange.bind(this);
  }

  static getDerivedStateFromProps(nextProps: PropsWithStyles, prevState: State) {
    const state: Partial<State> = {};
    if (nextProps.ambience !== prevState.ambience) {
      state.ambience = nextProps.ambience;
    }
    if (nextProps.bpm !== prevState.bpm) {
      state.bpm = nextProps.bpm;
    }
    return state;
  }

  render() {
    const {
      classes, 
      autoPlay,
      notes,
      octaveMin,
      octaveMax,
      toggleAutoPlay,
    } = this.props;
    const {
      ambience,
      bpm,
    } = this.state;

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
          <CustomSlider
            label="Ambience"
            value={ambience}
            onChange={this.handleAmbienceChange}
            onDragEnd={this.handleAmbienceChangeEnd}
            step={1}
            min={0}
            max={100}
          />
        </FormControl>
        <FormControl className={classes.formControl} fullWidth>
          <CustomSlider
            label="BPM"
            value={bpm}
            onChange={this.handleBpmChange}
            onDragEnd={this.handleBpmChangeEnd}
            step={1}
            min={60}
            max={300}
          />
        </FormControl>
        <FormControl className={classes.formControl} fullWidth>
          <InputLabel htmlFor="notes">
            Notes
          </InputLabel>
          <Select
            multiple
            fullWidth
            error={notes.length === 0}
            value={notes.length > 0 ? notes : [this.notesErrorText]}
            input={<Input id="notes" />}
            onChange={this.handleNotesChange}
            renderValue={this.renderNotesValue}
          >
            {this.allNotes.map(note => (
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

  private renderNotesValue(selected: NoteString[]) {
    return selected.join(', ');
  }

  private handleAmbienceChange(e: any, value: number) {
    this.setState({ ambience: value });
  }

  private handleAmbienceChangeEnd(e: any) {
    const { updateAmbience } = this.props;
    const { ambience } = this.state;
    updateAmbience(ambience ? ambience : 0);
  }

  private handleBpmChange(e: any, value: number) {
    this.setState({ bpm: value });
  }

  private handleBpmChangeEnd(e: any) {
    const { updateBpm } = this.props;
    const { bpm } = this.state;
    updateBpm(bpm ? bpm : 0);
  }

  private handleNotesChange(e: any) {
    const { selectNotes } = this.props;
    selectNotes(e.target.value.filter((value: string) => value !== this.notesErrorText));
  }

  private handleOctaveMinChange(e: any) {
    const { updateOctaveMin, octaveMax } = this.props;
    let value = Number(e.target.value);
    if (value < this.octaveMinMin) { value = this.octaveMinMin }
    else if (value > octaveMax) { value = octaveMax }
    updateOctaveMin(value);
  }

  private handleOctaveMaxChange(e: any) {
    const { updateOctaveMax, octaveMin } = this.props;
    let value = Number(e.target.value);
    if (value < octaveMin) { value = octaveMin }
    else if (value > this.octaveMaxMax) { value = this.octaveMaxMax }
    updateOctaveMax(value);
  }
}

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(AudioSettings));
