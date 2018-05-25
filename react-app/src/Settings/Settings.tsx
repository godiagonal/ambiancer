/* tslint:disable:no-console */

import {
  Button,
  TextField,
  Typography,
} from '@material-ui/core';
import {
  StyleRulesCallback,
  Theme,
  withStyles,
  WithStyles,
  WithTheme,
} from '@material-ui/core/styles';
import * as React from 'react';

const styles: StyleRulesCallback = (theme: Theme) => ({
  root: {
    padding: theme.spacing.unit * 2,
  },
});

type State = {
  
}

type Props = {
  autoPlay: boolean,
  bpm: number,
  onAutoPlayToggled: () => void,
  onBpmChanged: (bpm: number) => void,
}

type PropsWithStyles = Props & WithStyles<'root'> & WithTheme;

class BottomDrawer extends React.Component<PropsWithStyles, State> {
  constructor(props: PropsWithStyles) {
    super(props);

    this.state = {
      
    };
  }

  handleAutoPlayToggle = () => {
    this.props.onAutoPlayToggled();
  }

  handleBpmChange = (e: any) => {
    const value: number = e.target.value ? parseInt(e.target.value, undefined) : 0;
    this.props.onBpmChanged(value);
  }

  render() {
    const { classes, autoPlay, bpm } = this.props;

    return (
      <div className={classes.root}>
        <Button
          variant="raised"
          color="primary"
          onClick={this.handleAutoPlayToggle}
        >
          Toggle auto play
          {autoPlay ? ' (On)' : ''}
        </Button>
        <TextField
          id="bpm"
          label="BPM"
          value={bpm}
          onChange={this.handleBpmChange}
          margin="normal"
          type="number"
        />
        <Typography>
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
  }
}

export default withStyles(styles, { withTheme: true })<Props>(BottomDrawer);
