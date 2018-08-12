import {
  TextField,
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
  root: {
    display: 'flex',
    alignItems: 'flex-end',
  },
  textContainer: {
    flex: '0 0 30px',
    minWidth: 0,
  },
  sliderContainer: {
    flex: '1 1 auto',
  },
  textInput: {
    color: theme.palette.common.black,
    paddingBottom: 6,
  },
});

type CustomSliderProps = SliderProps & {
  label?: string;
}

type PropsWithStyles = CustomSliderProps & WithStyles<'root' | 'textContainer' | 'sliderContainer' | 'textInput'>;

const CustomSlider: React.SFC<PropsWithStyles> = ({ classes, className, label, value, ...rest }: PropsWithStyles) => {
  const onTouchMove = (e: any) => e.stopPropagation();
  const rootClasses = [classes.root, className].join(' ');

  value = value === undefined ? 0 : value;

  return (
    <div className={rootClasses}>
      <div className={classes.textContainer}>
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
      </div>
      <div className={classes.sliderContainer}>
        <Slider
          value={value}
          onTouchMove={onTouchMove}
          {...rest}
        />
      </div>
    </div>
  );
};

export default withStyles(styles)<CustomSliderProps>(CustomSlider);
