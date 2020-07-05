import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { makeStyles, Drawer, Hidden } from "@material-ui/core";
import { BottomDrawer } from "../../../components";
import { RootState } from "../../../store";
import { synthActions, synthSelectors } from "..";
import { AudioSettings } from "./AudioSettings";
import { Visualization } from "./Visualization";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    zIndex: 1,
    overflow: "hidden",
    position: "relative",
    display: "flex",
    width: "100%",
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

type SynthProps = {
  audioSettingsOpen: boolean;
  onToggleAudioSettings: (open: boolean) => any;
};

export const CoreSynth: React.FC<SynthProps> = (props) => {
  const classes = useStyles();
  const { audioSettingsOpen, onToggleAudioSettings } = props;

  return (
    <div className={classes.root}>
      <Hidden smUp>
        <BottomDrawer
          closedHeight={140}
          open={audioSettingsOpen}
          onToggleOpen={onToggleAudioSettings}
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
        onToggleAudioSettings: synthActions.toggleAudioSettings,
      },
      dispatch,
    ),
)(CoreSynth);
