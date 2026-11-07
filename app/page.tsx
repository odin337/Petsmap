import { MapPageClient } from "@/components/map/map-page-client";
import { getMockPins } from "@/lib/mock-data";
import type { PinCoordinates } from "@/types/pin";

type SearchParamsValue = string | string[] | undefined;

type PageProps = {
  searchParams?: Promise<Record<string, SearchParamsValue>> | Record<string, SearchParamsValue>;
};

function getFirstValue(value: SearchParamsValue) {
  return Array.isArray(value) ? value[0] : value;
}

function parseDraftCoordinates(
  rawLat: SearchParamsValue,
  rawLng: SearchParamsValue,
): PinCoordinates | null {
  const lat = Number.parseFloat(getFirstValue(rawLat) ?? "");
  const lng = Number.parseFloat(getFirstValue(rawLng) ?? "");

  if (Number.isNaN(lat) || Number.isNaN(lng)) {
    return null;
  }

  return { lat, lng };
}

export default async function HomePage({ searchParams }: PageProps) {
  const resolvedSearchParams = await Promise.resolve(searchParams ?? {});
  const pins = getMockPins();
  const initialSelectedPinId = getFirstValue(resolvedSearchParams.pin) ?? null;
  const initialDraftCoordinates =
    getFirstValue(resolvedSearchParams.draft) === "new"
      ? parseDraftCoordinates(resolvedSearchParams.lat, resolvedSearchParams.lng)
      : null;

  return (
    <MapPageClient
      initialPins={pins}
      initialSelectedPinId={
        pins.some((pin) => pin.id === initialSelectedPinId) ? initialSelectedPinId : null
      }
      initialDraftCoordinates={initialDraftCoordinates}
    />
  );
}
