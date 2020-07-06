import React, { useRef, useEffect, useCallback } from "react";
import { Swipeable, EventData } from "react-swipeable";
import { makeStyles, useTheme } from "@material-ui/core";
import { debounce } from "ts-debounce";

const useStyles = makeStyles((theme) => ({
  container: {
    width: "100%",
    maxHeight: "100vh",
    backgroundColor: theme.palette.background.paper,
    borderTop: `1px solid ${theme.palette.divider}`,
  },
}));

const flickThreshold = 0.6;
const snapThreshold = 0.2;

export type BottomDrawerProps = {
  closedHeight: number;
  open: boolean;
  toggleOpen: (open: boolean) => void;
};

export const BottomDrawer: React.FC<BottomDrawerProps> = ({
  children,
  closedHeight,
  open,
  toggleOpen,
}) => {
  const classes = useStyles();
  const theme = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className={classes.container} ref={containerRef}>
      <Swipeable
        onSwiping={onSwiping}
        onSwipedUp={onSwipedUp}
        onSwipedDown={onSwipedDown}
      >
        <div ref={contentRef}>{children}</div>
      </Swipeable>
    </div>
  );
};
