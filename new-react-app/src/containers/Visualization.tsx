import React, { useEffect, useCallback, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles, useTheme, Theme } from "@material-ui/core";
import ResizeObserver from "resize-observer-polyfill";
import { debounce } from "ts-debounce";
import Chroma from "chroma-js";
import { rootActions } from "../state";

const defaultTransitionDuration = "0.1s";

const getBackgroundColor = (theme: Theme, pos: [number, number]) =>
  Chroma.mix(
    Chroma.bezier(theme.canvasBackground.x)(pos[0]),
    Chroma.bezier(theme.canvasBackground.y)(pos[1]),
  ).hex();

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
    width: "100%",
    overflow: "hidden",
    backgroundColor: getBackgroundColor(theme, [0.5, 0.5]),
    transitionDuration: defaultTransitionDuration,
  },
  canvas: {
    maxHeight: "100%",
    userSelect: "none",
  },
}));

const useCanvasContext = (
  ref: React.RefObject<HTMLCanvasElement>,
): [CanvasRenderingContext2D | null] => {
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    if (!ref.current) {
      return;
    }
    setContext(ref.current.getContext("2d"));
  }, [ref]);

  return [context];
};

const useClientRect = (
  elemRef: React.RefObject<HTMLElement>,
): [DOMRect | null] => {
  const [rect, setRect] = useState<DOMRect | null>(null);
  const resizeObserverRef = useRef<ResizeObserver>();

  useEffect(() => {
    if (resizeObserverRef.current) {
      return;
    }
    const callback: ResizeObserverCallback = (elems) => {
      if (elems.length === 0) {
        return;
      }
      setRect(elems[0].target.getBoundingClientRect());
    };
    resizeObserverRef.current = new ResizeObserver(debounce(callback, 50));
  }, []);

  useEffect(() => {
    const resizeObserver = resizeObserverRef.current;
    const elem = elemRef.current;
    if (!elem || !resizeObserver) {
      return;
    }
    resizeObserver.observe(elem);
    return () => resizeObserver.unobserve(elem);
  }, [elemRef]);

  useEffect(() => {
    setRect(elemRef.current?.getBoundingClientRect() || null);
  }, [elemRef]);

  return [rect];
};

export type VisualizationProps = {
  heightOffset: number;
};

export const Visualization: React.FC<VisualizationProps> = ({
  heightOffset,
}) => {
  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasElem = canvasRef.current;
  const rootRef = useRef<HTMLDivElement | null>(null);
  const rootElem = rootRef.current;

  const [touching, setTouching] = useState(false);
  const [touchPos, setTouchPos] = useState<[number, number]>([0, 0]);
  const [canvasRect, setCanvasRect] = useState<DOMRect | null>(null);

  const [rootRect] = useClientRect(rootRef);
  const [context] = useCanvasContext(canvasRef);

  const autoPlay = useSelector((state) => state.autoPlay);
  const bpm = useSelector((state) => state.bpm);

  const setRelativeTouchPos = useCallback(
    (value: [number, number] | null) =>
      dispatch(rootActions.setTouchPosition(value)),
    [dispatch],
  );

  const setBackgroundColor = useCallback(
    (pos: [number, number]) => {
      if (!rootElem) {
        return;
      }
      rootElem.style.background = getBackgroundColor(theme, pos);
    },
    [rootElem, theme],
  );

  const onMouseDown = useCallback(
    (e: MouseEvent) => {
      if (!canvasRect) {
        return;
      }
      setTouchPos([e.clientX - canvasRect.left, e.clientY - canvasRect.top]);
      setTouching(true);
    },
    [canvasRect, setTouchPos],
  );

  const onMouseUp = useCallback(() => setTouching(false), []);

  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!canvasRect || !touching) {
        return;
      }
      setTouchPos([e.clientX - canvasRect.left, e.clientY - canvasRect.top]);
    },
    [canvasRect, touching, setTouchPos],
  );

  useEffect(() => {
    if (!rootRect) {
      return;
    }
    setCanvasRect(
      new DOMRect(
        rootRect.x,
        rootRect.y,
        rootRect.width,
        rootRect.height - heightOffset,
      ),
    );
  }, [rootRect, heightOffset]);

  useEffect(() => {
    if (!canvasElem || !canvasRect) {
      return;
    }
    canvasElem.width = canvasRect.width;
    canvasElem.height = canvasRect.height;
  }, [canvasRect, canvasElem]);

  useEffect(() => {
    if (!context || !canvasRect) {
      return;
    }
    context.clearRect(0, 0, canvasRect.width, canvasRect.height);
    if (touching && touchPos) {
      context.beginPath();
      context.arc(touchPos[0], touchPos[1], 25, 0, 2 * Math.PI, true);
      context.fillStyle = theme.palette.primary.light;
      context.fill();
    }
  }, [context, canvasRect, touching, touchPos, theme]);

  useEffect(() => {
    if (!canvasRect) {
      return;
    }
    if (touching) {
      const relPos: [number, number] = [
        Math.min(Math.max(touchPos[0] / canvasRect.width, 0), 1),
        Math.min(Math.max(touchPos[1] / canvasRect.height, 0), 1),
      ];
      setBackgroundColor(relPos);
      setRelativeTouchPos(relPos);
    } else {
      setRelativeTouchPos(null);
    }
  }, [canvasRect, touching, touchPos, setRelativeTouchPos, setBackgroundColor]);

  useEffect(() => {
    if (!autoPlay || !rootElem) {
      return;
    }
    const interval = (60 / bpm) * 1000;
    rootElem.style.transitionDuration = `${interval / 1000}s`;
    const timer = setInterval(
      () => setBackgroundColor([Math.random(), Math.random()]),
      interval,
    );
    return () => {
      rootElem.style.transitionDuration = defaultTransitionDuration;
      clearInterval(timer);
    };
  }, [rootElem, bpm, autoPlay, setBackgroundColor]);

  useEffect(() => {
    if (!canvasElem) {
      return;
    }

    const onTouchStart = (e: TouchEvent) => {
      canvasElem.dispatchEvent(
        new MouseEvent("mousedown", {
          clientX: e.touches[0].clientX,
          clientY: e.touches[0].clientY,
        }),
      );
    };

    const onTouchEnd = () => {
      canvasElem.dispatchEvent(new MouseEvent("mouseup"));
    };

    const onTouchMove = (e: TouchEvent) => {
      canvasElem.dispatchEvent(
        new MouseEvent("mousemove", {
          clientX: e.touches[0].clientX,
          clientY: e.touches[0].clientY,
        }),
      );
    };

    canvasElem.addEventListener("mousedown", onMouseDown);
    canvasElem.addEventListener("mouseup", onMouseUp);
    canvasElem.addEventListener("mousemove", onMouseMove);
    canvasElem.addEventListener("touchstart", onTouchStart);
    canvasElem.addEventListener("touchend", onTouchEnd);
    canvasElem.addEventListener("touchmove", onTouchMove);

    return () => {
      canvasElem.removeEventListener("mousedown", onMouseDown);
      canvasElem.removeEventListener("mouseup", onMouseUp);
      canvasElem.removeEventListener("mousemove", onMouseMove);
      canvasElem.removeEventListener("touchstart", onTouchStart);
      canvasElem.removeEventListener("touchend", onTouchEnd);
      canvasElem.removeEventListener("touchmove", onTouchMove);
    };
  }, [canvasElem, onMouseDown, onMouseUp, onMouseMove]);

  return (
    <div className={classes.root} ref={rootRef}>
      <canvas className={classes.canvas} ref={canvasRef} />
    </div>
  );
};
