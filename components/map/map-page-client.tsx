"use client";

import dynamic from "next/dynamic";
import { usePathname, useRouter } from "next/navigation";
import { Plus, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";

import { PinCard } from "@/components/pins/pin-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { createEmptyPin } from "@/lib/pins";
import type { PinCoordinates, PinRecord } from "@/types/pin";

interface MapPageClientProps {
  initialPins: PinRecord[];
  initialSelectedPinId: string | null;
  initialDraftCoordinates: PinCoordinates | null;
}

const DynamicMap = dynamic(
  () => import("@/components/map/map-component").then((module) => module.MapComponent),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_top_left,rgba(91,108,240,0.16),transparent_28%),linear-gradient(180deg,#fcfbf9_0%,#f2eee8_100%)]">
        <div className="rounded-full bg-white/80 px-5 py-3 text-sm font-medium text-[var(--text-secondary)] shadow-[var(--shadow-sm)]">
          Загружаем карту...
        </div>
      </div>
    ),
  },
);

const fallbackDraftCoordinates: PinCoordinates = {
  lat: 55.751244,
  lng: 37.618423,
};

export function MapPageClient({
  initialPins,
  initialSelectedPinId,
  initialDraftCoordinates,
}: MapPageClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [pins, setPins] = useState<PinRecord[]>(initialPins);
  const [selectedPinId, setSelectedPinId] = useState<string | null>(initialSelectedPinId);
  const [draftPin, setDraftPin] = useState<PinRecord | null>(() =>
    initialDraftCoordinates ? createEmptyPin(initialDraftCoordinates) : null,
  );

  const selectedPin = useMemo(
    () => pins.find((pin) => pin.id === selectedPinId) ?? null,
    [pins, selectedPinId],
  );

  function syncUrl(nextSelectedPinId: string | null, nextDraftPin: PinRecord | null) {
    const searchParams = new URLSearchParams();

    if (nextSelectedPinId) {
      searchParams.set("pin", nextSelectedPinId);
    } else if (nextDraftPin) {
      searchParams.set("draft", "new");
      searchParams.set("lat", nextDraftPin.location.lat.toFixed(6));
      searchParams.set("lng", nextDraftPin.location.lng.toFixed(6));
    }

    const queryString = searchParams.toString();
    router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
      scroll: false,
    });
  }

  function openDraft(coordinates: PinCoordinates) {
    const nextDraft = createEmptyPin(coordinates);
    setSelectedPinId(null);
    setDraftPin(nextDraft);
    syncUrl(null, nextDraft);
  }

  function openSelectedPin(pinId: string) {
    setDraftPin(null);
    setSelectedPinId(pinId);
    syncUrl(pinId, null);
  }

  function closeCard() {
    setSelectedPinId(null);
    setDraftPin(null);
    syncUrl(null, null);
  }

  function savePin(nextPin: PinRecord) {
    const exists = pins.some((pin) => pin.id === nextPin.id);

    setPins((currentPins) =>
      exists
        ? currentPins.map((pin) => (pin.id === nextPin.id ? nextPin : pin))
        : [...currentPins, nextPin],
    );

    setDraftPin(null);
    setSelectedPinId(nextPin.id);
    syncUrl(nextPin.id, null);
  }

  return (
    <main className="relative h-screen w-full overflow-hidden">
      <DynamicMap
        pins={pins}
        activePinId={selectedPinId}
        draftPosition={draftPin?.location ?? null}
        onSelectPin={openSelectedPin}
        onCreateDraft={openDraft}
      />

      <div className="pointer-events-none absolute inset-0 z-[150] bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.18),transparent_34%),linear-gradient(180deg,rgba(250,248,244,0.04),rgba(250,248,244,0.14))]" />

      <div className="pointer-events-none absolute inset-x-0 top-0 z-[400] p-4 sm:p-6">
        <div className="mx-auto flex max-w-7xl justify-end">
          <div className="pointer-events-auto flex flex-wrap items-center justify-end gap-3">
            <Badge variant="secondary" className="gap-2 bg-white/82 px-4 py-3 text-sm shadow-[var(--shadow-sm)]">
              <Sparkles className="size-4" />
              {pins.length} карточек
            </Badge>
            <Button
              variant="secondary"
              size="lg"
              onClick={closeCard}
              disabled={!selectedPin && !draftPin}
            >
              Сбросить выбор
            </Button>
            <Button size="lg" onClick={() => openDraft(selectedPin?.location ?? fallbackDraftCoordinates)}>
              <Plus className="size-4" />
              Добавить метку
            </Button>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-6 right-6 z-[400] hidden sm:block">
        <div className="rounded-full bg-white/78 px-4 py-2 text-xs text-[var(--text-secondary)] shadow-[var(--shadow-sm)] backdrop-blur-sm">
          Данные карты: OpenStreetMap
        </div>
      </div>

      <PinCard
        key={`${selectedPin?.id ?? draftPin?.id ?? "closed"}-${draftPin ? "create" : "view"}`}
        pin={selectedPin ?? draftPin}
        open={Boolean(selectedPin ?? draftPin)}
        initialMode={draftPin ? "create" : "view"}
        onClose={closeCard}
        onSave={savePin}
      />
    </main>
  );
}
