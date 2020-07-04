import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { makeStyles } from "@material-ui/core";
import { RootState } from "../../../store";

const useStyles = makeStyles(() => ({
  canvas: {
    height: "100%",
    width: "100%",
  },
}));

type VisualizationProps = {
  test?: boolean;
};

/*
TODO: 
- Throttled resizing of canvas on window resize.
- Animate bg on auto play.
- Pointer circle.
- Touch events.
*/
export const CoreVisualization: React.FC<VisualizationProps> = () => {
  const classes = useStyles();

  return <canvas className={classes.canvas} />;
};

export const Visualization = connect(
  (state: RootState) => ({}),
  (dispatch) => bindActionCreators({}, dispatch),
)(CoreVisualization);
