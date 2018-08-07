import {
  Typography,
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

import { synthActions, synthSelectors } from '../';

const styles: StyleRulesCallback = (theme: Theme) => ({
  root: {
    padding: theme.spacing.unit * 2,
  },
  block: {
    width: '100%',
  },
});

type AudioSettingsProps = {
  autoPlay: boolean,
  bpm: number,
  toggleAutoPlay: () => any,
  updateBpm: (bpm: number) => any,
}

type PropsWithStyles = AudioSettingsProps & WithStyles<'root' | 'block'>;

export const AudioSettings: React.SFC<PropsWithStyles> = (props: PropsWithStyles) => {
  const {
    classes, 
    autoPlay,
    bpm,
    toggleAutoPlay,
    updateBpm,
  } = props;

  const handleBpmChange = (e: any, newValue: number) => {
    updateBpm(newValue ? newValue : 0);
  };

  return (
    <div className={classes.root}>
      <PlayButton
        className={classes.block}
        playing={autoPlay}
        onClick={toggleAutoPlay}>
        Auto play
      </PlayButton>
      <CustomSlider
        label="BPM"
        value={bpm}
        onChange={handleBpmChange}
        step={1}
        min={60}
        max={300}
      />
      <Typography>
        You think water moves fast? You should see ice.
        <br />You think water moves fast? You should see ice.
        <br />You think water moves fast? You should see ice.
        <br />You think water moves fast? You should see ice.
        <br />You think water moves fast? You should see ice.
        <br />You think water moves fast? You should see ice.
      </Typography>
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  autoPlay: synthSelectors.getAutoPlay(state.synth),
  bpm: synthSelectors.getBpm(state.synth),
});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({
  toggleAutoPlay: synthActions.toggleAutoPlay,
  updateBpm: synthActions.updateBpm,
}, dispatch);

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(AudioSettings));
