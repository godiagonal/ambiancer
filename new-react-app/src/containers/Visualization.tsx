import React from "react";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles(() => ({
  canvas: {
    height: "100%",
    width: "100%",
  },
}));

/*
TODO: 
- Throttled resizing of canvas on window resize.
- Animate bg on auto play.
- Pointer circle.
- Touch events.
*/
export const Visualization: React.FC = () => {
  const classes = useStyles();

  return <canvas className={classes.canvas} />;
};
