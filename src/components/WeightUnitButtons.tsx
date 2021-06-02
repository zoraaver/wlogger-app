import * as React from "react";
import { Text, StyleSheet, ViewStyle } from "react-native";
import { weightUnit } from "../slices/workoutPlansSlice";
import { Helvetica } from "../util/constants";
import { Button } from "./Button";

interface WeightUnitButtonsProps {
  unit: weightUnit;
  onUnitChange: (unit: weightUnit) => void;
  height?: number;
}

export function WeightUnitButtons({
  unit,
  onUnitChange,
  height = 40,
}: WeightUnitButtonsProps) {
  const kgBorderStyle: ViewStyle = {
    borderWidth: unit === "kg" ? 2 : 0,
    height,
  };
  const lbBorderStyle: ViewStyle = {
    borderWidth: unit === "lb" ? 2 : 0,
    height,
  };
  return (
    <>
      <Button
        onPress={() => onUnitChange("kg")}
        style={[styles.unitButton, styles.leftUnitButton, kgBorderStyle]}
      >
        <Text style={styles.buttonText}>kg</Text>
      </Button>
      <Button
        onPress={() => onUnitChange("lb")}
        style={[styles.unitButton, styles.rightUnitButton, lbBorderStyle]}
      >
        <Text style={styles.buttonText}>lb</Text>
      </Button>
    </>
  );
}

const styles = StyleSheet.create({
  unitButton: {
    flex: 1,
    borderColor: "lavender",
  },
  rightUnitButton: {
    borderBottomLeftRadius: 0,
    borderTopLeftRadius: 0,
  },
  leftUnitButton: {
    borderBottomRightRadius: 0,
    borderTopRightRadius: 0,
  },
  buttonText: { color: "white", fontFamily: Helvetica, fontSize: 20 },
});
