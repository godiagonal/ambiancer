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
  canvas: {
    height: '100%',
    width: '100%',
  },
});

type SynthProps = {

}

type PropsWithStyles = SynthProps & WithStyles<'canvas'>;

const mapStateToProps = (state: RootState) => ({
});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({
}, dispatch);

/*
TODO: 
- Throttled resizing of canvas on window resize.
- Animate bg on auto play.
- Pointer circle.
- Touch events.
*/

export class Visualization extends React.Component<PropsWithStyles, {}> {
  render() {
    const {
      classes
    } = this.props;

    return (
      <canvas className={classes.canvas} />
    );
  }
}

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Visualization));
