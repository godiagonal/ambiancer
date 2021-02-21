import React, { useCallback, useRef } from "react";
import clsx from "clsx";
import { Button, ButtonProps, makeStyles } from "@material-ui/core";

const useStyles = makeStyles(() => {
  return {
    root: {
      userSelect: "none",
    },
    input: {
      position: "absolute",
      opacity: 0,
      pointerEvents: "none",
    },
    button: {},
  };
});

export type ToggleButtonProps = Omit<ButtonProps, "value" | "onChange"> & {
  icons?: [React.ReactNode, React.ReactNode];
  value: boolean;
  onChange?: (value: boolean) => void;
};

export const ToggleButton: React.FC<ToggleButtonProps> = ({
  icons,
  value,
  onChange: onChangeFromProps,
  ...buttonProps
}) => {
  const classes = useStyles();
  const labelRef = useRef<HTMLLabelElement>(null);

  const onClick = useCallback(() => labelRef.current?.click(), [labelRef]);
  const onChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) =>
      onChangeFromProps?.(event.target.checked),
    [onChangeFromProps],
  );

  const iconProps: ButtonProps = icons
    ? {
        startIcon: value ? icons[0] : icons[1],
      }
    : {};

  return (
    <label className={classes.root} ref={labelRef}>
      <input
        className={classes.input}
        checked={value}
        onChange={onChange}
        type="checkbox"
      />
      <Button
        {...buttonProps}
        {...iconProps}
        className={clsx(classes.button, buttonProps.className)}
        variant={value ? "contained" : "outlined"}
        onClick={onClick}
      />
    </label>
  );
};
