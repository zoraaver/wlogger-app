import * as React from "react";
import { Text, StyleSheet } from "react-native";
import { weightUnit } from "../slices/workoutPlansSlice";
import { Helvetica } from "../util/constants";
import { Button } from "./Button";

interface WeightUnitButtonsProps {
  unit: weightUnit;
  onUnitChange: (unit: weightUnit) => void;
}

export function WeightUnitButtons({
  unit,
  onUnitChange,
}: WeightUnitButtonsProps) {
  return (
    <>
      <Button
        onPress={() => onUnitChange("kg")}
        style={[
          styles.unitButton,
          styles.leftUnitButton,
          {
            borderWidth: unit === "kg" ? 2 : 0,
          },
        ]}
      >
        <Text style={styles.buttonText}>kg</Text>
      </Button>
      <Button
        onPress={() => onUnitChange("lb")}
        style={[
          styles.unitButton,
          styles.rightUnitButton,
          {
            borderWidth: unit === "lb" ? 2 : 0,
          },
        ]}
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
