import {
  Grid,
  TextField
  // Typography,
} from '@material-ui/core';
import {
  StyleRulesCallback,
  Theme,
  withStyles,
  WithStyles,
} from '@material-ui/core/styles';
import Slider, { SliderProps } from '@material-ui/lab/Slider';

import * as React from 'react';

const styles: StyleRulesCallback = (theme: Theme) => ({
  textInput: {
    // backgroundColor: theme.palette.common.white,
    // border: '1px solid #ced4da',
  },
});

type CustomSliderProps = SliderProps & {
  label?: string;
}

type PropsWithStyles = CustomSliderProps & WithStyles<'textInput'>;

// TODO: use flexbox instead of grid
// TODO: make text input fixed width (prop?) and the slider take up the rest
// TODO: style text input properly

const CustomSlider: React.SFC<PropsWithStyles> = ({ classes, label, value, ...rest }: PropsWithStyles) => {
  return (
    <Grid container alignItems="flex-end">
      <Grid item xs={2}>
        <TextField
          label={label}
          value={value}
          fullWidth
          disabled
          InputProps={{
            disableUnderline: true,
            classes: {
              input: classes.textInput,
            },
          }}
        />
      </Grid>
      <Grid item xs={10}>
        <Slider
          value={value}
          {...rest}
        />
      </Grid>
    </Grid>
  );
};

export default withStyles(styles)<CustomSliderProps>(CustomSlider);
