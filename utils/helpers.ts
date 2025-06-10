export function calculateCubicMeterFromCm(length: number, width: number, height: number): number {
  if (length <= 0 || width <= 0 || height <= 0) {
    throw new Error("Length, width, and height must be positive numbers.");
  }
  return (length * width * height) / 1000000;
}