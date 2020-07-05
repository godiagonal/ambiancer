import React from "react";
import { Button, ButtonProps } from "@material-ui/core";
import { Pause, PlayArrow } from "@material-ui/icons";

export type PlayButtonProps = ButtonProps & {
  playing: boolean;
  togglePlaying?: (playing: boolean) => void;
};

export const PlayButton: React.FC<PlayButtonProps> = ({
  playing,
  togglePlaying,
  ...rest
}) => {
  return (
    <Button
      variant="contained"
      color={playing ? "primary" : "default"}
      startIcon={playing ? <Pause /> : <PlayArrow />}
      onClick={() => togglePlaying && togglePlaying(!playing)}
      {...rest}
    />
  );
};
