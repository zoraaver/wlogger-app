export function findNearestSnapPoint(
  position: number,
  velocity: number,
  snapPoints: number[]
) {
  "worklet";
  const currentPosition: number = position + velocity * 0.2;
  const positionDeltas: number[] = snapPoints.map((snapPoint) =>
    Math.abs(snapPoint - currentPosition)
  );
  const minPositionDelta: number = Math.min(...positionDeltas);
  return snapPoints.find(
    (snapPoint) => Math.abs(snapPoint - currentPosition) === minPositionDelta
  ) as number;
}

export function includes<T>(array: Array<T>, searchElement: T): boolean {
  "worklet";
  return array.includes(searchElement);
}
