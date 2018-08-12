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

import { CustomSlider, PlayButton } from '../../../components';
import { RootState } from '../../../store';
import { Note, synthActions, synthSelectors } from '..';

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
  notes: Note[],
  octaveMin: number,
  octaveMax: number,
  toggleAutoPlay: (playing: boolean) => any,
  updateAmbience: (ambience: number) => any,
  updateBpm: (bpm: number) => any,
  selectNotes: (notes: Note[]) => any,
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

export const AudioSettings: React.SFC<PropsWithStyles> = (props: PropsWithStyles) => {
  const {
    classes, 
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
  } = props;

  const notesErrorText = 'Select notes';
  const octaveMinMin = 1;
  const octaveMaxMax = 7;

  const handleBpmChange = (e: any, value: number) => updateBpm(value ? value : 0);
  const handleAmbienceChange = (e: any, value: number) => updateAmbience(value ? value : 0);
  const handleNotesChange = (e: any) => {
    selectNotes(e.target.value.filter((value: string) => value !== notesErrorText));
  };
  const handleOctaveMinChange = (e: any) => {
    let value = Number(e.target.value);
    if (value < octaveMinMin) { value = octaveMinMin }
    else if (value > octaveMax) { value = octaveMax }
    updateOctaveMin(value);
  };
  const handleOctaveMaxChange = (e: any) => {
    let value = Number(e.target.value);
    if (value < octaveMin) { value = octaveMin }
    else if (value > octaveMaxMax) { value = octaveMaxMax }
    updateOctaveMax(value);
  };

  const allNotes: Note[] = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];
  const renderNotesValue = (selected: Note[]) => selected.join(', ');

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
          onChange={handleAmbienceChange}
          step={1}
          min={0}
          max={100}
        />
      </FormControl>
      <FormControl className={classes.formControl} fullWidth>
        <CustomSlider
          label="BPM"
          value={bpm}
          onChange={handleBpmChange}
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
          value={notes.length > 0 ? notes : [notesErrorText]}
          input={<Input id="notes" />}
          onChange={handleNotesChange}
          renderValue={renderNotesValue}
        >
          {allNotes.map(note => (
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
              onChange={handleOctaveMinChange}
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
              onChange={handleOctaveMaxChange}
              inputProps={{ min: octaveMin, max: octaveMaxMax, step: 1 }}
            />
          </div>
        </div>
      </FormControl>
    </div>
  );
};

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(AudioSettings));
