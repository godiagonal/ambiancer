import {
  Checkbox,
  FormControl,
  Input,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
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
});

type AudioSettingsProps = {
  autoPlay: boolean,
  ambience: number,
  bpm: number,
  notes: Note[],
  toggleAutoPlay: (playing: boolean) => any,
  updateAmbience: (ambience: number) => any,
  updateBpm: (bpm: number) => any,
  selectNotes: (notes: Note[]) => any,
}

type PropsWithStyles = AudioSettingsProps & WithStyles<'root' | 'button' | 'formControl'>;

const mapStateToProps = (state: RootState) => ({
  autoPlay: synthSelectors.getAutoPlay(state.synth),
  ambience: synthSelectors.getAmbience(state.synth),
  bpm: synthSelectors.getBpm(state.synth),
  notes: synthSelectors.getNotes(state.synth),
});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({
  toggleAutoPlay: synthActions.toggleAutoPlay,
  updateAmbience: synthActions.updateAmbience,
  updateBpm: synthActions.updateBpm,
  selectNotes: synthActions.selectNotes,
}, dispatch);

export const AudioSettings: React.SFC<PropsWithStyles> = (props: PropsWithStyles) => {
  const {
    classes, 
    autoPlay,
    ambience,
    bpm,
    notes,
    toggleAutoPlay,
    updateAmbience,
    updateBpm,
    selectNotes,
  } = props;

  const notesErrorText = 'Select notes';

  const handleBpmChange = (e: any, value: number) => updateBpm(value ? value : 0);
  const handleAmbienceChange = (e: any, value: number) => updateAmbience(value ? value : 0);
  const handleNotesChange = (e: any) => {
    selectNotes(e.target.value.filter((value: string) => value !== notesErrorText));
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
        <InputLabel htmlFor="notes">Notes</InputLabel>
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
    </div>
  );
};

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(AudioSettings));
