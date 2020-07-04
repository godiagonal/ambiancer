import React from "react";
import { makeStyles, TextField, Slider, SliderProps } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    alignItems: "flex-end",
  },
  textContainer: {
    flex: "0 0 30px",
    minWidth: 0,
  },
  sliderContainer: {
    flex: "1 1 auto",
  },
  textInput: {
    color: theme.palette.common.black,
    paddingBottom: 6,
  },
}));

export type CustomSliderProps = SliderProps & {
  label?: string;
};

export const CustomSlider: React.FC<CustomSliderProps> = ({
  className,
  label,
  value,
  ...rest
}) => {
  const classes = useStyles();
  const onTouchMove = (e: any) => e.stopPropagation();
  const rootClasses = [classes.root, className].join(" ");

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
        <Slider value={value} onTouchMove={onTouchMove} {...rest} />
      </div>
    </div>
  );
};
