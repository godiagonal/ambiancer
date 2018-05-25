/* tslint:disable:no-console */

import {
  Drawer,
  Hidden,
  TextField,
  Typography,
} from '@material-ui/core';
import {
  StyleRulesCallback,
  Theme,
  withStyles,
  WithStyles,
} from '@material-ui/core/styles';
import * as React from 'react';
import BottomDrawer from '../BottomDrawer/BottomDrawer';
import PlayButton from '../PlayButton/PlayButton';
import withRoot from '../withRoot';

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
  settings: {
    padding: theme.spacing.unit * 2,
  },
  block: {
    width: '100%',
  },
});

type Styles = WithStyles<'root' | 'drawerPaper' | 'content' | 'settings' | 'block'>;

class App extends React.Component<Styles, any> {

  constructor(props: WithStyles<'root'>) {
    super(props);

    this.state = {
      autoPlay: false,
      bottomDrawerOpen: false,
      bottomDrawerHeight: false,
      bpm: 120,
    };
  }

  componentDidUpdate(prevProps: Styles, prevState: any) {
    console.log('componentDidUpdate', prevState, this.state);
  }

  handleBottomDrawerOpenStateChanged = (open: boolean, height: number) => {
    this.setState({
      bottomDrawerOpen: open,
      bottomDrawerHeight: height,
    });
  }

  handleAutoPlayToggle = () => {
    this.setState({ autoPlay: !this.state.autoPlay });
  }

  handleBpmChange = (e: any) => {
    const bpm = e.target.value ? parseInt(e.target.value, undefined) : 0;
    this.setState({ bpm });
  }

  render() {
    const { classes } = this.props;
    const { autoPlay, bpm, bottomDrawerOpen } = this.state;

    const settings = (
      <div className={classes.settings}>
        <PlayButton
          className={classes.block}
          playing={autoPlay}
          onClick={this.handleAutoPlayToggle}>
          Auto play
        </PlayButton>
        <TextField
          className={classes.block}
          id="bpm"
          label="BPM"
          value={bpm}
          onChange={this.handleBpmChange}
          margin="normal"
          type="number"
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

    return (
      <div className={classes.root}>
        <Hidden mdUp>
          <BottomDrawer
            closedHeight={100}
            open={bottomDrawerOpen}
            onOpenStateChanged={this.handleBottomDrawerOpenStateChanged}
          >
            {settings}
          </BottomDrawer>
        </Hidden>
        <Hidden smDown>
          <Drawer
            variant="permanent"
            open
            classes={{
              paper: classes.drawerPaper,
            }}
          >
            {settings}
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

export default withRoot(withStyles(styles)<{}>(App));