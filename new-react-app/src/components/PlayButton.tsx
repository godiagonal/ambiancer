import React from "react";
import { makeStyles, Button, ButtonProps, Icon } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  icon: {
    marginRight: theme.spacing(1),
  },
}));

export type PlayButtonProps = ButtonProps & {
  playing?: boolean;
  onValueChange?: (playing: boolean) => any;
};

export const PlayButton: React.FC<PlayButtonProps> = ({
  playing,
  onValueChange,
  children,
  ...rest
}) => {
  const classes = useStyles();
  const handleOnClick = () => onValueChange && onValueChange(!playing);

  return (
    <Button
      variant="contained"
      color={playing ? "primary" : "default"}
      onClick={handleOnClick}
      {...rest}
    >
      <Icon className={classes.icon}>{playing ? "pause" : "play_arrow"}</Icon>
      {children}
    </Button>
  );
};
