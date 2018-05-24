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

class App extends React.Component<WithStyles<'root'>, any> {

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
    return (
      <div className={this.props.classes.root}>
        <AppBar color="default">
          <Toolbar>
            <Typography variant="title" color="inherit">
              Title
            </Typography>
          </Toolbar>
        </AppBar>
        <BottomDrawer closedHeight={50}>
          <button onClick={this.changeContent}>Show more content</button>
          {this.state.moreContent ? 'This is mooooooooooooooooooooooooooo oooooooooooooooooooooooooooo oooooooooooooooooooooore' : ''}
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
        </BottomDrawer>
      </div>
    );
  }
}

export default withRoot(withStyles(styles)<{}>(App));