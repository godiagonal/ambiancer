import {
  StyleRulesCallback,
  Theme,
  withStyles,
  WithStyles,
  WithTheme,
} from "@material-ui/core";
import React from "react";
import { Swipeable, EventData } from "react-swipeable";
import { debounce } from "ts-debounce";

const styles: StyleRulesCallback<Theme, BottomDrawerProps> = (theme) => ({
  root: {
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    width: "100%",
    maxHeight: "100vh",
    backgroundColor: theme.palette.background.paper,
    borderTop: `1px solid ${theme.palette.divider}`,
    zIndex: theme.zIndex.drawer,
  },
});

type State = {
  open: boolean;
};

type BottomDrawerProps = {
  children: any;
  closedHeight: number;
  open?: boolean;
  transitionDuration?: number;
  snapThreshold?: number;
  onOpenStateChanged?: (open: boolean, height: number) => void;
};

type PropsWithStyles = BottomDrawerProps & WithStyles<"root"> & WithTheme;

class CoreBottomDrawer extends React.Component<PropsWithStyles, State> {
  public static defaultProps: Partial<BottomDrawerProps> = {
    open: false,
    transitionDuration: 400,
    snapThreshold: 0.2,
  };

  private containerRef?: HTMLDivElement;
  private contentRef?: HTMLDivElement;
  private contentHeight = 0;

  public constructor(props: PropsWithStyles) {
    super(props);

    this.state = {
      open: props.open!,
    };

    this.swiping = this.swiping.bind(this);
    this.swipedUp = this.swipedUp.bind(this);
    this.swipedDown = this.swipedDown.bind(this);
    this.updateContainerHeight = this.updateContainerHeight.bind(this);
    this.getHeightForState = this.getHeightForState.bind(this);
  }

  public static getDerivedStateFromProps(
    nextProps: PropsWithStyles,
    prevState: State,
  ) {
    if (nextProps.open !== prevState.open) {
      return {
        open: nextProps.open,
      };
    }
    return null;
  }

  public componentDidMount() {
    window.addEventListener("resize", this.resize);

    // Store height from content element so we don't have to get it from
    // the DOM every time we want to update the height (i.e. when swiping)
    this.contentHeight = this.contentRef!.clientHeight;

    this.updateContainerHeight(0);
  }

  public componentWillUnmount() {
    window.removeEventListener("resize", this.resize);
  }

  public componentDidUpdate(prevProps: PropsWithStyles, prevState: State) {
    // Get the current height of the content element since it might have
    // changed due to prop changes
    this.contentHeight = this.contentRef!.clientHeight;

    this.updateContainerHeight(
      0,
      this.props.theme.transitions.create("height", {
        duration: this.props.transitionDuration,
      }),
    );

    if (this.props.onOpenStateChanged && prevState.open !== this.state.open) {
      this.props.onOpenStateChanged(this.state.open, this.getHeightForState());
    }
  }

  public render() {
    const { classes, children } = this.props;

    return (
      <div
        className={classes.root}
        ref={(containerRef: HTMLDivElement) => {
          this.containerRef = containerRef;
        }}
      >
        <Swipeable
          onSwiping={this.swiping}
          onSwipedUp={this.swipedUp}
          onSwipedDown={this.swipedDown}
        >
          <div
            ref={(contentRef: HTMLDivElement) => {
              this.contentRef = contentRef;
            }}
          >
            {children}
          </div>
        </Swipeable>
      </div>
    );
  }

  private resize = debounce(() => {
    // Get the current height of the content element since it might have
    // changed due to window size changes
    this.contentHeight = this.contentRef!.clientHeight;
    this.updateContainerHeight(0);
  }, 100);

  private swiping({ absY, dir }: EventData) {
    if (dir === "Up") {
      this.updateContainerHeight(absY);
    } else if (dir === "Down") {
      this.updateContainerHeight(-absY);
    }
  }

  private swipedUp({ deltaY }: EventData) {
    const isFlick = false;
    if (!this.state.open) {
      if (isFlick || deltaY > this.contentHeight * this.props.snapThreshold!) {
        this.setState({ open: true });
      } else {
        this.setState({ open: false });
      }
    }
  }

  private swipedDown({ deltaY }: EventData) {
    const isFlick = false;
    if (this.state.open) {
      if (isFlick || -deltaY > this.contentHeight * this.props.snapThreshold!) {
        this.setState({ open: false });
      } else {
        this.setState({ open: true });
      }
    }
  }

  private updateContainerHeight(offset: number, transition = "") {
    let height = this.getHeightForState();

    // offset is used to set a height that is somewhere inbetween the min
    // height (closed height) and the max height (content height)
    if (offset !== 0) {
      height += offset;
      height =
        height > this.contentHeight
          ? this.contentHeight
          : height < this.props.closedHeight
          ? this.props.closedHeight
          : height;
    }

    const containerStyle = this.containerRef!.style;

    containerStyle.height = `${height}px`;
    containerStyle.webkitTransition = transition;
    containerStyle.transition = transition;
  }

  private getHeightForState() {
    return this.state.open ? this.contentHeight : this.props.closedHeight;
  }
}

export const BottomDrawer = withStyles(styles, { withTheme: true })(
  CoreBottomDrawer,
);
