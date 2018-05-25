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

type Props = ButtonProps & {
  playing?: boolean,
}

type PropsWithStyles = Props & WithStyles<'root' | 'icon'>;

const PlayButton: React.SFC<PropsWithStyles> = ({ classes, playing, children, ...props }: PropsWithStyles) => (
  <Button
    variant="raised"
    color={playing ? 'primary' : 'default'}
    {...props}
  >
    <Icon className={classes.icon}>{playing ? 'pause' : 'play_arrow'}</Icon>
    {children}
  </Button>
);

export default withStyles(styles)<Props>(PlayButton);
