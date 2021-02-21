import React, { cloneElement, useCallback, useRef } from "react";
import clsx from "clsx";
import { Button, ButtonProps, IconProps, makeStyles } from "@material-ui/core";

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
    button: {
      // Use hardcoded height in order to precent flicker when
      // toggling variants
      height: 36,
    },
    iconButton: {
      flex: "0 0 auto",
      minWidth: 0,
      padding: 7,
      borderRadius: "50%",
      textAlign: "center",
      // Explicitly set the default value to solve a bug on IE 11
      overflow: "visible",
    },
    icon: {
      fontSize: 20,
      pointerEvents: "none",
    },
  };
});

export type ToggleButtonProps = Omit<ButtonProps, "value" | "onChange"> & {
  iconOnly?: boolean;
  icons?: [React.ReactElement<IconProps>, React.ReactElement<IconProps>];
  variants?: [ButtonProps["variant"], ButtonProps["variant"]];
  value: boolean;
  onChange?: (value: boolean) => void;
};

export const ToggleButton: React.FC<ToggleButtonProps> = ({
  icons,
  variants = ["contained", "outlined"],
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

  const iconOnly = !buttonProps.children;
  const icon = icons
    ? cloneElement(value ? icons[0] : icons[1], {
        className: classes.icon,
      })
    : undefined;
  const startIconProp: ButtonProps =
    icon && !iconOnly
      ? {
          startIcon: icon,
        }
      : {};
  const childrenIconProp: ButtonProps =
    icon && iconOnly
      ? {
          children: icon,
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
        {...startIconProp}
        {...childrenIconProp}
        className={clsx(classes.button, buttonProps.className, {
          [classes.iconButton]: iconOnly,
        })}
        variant={value ? variants[0] : variants[1]}
        onClick={onClick}
      />
    </label>
  );
};
