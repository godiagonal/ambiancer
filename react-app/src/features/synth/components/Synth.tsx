import {
  Drawer,
  Hidden,
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

import { BottomDrawer } from '../../../components';
import { RootState } from '../../../store';
import { synthActions, synthSelectors } from '..';
import AudioSettings from './AudioSettings';

const styles: StyleRulesCallback = (theme: Theme) => ({
  root: {
    flexGrow: 1,
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
    width: '100%',
  },
  drawerPaper: {
    width: 240,
    position: 'relative',
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3,
  },
});

type SynthProps = {
  audioSettingsOpen: boolean,
  toggleAudioSettings: (open: boolean) => any,
}

type PropsWithStyles = SynthProps & WithStyles<'root' | 'drawerPaper' | 'content'>;

const mapStateToProps = (state: RootState) => ({
  audioSettingsOpen: synthSelectors.getAudioSettingsOpen(state.synth),
});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({
  toggleAudioSettings: synthActions.toggleAudioSettings,
}, dispatch);

export const Synth: React.SFC<PropsWithStyles> = (props: PropsWithStyles) => {
  const {
    classes,
    audioSettingsOpen,
    toggleAudioSettings,
  } = props;

  const handleAudioSettingsToggle = (open: boolean) => toggleAudioSettings(open);

  return (
    <div className={classes.root}>
      <Hidden smUp>
        <BottomDrawer
          closedHeight={140}
          open={audioSettingsOpen}
          onOpenStateChanged={handleAudioSettingsToggle}
        >
          <AudioSettings />
        </BottomDrawer>
      </Hidden>
      <Hidden xsDown>
        <Drawer
          variant="permanent"
          open
          classes={{
            paper: classes.drawerPaper,
          }}
        >
          <AudioSettings />
        </Drawer>
      </Hidden>
      <main className={classes.content}>
        <Typography>
          You think water moves fast? You should see ice.
          <br /><br /> {audioSettingsOpen ? 'Open' : 'Closed'}
        </Typography>
      </main>
    </div>
  );
}

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Synth));
