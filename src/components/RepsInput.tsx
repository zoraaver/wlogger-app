import * as React from "react";
import NumericInput from "react-native-numeric-input";
import { commonNumericInputProps } from "./WeightInput";

interface RepsInputProps {
  repetitions: number;
  onChange: (repetitions: number) => void;
  width: number;
}

export function RepsInput({ onChange, repetitions, width }: RepsInputProps) {
  return (
    <NumericInput
      {...commonNumericInputProps}
      onChange={onChange}
      value={repetitions}
      initValue={repetitions}
      totalWidth={width}
      step={1}
      valueType="integer"
    />
  );
}
