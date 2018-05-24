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
  options: {
    padding: theme.spacing.unit * 2,
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3,
  },
});

type Styles = WithStyles<'root' | 'drawerPaper' | 'options' | 'content'>;

class App extends React.Component<Styles, any> {

  constructor(props: WithStyles<'root'>) {
    super(props);

    this.state = {
      moreContent: false,
    };
  }

  changeContent = () => {
    this.setState({ moreContent: !this.state.moreContent });
  }

  render() {
    const { classes } = this.props;

    const options = (
      <div className={classes.options}>
        <Typography>
          <button onClick={this.changeContent}>Show more content</button>
          <br /> {this.state.moreContent ? 'This is mooooooooooooooooooooooooooo oooooooooooooooooooooooooooo oooooooooooooooooooooore' : ''}
          <br /> This is injected content!
          <br /> This is injected content!
          <br /> This is injected content!
          <br /> This is injected content!
          <br /> This is injected content!
          <br /> This is injected content!
          <br /> This is injected content!
          <br /> This is injected content!
          <br /> This is injected content!
          <br /> This is injected content!
          <br /> This is injected content!
          <br /> This is injected content!
          <br /> This is injected content!
          <br /> This is injected content!
          <br /> This is injected content!
        </Typography>
      </div>
    );

    return (
      <div className={classes.root}>
        <Hidden mdUp>
          <BottomDrawer closedHeight={100}>
            {options}
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
            {options}
          </Drawer>
        </Hidden>
        <main className={classes.content}>
          <Typography>
            You think water moves fast? You should see ice.
          </Typography>
        </main>
      </div>
    );
  }
}

export default withRoot(withStyles(styles)<{}>(App));