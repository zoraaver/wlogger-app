import * as React from "react";
import { ViewStyle } from "react-native";
import NumericInput, { INumericInputProps } from "react-native-numeric-input";
import { successColor } from "../util/constants";

interface WeightInputProps {
  onWeightChange: (weight: number) => void;
  weight: number;
  width: number;
}

export function WeightInput({
  weight,
  onWeightChange,
  width,
}: WeightInputProps) {
  return (
    <NumericInput
      {...commonNumericInputProps}
      onChange={onWeightChange}
      value={weight}
      step={1.25}
      valueType="real"
      totalWidth={width}
      initValue={weight}
    />
  );
}

export const commonNumericInputProps: INumericInputProps = {
  type: "plus-minus",
  rounded: true,
  leftButtonBackgroundColor: "red",
  rightButtonBackgroundColor: successColor,
  minValue: 0,
  totalHeight: 50,
  iconStyle: { color: "white" } as ViewStyle,
  inputStyle: { backgroundColor: "white" },
  containerStyle: { flex: 1 },
  onChange: () => {},
};
