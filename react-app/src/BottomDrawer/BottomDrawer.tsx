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
    position: 'fixed',
    bottom: 0,
    width: '100%',
    maxHeight: '100vh',
    backgroundColor: theme.palette.background.paper,
    // [theme.breakpoints.up('md')]: {
    //   width: '240px',
    //   position: 'relative',
    //   bottom: 'auto',
    //   left: 0,
    // },
  },
  content: {
    padding: theme.spacing.unit * 2,
  },
});

type State = {
  open: boolean,
}

type Props = {
  children: any,
  closedHeight: number,
  open?: boolean,
  transitionDuration?: number,
  snapThreshold?: number,
}

type PropsWithStyles = Props & WithStyles<'root' | 'content'> & WithTheme;

class BottomDrawer extends React.Component<PropsWithStyles, State> {
  static defaultProps: Partial<Props> = {
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

  componentDidMount() {
    console.log('componentDidMount', this.contentRef.clientHeight);

    // Store height from content element so we don't have to get it from
    // the DOM every time we want to update the height (i.e. when swiping)
    this.contentHeight = this.contentRef.clientHeight;

    this.updateContainerHeight(0);
  }

  componentDidUpdate(prevProps: PropsWithStyles, prevState: State) {
    console.log('componentDidUpdate', prevState, this.state, this.contentRef.clientHeight);

    // Get the current height of the content element since it might have
    // changed due to prop changes
    this.contentHeight = this.contentRef.clientHeight;

    this.updateContainerHeight(0, this.props.theme.transitions.create(
      'height',
      { duration: this.props.transitionDuration },
    ));
  }

  private swipingUp = (e: any, absY: number) => {
    this.updateContainerHeight(absY);
  }

  private swipingDown = (e: any, absY: number) => {
    this.updateContainerHeight(-absY);
  }

  private swipedUp = (e: any, deltaY: number, isFlick: boolean) => {
    if (isFlick || deltaY > this.contentHeight * this.props.snapThreshold!) {
      this.setState({ open: true });
    } else {
      this.setState({ open: false });
    }
  }

  private swipedDown = (e: any, deltaY: number, isFlick: boolean) => {
    if (isFlick || -deltaY > this.contentHeight * this.props.snapThreshold!) {
      this.setState({ open: false });
    } else {
      this.setState({ open: true });
    }
  }

  private updateContainerHeight = (offset: number, transition: string = '') => {
    let height = this.state.open ? this.contentHeight : this.props.closedHeight;

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

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root} ref={(containerRef: HTMLDivElement) => { this.containerRef = containerRef; }}>
        <Swipeable
          onSwipingUp={this.swipingUp}
          onSwipingDown={this.swipingDown}
          onSwipedUp={this.swipedUp}
          onSwipedDown={this.swipedDown}
        >
          <div className={classes.content} ref={(contentRef: HTMLDivElement) => { this.contentRef = contentRef; }}>
              {this.props.children}
          </div>
        </Swipeable>
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })<Props>(BottomDrawer);
