import React, { useEffect, useCallback, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { makeStyles, useTheme } from "@material-ui/core";
import ResizeObserver from "resize-observer-polyfill";
import { debounce } from "ts-debounce";

const useStyles = makeStyles(() => ({
  canvas: {
    height: "100%",
    width: "100%",
    userSelect: "none",
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
      console.log("resize");
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

export type TouchPosition = [number, number];

/*
TODO: 
- Animate bg on auto play.
- Touch events.
*/
export const Visualization: React.FC = () => {
  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();
  const [touching, setTouching] = useState(false);
  const [touchPos, setTouchPos] = useState<TouchPosition>([0, 0]);
  const [elem, context, canvasRef] = useCanvas();
  const [rect] = useClientRect(elem);

  const onMouseDown = useCallback(
    (e: MouseEvent) => {
      if (!rect) {
        return;
      }
      setTouchPos([e.clientX - rect.left, e.clientY - rect.top]);
      setTouching(true);
    },
    [rect],
  );

  const onMouseUp = useCallback(() => setTouching(false), []);

  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!rect || !touching) {
        return;
      }
      setTouchPos([e.clientX - rect.left, e.clientY - rect.top]);
    },
    [rect, touching],
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

    if (touching) {
      context.beginPath();
      context.arc(touchPos[0], touchPos[1], 25, 0, 2 * Math.PI, true);
      context.fillStyle = theme.palette.primary.light;
      context.fill();

      const relX = touchPos[0] / rect.width;
      const relY = touchPos[1] / rect.height;

      console.log(relX, relY);
    }
  }, [context, rect, touching, touchPos]);

  useEffect(() => {
    if (!elem) {
      return;
    }
    elem.addEventListener("mousedown", onMouseDown);
    elem.addEventListener("mouseup", onMouseUp);
    elem.addEventListener("mousemove", onMouseMove);
    return () => {
      elem.removeEventListener("mousedown", onMouseDown);
      elem.removeEventListener("mouseup", onMouseUp);
      elem.removeEventListener("mousemove", onMouseMove);
    };
  }, [elem, onMouseDown, onMouseUp, onMouseMove]);

  return <canvas className={classes.canvas} ref={canvasRef} />;
};
