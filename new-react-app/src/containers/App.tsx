import React, { useCallback, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import clsx from "clsx";
import {
  makeStyles,
  Drawer,
  Hidden,
  useTheme,
  useMediaQuery,
} from "@material-ui/core";
import { Tune, Close } from "@material-ui/icons";
import { BottomDrawer, ToggleButton } from "../components";
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
    overflow: "hidden",
    width: "100%",
    height: "100%",
  },
  drawer: {
    width: theme.audioSettingsWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    position: "relative",
    width: "100%",
  },
  content: {
    position: "relative",
    overflow: "hidden",
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    [theme.breakpoints.up("sm")]: {
      marginRight: -theme.audioSettingsWidth,
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
  },
  contentShift: {
    [theme.breakpoints.up("sm")]: {
      marginRight: 0,
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
  },
  drawerToggle: {
    position: "absolute",
    top: theme.spacing(2),
    right: theme.spacing(2),
  },
}));

export const App: React.FC = () => {
  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();
  const xsScreen = useMediaQuery(theme.breakpoints.down("xs"));
  const [audioSettingsHeight, setAudioSettingsHeight] = useState(0);

  const audioSettingsOpen = useSelector((state) => state.audioSettingsOpen);
  const toggleAudioSettings = useCallback(
    (open: boolean) => dispatch(rootActions.toggleAudioSettings(open)),
    [dispatch],
  );

  return (
    <div className={classes.root}>
      <Hidden smUp>
        <BottomDrawer
          closedHeight={theme.audioSettingsClosedHeight}
          open={audioSettingsOpen}
          toggleOpen={toggleAudioSettings}
          setHeight={setAudioSettingsHeight}
        >
          <AudioSettings />
        </BottomDrawer>
      </Hidden>
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: audioSettingsOpen,
        })}
      >
        <Hidden xsDown>
          <ToggleButton
            className={classes.drawerToggle}
            icons={[<Close key="close" />, <Tune key="open" />]}
            variants={["outlined", "outlined"]}
            value={audioSettingsOpen}
            onChange={toggleAudioSettings}
          />
        </Hidden>
        <Visualization heightOffset={xsScreen ? audioSettingsHeight : 0} />
      </main>
      <Hidden xsDown>
        <Drawer
          className={classes.drawer}
          variant="persistent"
          anchor="right"
          open={audioSettingsOpen}
          classes={{
            paper: classes.drawerPaper,
          }}
        >
          <AudioSettings />
        </Drawer>
      </Hidden>
    </div>
  );
};
