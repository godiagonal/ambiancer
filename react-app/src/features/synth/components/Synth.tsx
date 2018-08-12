/* tslint:disable:no-console */
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

import { synthSelectors } from '../';
import { BottomDrawer } from '../../../components';
import { RootState } from '../../../store';
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
  block: {
    width: '100%',
  },
});

type SynthProps = {
  autoPlay: boolean,
  bottomDrawerOpen: false,
  bottomDrawerHeight: number,
}

type PropsWithStyles = SynthProps & WithStyles<'root' | 'drawerPaper' | 'content' | 'block'>;

const mapStateToProps = (state: RootState) => ({
  autoPlay: synthSelectors.getAutoPlay(state.synth),
});

// TODO: make into SFC by moving bottomDrawer logic to redux flow

export class Synth extends React.Component<PropsWithStyles, any> {
  constructor(props: PropsWithStyles) {
    super(props);

    this.state = {
      bottomDrawerOpen: false,
      bottomDrawerHeight: 0,
    };
  }

  handleBottomDrawerOpenStateChanged = (open: boolean, height: number) => {
    this.setState({
      bottomDrawerOpen: open,
      bottomDrawerHeight: height,
    });
  }

  render() {
    const { classes } = this.props;
    const { bottomDrawerOpen } = this.state;

    return (
      <div className={classes.root}>
        <Hidden smUp>
          <BottomDrawer
            closedHeight={150}
            open={bottomDrawerOpen}
            onOpenStateChanged={this.handleBottomDrawerOpenStateChanged}
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
            <br /><br /> {bottomDrawerOpen ? 'Open' : 'Closed'}
          </Typography>
        </main>
      </div>
    );
  }
}

export default withStyles(styles)(connect(mapStateToProps)(Synth));
