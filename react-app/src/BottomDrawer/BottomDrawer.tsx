/* tslint:disable:no-console */

import {
  StyleRulesCallback,
  Theme,
  withStyles,
  WithStyles,
  WithTheme,
} from '@material-ui/core/styles';
import * as React from 'react';
import * as Swipeable from 'react-swipeable';

const styles: StyleRulesCallback = (theme: Theme) => ({
  root: {
    backgroundColor: 'white',
    position: 'fixed',
    bottom: 0,
    width: '100%',
  },
  drawer: {
    backgroundColor: 'red',
    width: '100%',
  },
});

type Props = {
  children: any,
  openHeight: number,
  closedHeight: number,
  open?: boolean,
  transitionDuration?: number,
  snapThreshold?: number,
}

type PropsWithStyles = Props & WithStyles<'root' | 'drawer'> & WithTheme;

class BottomDrawer extends React.Component<PropsWithStyles, {}> {
  static defaultProps: Partial<PropsWithStyles> = {
    open: false,
    transitionDuration: 400,
    snapThreshold: 0.2,
  };

  private drawer: HTMLDivElement;
  private height = this.props.open ? this.props.openHeight : this.props.closedHeight;

  componentDidMount() {
    this.setDrawerHeight(this.height);
  }

  private swipingUp = (e: any, absY: number) => {
    // console.log("Up", this.height + absY);
    const height = this.getNormHeight(this.height + absY);
    this.setDrawerHeight(height);
  }

  private swipingDown = (e: any, absY: number) => {
    // console.log("Down", this.height - absY);
    const height = this.getNormHeight(this.height - absY);
    this.setDrawerHeight(height);
  }

  private swipedUp = (e: any, deltaY: number, isFlick: boolean) => {
    if (this.height < this.props.openHeight) {
      console.log("Up Done", deltaY, this.props.openHeight * this.props.snapThreshold!, isFlick);
      const transition = this.getTransition();

      if (isFlick) {
        this.height = this.props.openHeight;
      } else {
        this.height = deltaY > this.props.openHeight * this.props.snapThreshold! ? this.props.openHeight : this.props.closedHeight;
      }

      this.setDrawerHeight(this.height, transition);
    }
  }

  private swipedDown = (e: any, deltaY: number, isFlick: boolean) => {
    if (this.height > this.props.closedHeight) {
      console.log("Down Done", -deltaY, this.props.openHeight * this.props.snapThreshold!, isFlick);
      const transition = this.getTransition();

      if (isFlick) {
        this.height = this.props.closedHeight;
      } else {
        this.height = -deltaY > this.props.openHeight * this.props.snapThreshold! ? this.props.closedHeight : this.props.openHeight;
      }
      
      this.setDrawerHeight(this.height, transition);
    }
  }

  private setDrawerHeight = (height: number, transition: string = '') => {
    const drawerStyle = this.drawer.style;

    drawerStyle.height = `${height}px`;
    drawerStyle.webkitTransition = transition;
    drawerStyle.transition = transition;
  }

  private getNormHeight = (height: number) => {
    return height > this.props.openHeight ? this.props.openHeight
            : height < this.props.closedHeight ? this.props.closedHeight
            : height;
  }

  private getTransition = () => {
    return this.props.theme.transitions.create(
              'height',
              { duration: this.props.transitionDuration },
            );
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <Swipeable
          onSwipingUp={this.swipingUp}
          onSwipingDown={this.swipingDown}
          onSwipedUp={this.swipedUp}
          onSwipedDown={this.swipedDown}
        >
          <div className={classes.drawer} ref={(drawer: HTMLDivElement) => { this.drawer = drawer; }}>
            {this.props.children}
          </div>
        </Swipeable>
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })<Props>(BottomDrawer);
