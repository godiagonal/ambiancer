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
  canvas: {
    height: "100%",
    width: "100%",
    userSelect: "none",
    backgroundColor: getBackgroundColor(theme, [0.5, 0.5]),
    transitionDuration: defaultTransitionDuration,
  },
}));

const useCanvas = (): [
  HTMLCanvasElement | null,
  CanvasRenderingContext2D | null,
  React.RefCallback<HTMLCanvasElement>,
] => {
  const [elem, setElem] = useState<HTMLCanvasElement | null>(null);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const ref: React.RefCallback<HTMLCanvasElement> = useCallback((node) => {
    if (node !== null) {
      setElem(node);
      setContext(node.getContext("2d"));
    }
  }, []);
  return [elem, context, ref];
};

const useClientRect = (elem: HTMLElement | null): [DOMRect | null] => {
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
    resizeObserverRef.current = new ResizeObserver(debounce(callback, 20));
  }, []);

  useEffect(() => {
    const resizeObserver = resizeObserverRef.current;
    if (!elem || !resizeObserver) {
      return;
    }
    resizeObserver.observe(elem);
    return () => resizeObserver.unobserve(elem);
  }, [elem]);

  useEffect(() => {
    setRect(elem?.getBoundingClientRect() || null);
  }, [elem]);
  return [rect];
};

export const Visualization: React.FC = () => {
  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();
  const [touching, setTouching] = useState(false);
  const [touchPos, setTouchPos] = useState<[number, number]>([0, 0]);
  const [elem, context, canvasRef] = useCanvas();
  const [rect] = useClientRect(elem);
  const autoPlay = useSelector((state) => state.autoPlay);
  const bpm = useSelector((state) => state.bpm);

  const setRelativeTouchPos = useCallback(
    (value: [number, number] | null) =>
      dispatch(rootActions.setTouchPosition(value)),
    [dispatch],
  );

  const setBackgroundColor = useCallback(
    (pos: [number, number]) => {
      if (!elem) {
        return;
      }
      elem.style.background = getBackgroundColor(theme, pos);
    },
    [elem, theme],
  );

  const onMouseDown = useCallback(
    (e: MouseEvent) => {
      if (!rect) {
        return;
      }
      setTouchPos([e.clientX - rect.left, e.clientY - rect.top]);
      setTouching(true);
    },
    [rect, setTouchPos],
  );

  const onMouseUp = useCallback(() => setTouching(false), []);

  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!rect || !touching) {
        return;
      }
      setTouchPos([e.clientX - rect.left, e.clientY - rect.top]);
    },
    [rect, touching, setTouchPos],
  );

  useEffect(() => {
    if (!elem || !rect) {
      return;
    }
    elem.width = rect.width;
    elem.height = rect.height;
  }, [rect, elem]);

  useEffect(() => {
    if (!context || !rect) {
      return;
    }
    context.clearRect(0, 0, rect.width, rect.height);
    if (touching && touchPos) {
      context.beginPath();
      context.arc(touchPos[0], touchPos[1], 25, 0, 2 * Math.PI, true);
      context.fillStyle = theme.palette.primary.light;
      context.fill();
    }
  }, [context, rect, touching, touchPos, theme]);

  useEffect(() => {
    if (!rect) {
      return;
    }
    if (touching) {
      const relPos: [number, number] = [
        Math.min(Math.max(touchPos[0] / rect.width, 0), 1),
        Math.min(Math.max(touchPos[1] / rect.height, 0), 1),
      ];
      setBackgroundColor(relPos);
      setRelativeTouchPos(relPos);
    } else {
      setRelativeTouchPos(null);
    }
  }, [rect, touching, touchPos, setRelativeTouchPos, setBackgroundColor]);

  useEffect(() => {
    if (!autoPlay || !elem) {
      return;
    }
    const interval = (60 / bpm) * 1000;
    elem.style.transitionDuration = `${interval / 1000}s`;
    const timer = setInterval(() => {
      setBackgroundColor([Math.random(), Math.random()]);
    }, interval);
    return () => {
      elem.style.transitionDuration = defaultTransitionDuration;
      clearInterval(timer);
    };
  }, [elem, bpm, autoPlay, setBackgroundColor]);

  useEffect(() => {
    if (!elem) {
      return;
    }

    const onTouchStart = (e: TouchEvent) => {
      elem.dispatchEvent(
        new MouseEvent("mousedown", {
          clientX: e.touches[0].clientX,
          clientY: e.touches[0].clientY,
        }),
      );
    };

    const onTouchEnd = () => {
      elem.dispatchEvent(new MouseEvent("mouseup"));
    };

    const onTouchMove = (e: TouchEvent) => {
      elem.dispatchEvent(
        new MouseEvent("mousemove", {
          clientX: e.touches[0].clientX,
          clientY: e.touches[0].clientY,
        }),
      );
    };

    elem.addEventListener("mousedown", onMouseDown);
    elem.addEventListener("mouseup", onMouseUp);
    elem.addEventListener("mousemove", onMouseMove);
    elem.addEventListener("touchstart", onTouchStart);
    elem.addEventListener("touchend", onTouchEnd);
    elem.addEventListener("touchmove", onTouchMove);

    return () => {
      elem.removeEventListener("mousedown", onMouseDown);
      elem.removeEventListener("mouseup", onMouseUp);
      elem.removeEventListener("mousemove", onMouseMove);
      elem.removeEventListener("touchstart", onTouchStart);
      elem.removeEventListener("touchend", onTouchEnd);
      elem.removeEventListener("touchmove", onTouchMove);
    };
  }, [elem, onMouseDown, onMouseUp, onMouseMove]);

  return <canvas className={classes.canvas} ref={canvasRef} />;
};
