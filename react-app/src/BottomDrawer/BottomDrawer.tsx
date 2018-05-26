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
import { debounce } from 'ts-debounce';

const styles: StyleRulesCallback = (theme: Theme) => ({
  root: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%',
    maxHeight: '100vh',
    backgroundColor: theme.palette.background.paper,
    borderTop: `1px solid ${theme.palette.divider}`,
    zIndex: theme.zIndex.drawer,
  },
});

type State = {
  open: boolean,
}

type BottomDrawerProps = {
  children: any,
  closedHeight: number,
  open?: boolean,
  transitionDuration?: number,
  snapThreshold?: number,
  onOpenStateChanged?: (open: boolean, height: number) => void,
}

type PropsWithStyles = BottomDrawerProps & WithStyles<'root'> & WithTheme;

class BottomDrawer extends React.Component<PropsWithStyles, State> {
  static defaultProps: Partial<BottomDrawerProps> = {
    open: false,
    transitionDuration: 400,
    snapThreshold: 0.2,
  };

  private containerRef: HTMLDivElement;
  private contentRef: HTMLDivElement;
  private contentHeight = 0;

  constructor(props: PropsWithStyles) {
    super(props);

    this.state = {
      open: props.open!,
    };
  }

  static getDerivedStateFromProps(nextProps: PropsWithStyles, prevState: State) {
    if (nextProps.open !== prevState.open) {
      return {
        open: nextProps.open
      };
    }
    return null;
  }

  componentDidMount() {
    window.addEventListener('resize', this.resize);

    // Store height from content element so we don't have to get it from
    // the DOM every time we want to update the height (i.e. when swiping)
    this.contentHeight = this.contentRef.clientHeight;

    this.updateContainerHeight(0);
  }

  componentWillUnmount() {
      window.removeEventListener('resize', this.resize);
  }

  componentDidUpdate(prevProps: PropsWithStyles, prevState: State) {
    // console.log('componentDidUpdate');
    // console.log(prevProps.open, this.props.open);
    // console.log(prevState.open, this.state.open);

    // Get the current height of the content element since it might have
    // changed due to prop changes
    this.contentHeight = this.contentRef.clientHeight;

    this.updateContainerHeight(0, this.props.theme.transitions.create(
      'height',
      { duration: this.props.transitionDuration },
    ));

    if (this.props.onOpenStateChanged && prevState.open !== this.state.open) {
      this.props.onOpenStateChanged(this.state.open, this.getHeightForState());
    }
  }

  private resize = debounce(() => { 
    // Get the current height of the content element since it might have
    // changed due to window size changes
    this.contentHeight = this.contentRef.clientHeight;
    this.updateContainerHeight(0);
  }, 100);

  private swipingUp = (e: any, absY: number) => {
    this.updateContainerHeight(absY);
  }

  private swipingDown = (e: any, absY: number) => {
    this.updateContainerHeight(-absY);
  }

  private swipedUp = (e: any, deltaY: number, isFlick: boolean) => {
    if (!this.state.open) {
      if (isFlick || deltaY > this.contentHeight * this.props.snapThreshold!) {
        this.setState({ open: true });
      } else {
        this.setState({ open: false });
      }
    }
  }

  private swipedDown = (e: any, deltaY: number, isFlick: boolean) => {
    if (this.state.open) {
      if (isFlick || -deltaY > this.contentHeight * this.props.snapThreshold!) {
        this.setState({ open: false });
      } else {
        this.setState({ open: true });
      }
    }
  }

  private updateContainerHeight = (offset: number, transition: string = '') => {
    let height = this.getHeightForState();

    // offset is used to set a height that is somewhere inbetween the min
    // height (closed height) and the max height (content height)
    if (offset !== 0) {
      height += offset;
      height = height > this.contentHeight ? this.contentHeight
             : height < this.props.closedHeight ? this.props.closedHeight
             : height;
    }
    
    const containerStyle = this.containerRef.style;

    containerStyle.height = `${height}px`;
    containerStyle.webkitTransition = transition;
    containerStyle.transition = transition;
  }

  private getHeightForState = () => {
    return this.state.open ? this.contentHeight : this.props.closedHeight;
  }

  render() {
    const { classes, children } = this.props;

    return (
      <div className={classes.root} ref={(containerRef: HTMLDivElement) => { this.containerRef = containerRef; }}>
        <Swipeable
          onSwipingUp={this.swipingUp}
          onSwipingDown={this.swipingDown}
          onSwipedUp={this.swipedUp}
          onSwipedDown={this.swipedDown}
        >
          <div ref={(contentRef: HTMLDivElement) => { this.contentRef = contentRef; }}>
              {children}
          </div>
        </Swipeable>
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })<BottomDrawerProps>(BottomDrawer);
