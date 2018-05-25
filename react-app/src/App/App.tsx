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
import BottomDrawer from '../BottomDrawer/BottomDrawer';
import PlayButton from '../PlayButton/PlayButton';
import Settings from '../Settings/Settings';
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
});

type Styles = WithStyles<'root' | 'drawerPaper' | 'content'>;

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

  onBottomDrawerOpenStateChanged = (open: boolean, height: number) => {
    this.setState({
      bottomDrawerOpen: open,
      bottomDrawerHeight: height,
    });
  }

  onAutoPlayToggled = () => {
    this.setState({ autoPlay: !this.state.autoPlay });
  }

  handleAutoPlayToggle = () => {
    this.setState({ autoPlay: !this.state.autoPlay });
  }

  onBpmChanged = (bpm: number) => {
    this.setState({ bpm });
  }

  render() {
    const { classes } = this.props;
    const { autoPlay, bpm, bottomDrawerOpen } = this.state;

    const settings = (
      <Settings
        bpm={bpm}
        autoPlay={autoPlay}
        onAutoPlayToggled={this.onAutoPlayToggled}
        onBpmChanged={this.onBpmChanged}
      />
    );

    return (
      <div className={classes.root}>
        <Hidden mdUp>
          <BottomDrawer
            closedHeight={100}
            open={bottomDrawerOpen}
            onOpenStateChanged={this.onBottomDrawerOpenStateChanged}
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
          <PlayButton
            playing={autoPlay}
            onClick={this.onAutoPlayToggled}>
            Auto play
          </PlayButton>
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