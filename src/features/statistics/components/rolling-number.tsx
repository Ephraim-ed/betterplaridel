import { SlidingNumber } from "@animate-ui/react/primitives/texts/sliding-number";

// Critically damped, so each digit settles in about 0.7s without bouncing past its value.
const ROLL = { stiffness: 70, damping: 17, mass: 1 };

// Odometer-style number: every digit rolls up from 0 when the page opens, and rolls to its new digit
// whenever the value changes. Holds its final width while rolling, shows the value at once for
// reduced-motion users, and gives screen readers the final value rather than the moving digits.
export function RollingNumber({ value, decimals = 0 }: { value: number; decimals?: number }) {
  return <SlidingNumber number={value} decimalPlaces={decimals} thousandSeparator="," padStart transition={ROLL} />;
}
