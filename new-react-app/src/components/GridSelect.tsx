import React, { useCallback } from "react";
import {
  FormGroup,
  Grid,
  PropTypes,
  GridSpacing,
  GridSize,
  makeStyles,
} from "@material-ui/core";
import { Breakpoint } from "@material-ui/core/styles/createBreakpoints";
import { ToggleButton } from "./ToggleButton";

type SelectedValuesAction<T> =
  | {
      type: "add";
      value: T;
    }
  | {
      type: "remove";
      value: T;
    };

function selectedValuesReducer<T>(
  state: T[],
  action: SelectedValuesAction<T>,
): T[] {
  switch (action.type) {
    case "add":
      return [...state, action.value];
    case "remove":
      return state.filter((item) => item !== action.value);
  }
}

const useStyles = makeStyles((theme) => {
  return {
    root: {
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(1),
    },
    button: {
      minWidth: 0,
    },
  };
});

export type GridSelectValue<T> = {
  value: T;
  label: string;
};

export type GridSelectProps<T = unknown> = {
  id?: string;
  color?: PropTypes.Color;
  spacing?: GridSpacing;
  size?: Partial<Record<Breakpoint, boolean | GridSize>>;
  values: GridSelectValue<T>[];
} & (
  | {
      multiple: true;
      value: T[];
      onChange: (value: T[]) => void;
    }
  | {
      multiple?: false;
      value: T;
      onChange: (value: T) => void;
    }
);

export function GridSelect<T = unknown>({
  id,
  color,
  spacing,
  size,
  values,
  ...valueProps
}: GridSelectProps<T>): React.ReactElement | null {
  const classes = useStyles();

  const onValueSelected = useCallback(
    (value: T, selected: boolean) => {
      if (valueProps.multiple) {
        valueProps.onChange(
          selectedValuesReducer(valueProps.value, {
            type: selected ? "add" : "remove",
            value,
          }),
        );
      } else {
        valueProps.onChange(value);
      }
    },
    [valueProps],
  );

  return (
    <FormGroup className={classes.root} id={id}>
      <Grid container spacing={spacing}>
        {values.map((valueMeta) => (
          <Grid item key={String(valueMeta.value)} {...size}>
            <ToggleButton
              className={classes.button}
              color={color}
              fullWidth
              value={
                valueProps.multiple
                  ? valueProps.value.some(
                      (selectedValue) => selectedValue === valueMeta.value,
                    )
                  : valueProps.value === valueMeta.value
              }
              onChange={(checked) => onValueSelected(valueMeta.value, checked)}
            >
              {valueMeta.label}
            </ToggleButton>
          </Grid>
        ))}
      </Grid>
    </FormGroup>
  );
}
