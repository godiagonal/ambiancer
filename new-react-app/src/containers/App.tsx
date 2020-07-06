import React, { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles, Drawer, Hidden, useTheme } from "@material-ui/core";
import { BottomDrawer } from "../components";
import { rootActions } from "../state";
import { AudioSettings } from "./AudioSettings";
import { Visualization } from "./Visualization";

const useStyles = makeStyles((theme) => ({
  "@global": {
    html: {
      height: "100%",
    },
    body: {
      height: "100%",
      margin: "0",
      overflow: "hidden",
    },
    "#root": {
      height: "100%",
    },
  },
  root: {
    display: "flex",
    position: "relative",
    overflow: "hidden",
    width: "100%",
    height: "100%",
  },
  drawerPaper: {
    width: 240,
    position: "relative",
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
  },
}));

export const App: React.FC = () => {
  const classes = useStyles();
  const { audioSettingsClosedHeight } = useTheme();
  const dispatch = useDispatch();

  const audioSettingsOpen = useSelector((state) => state.audioSettingsOpen);
  const toggleAudioSettings = useCallback(
    (value: boolean) => dispatch(rootActions.toggleAudioSettings(value)),
    [dispatch],
  );

  return (
    <div className={classes.root}>
      <Hidden smUp>
        <BottomDrawer
          closedHeight={audioSettingsClosedHeight}
          open={audioSettingsOpen}
          toggleOpen={toggleAudioSettings}
        >
          <AudioSettings />
        </BottomDrawer>
      </Hidden>
      <Hidden xsDown>
        <Drawer
          variant="permanent"
          open
          classes={{
            paper: classes.drawerPaper,
          }}
        >
          <AudioSettings />
        </Drawer>
      </Hidden>
      <main className={classes.content}>
        <Visualization />
      </main>
    </div>
  );
};