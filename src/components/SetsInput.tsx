import * as React from "react";
import NumericInput from "react-native-numeric-input";
import { commonNumericInputProps } from "./WeightInput";

interface SetsInputProps {
  sets: number;
  onSetsChange: (sets: number) => void;
  width: number;
}

export function SetsInput({ sets, onSetsChange, width }: SetsInputProps) {
  return (
    <NumericInput
      totalWidth={width}
      {...commonNumericInputProps}
      onChange={onSetsChange}
      value={sets}
      valueType="integer"
      minValue={1}
      initValue={sets}
    />
  );
}
