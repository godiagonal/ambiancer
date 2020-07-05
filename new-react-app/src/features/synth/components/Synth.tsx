import React from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { makeStyles, Drawer, Hidden } from "@material-ui/core";
import { BottomDrawer } from "../../../components";
import { RootState } from "../../../store";
import { synthActions, synthSelectors } from "..";
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

export type SynthProps = {
  audioSettingsOpen: boolean;
  toggleAudioSettings: (open: boolean) => void;
};

export const CoreSynth: React.FC<SynthProps> = (props) => {
  const classes = useStyles();
  const { audioSettingsOpen, toggleAudioSettings } = props;

  return (
    <div className={classes.root}>
      <Hidden smUp>
        <BottomDrawer
          closedHeight={140}
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

export const Synth = connect(
  (state: RootState) => ({
    audioSettingsOpen: synthSelectors.getAudioSettingsOpen(state.synth),
  }),
  (dispatch: Dispatch) =>
    bindActionCreators(
      {
        toggleAudioSettings: synthActions.toggleAudioSettings,
      },
      dispatch,
    ),
)(CoreSynth);
