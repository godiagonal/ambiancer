import React, { useRef, useEffect, useCallback, useState } from "react";
import { Swipeable, EventData } from "react-swipeable";
import { makeStyles, useTheme, fade } from "@material-ui/core";
import { ExpandMore } from "@material-ui/icons";
import { debounce } from "ts-debounce";
import clsx from "clsx";

const useStyles = makeStyles((theme) => ({
  "@keyframes pulse": {
    "0%": {
      transform: "scale(0.75)",
      opacity: 0.25,
    },
    "50%": {
      transform: "scale(1)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(0.75)",
      opacity: 0.25,
    },
  },
  "@keyframes fadeOut": {
    "0%": {
      opacity: 1,
    },
    "100%": {
      opacity: 0,
    },
  },
  container: {
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
  scrollIndicator: {
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    display: "flex",
    justifyContent: "center",
    height: 30,
    pointerEvents: "none",
    background: `linear-gradient(0deg, ${fade(
      theme.palette.background.paper,
      1,
    )} 0%, rgba(0,0,0,0) 100%)`,
  },
  scrollIndicatorIcon: {
    animationName: "$pulse",
    animationFillMode: "forwards",
    animationTimingFunction: theme.transitions.easing.easeInOut,
    animationDuration: "3000ms",
    animationIterationCount: "infinite",
  },
  scrollIndicatorIconHidden: {
    animationName: "$fadeOut",
    animationFillMode: "forwards",
    animationTimingFunction: theme.transitions.easing.easeInOut,
    animationDuration: "1500ms",
    animationIterationCount: 1,
  },
}));

const flickThreshold = 0.6;
const snapThreshold = 0.2;

export type BottomDrawerProps = {
  closedHeight: number;
  open: boolean;
  toggleOpen: (open: boolean) => void;
  setHeight: (height: number) => void;
};

export const BottomDrawer: React.FC<BottomDrawerProps> = ({
  children,
  closedHeight,
  open,
  toggleOpen,
  setHeight,
}) => {
  const classes = useStyles();
  const theme = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [hasSwiped, setHasSwiped] = useState(false);

  const getOpenHeight = useCallback(
    () => contentRef.current?.clientHeight || 0,
    [contentRef],
  );

  const getHeightForState = useCallback(
    () => (open ? getOpenHeight() : closedHeight),
    [open, closedHeight, getOpenHeight],
  );

  const setContainerHeight = useCallback(
    (offset: number, transition = "") => {
      const openHeight = getOpenHeight();
      let height = getHeightForState();

      if (offset !== 0) {
        height += offset;
        height =
          height > openHeight
            ? openHeight
            : height < closedHeight
            ? closedHeight
            : height;
      }

      const containerStyle = containerRef.current?.style;
      if (containerStyle) {
        containerStyle.height = `${height}px`;
        containerStyle.webkitTransition = transition;
        containerStyle.transition = transition;
      }
    },
    [closedHeight, getOpenHeight, getHeightForState],
  );

  const resetContainerHeight = useCallback(
    () =>
      setContainerHeight(
        0,
        theme.transitions.create("height", {
          duration: 200,
        }),
      ),
    [theme, setContainerHeight],
  );

  const onSwiping = useCallback(
    ({ absY, dir }: EventData) => {
      if (dir === "Up") {
        setContainerHeight(absY);
      } else if (dir === "Down") {
        setContainerHeight(-absY);
      }
    },
    [setContainerHeight],
  );

  const onSwipedUp = useCallback(
    ({ deltaY, velocity }: EventData) => {
      if (!open) {
        const openHeight = getOpenHeight();
        if (velocity > flickThreshold || deltaY > openHeight * snapThreshold) {
          toggleOpen(true);
          setHasSwiped(true);
        } else {
          resetContainerHeight();
        }
      }
    },
    [open, toggleOpen, getOpenHeight, resetContainerHeight],
  );

  const onSwipedDown = useCallback(
    ({ deltaY, velocity }: EventData) => {
      if (open) {
        const openHeight = getOpenHeight();
        if (velocity > flickThreshold || -deltaY > openHeight * snapThreshold) {
          toggleOpen(false);
          setHasSwiped(true);
        } else {
          resetContainerHeight();
        }
      }
    },
    [open, toggleOpen, getOpenHeight, resetContainerHeight],
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onResize = useCallback(
    debounce(() => setContainerHeight(0), 100),
    [setContainerHeight],
  );

  useEffect(() => {
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, [onResize]);

  useEffect(() => resetContainerHeight(), [resetContainerHeight]);

  useEffect(() => setHeight(open ? getOpenHeight() : closedHeight), [
    open,
    closedHeight,
    setHeight,
    getOpenHeight,
  ]);

  return (
    <div className={classes.container} ref={containerRef}>
      <Swipeable
        onSwiping={onSwiping}
        onSwipedUp={onSwipedUp}
        onSwipedDown={onSwipedDown}
      >
        <div ref={contentRef}>{children}</div>
      </Swipeable>
      <div className={classes.scrollIndicator}>
        <ExpandMore
          className={clsx(classes.scrollIndicatorIcon, {
            [classes.scrollIndicatorIconHidden]: hasSwiped,
          })}
        />
      </div>
    </div>
  );
};
