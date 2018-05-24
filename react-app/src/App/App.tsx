import {
  AppBar,
  Toolbar,
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
    paddingTop: theme.spacing.unit * 20,
    textAlign: 'center',
  },
});

class App extends React.Component<WithStyles<'root'>> {
  render() {
    return (
      <div className={this.props.classes.root}>
        <AppBar color="default">
          <Toolbar>
            <Typography variant="title" color="inherit">
              Title
            </Typography>
          </Toolbar>
        </AppBar>
        <BottomDrawer openHeight={500} closedHeight={50}>
          This is injected content!
          <br /> This is injected content!
          <br /> This is injected content!
          <br /> This is injected content!
          <br /> This is injected content!
          <br /> This is injected content!
          <br /> This is injected content!
          <br /> This is injected content!
        </BottomDrawer>
      </div>
    );
  }
}

export default withRoot(withStyles(styles)<{}>(App));