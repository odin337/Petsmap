import rawPins from "@/data/mockData.json";
import { normalizePinRecord } from "@/lib/pins";
import type { PinRecord } from "@/types/pin";

export function getMockPins() {
  return (rawPins as PinRecord[]).map((pin) => normalizePinRecord(pin));
}
