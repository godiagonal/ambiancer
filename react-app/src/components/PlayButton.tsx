import Button, { ButtonProps } from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import {
  StyleRulesCallback,
  Theme,
  withStyles,
  WithStyles,
} from '@material-ui/core/styles';

import * as React from 'react';

const styles: StyleRulesCallback = (theme: Theme) => ({
  icon: {
    marginRight: theme.spacing.unit,
  },
});

type PlayButtonProps = ButtonProps & {
  playing?: boolean,
  onValueChange?: (playing: boolean) => any,
};

type PropsWithStyles = PlayButtonProps & WithStyles<'root' | 'icon'>;

const PlayButton: React.SFC<PropsWithStyles> = ({ classes, playing, onValueChange, children, ...rest }: PropsWithStyles) => {
  const handleOnClick = () => onValueChange && onValueChange(!playing);

  return (
    <Button
      variant="raised"
      color={playing ? 'primary' : 'default'}
      onClick={handleOnClick}
      {...rest}
    >
      <Icon className={classes.icon}>{playing ? 'pause' : 'play_arrow'}</Icon>
      {children}
    </Button>
  );
};

export default withStyles(styles)<PlayButtonProps>(PlayButton);
