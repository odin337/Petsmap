"use client";

import maplibregl, {
  type Map as MapLibreMap,
  type Marker as MapLibreMarker,
  type StyleSpecification,
} from "maplibre-gl";
import { useEffect, useRef } from "react";

import type { PinCoordinates, PinRecord } from "@/types/pin";

interface MapComponentProps {
  pins: PinRecord[];
  activePinId: string | null;
  draftPosition: PinCoordinates | null;
  onSelectPin: (id: string) => void;
  onCreateDraft: (coordinates: PinCoordinates) => void;
}

const defaultCenter: [number, number] = [37.618423, 55.751244];
const mapStyle: StyleSpecification = {
  version: 8,
  sources: {
    osm: {
      type: "raster",
      tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
      tileSize: 256,
      attribution: "OpenStreetMap",
    },
  },
  layers: [
    {
      id: "osm",
      type: "raster",
      source: "osm",
    },
  ],
};

function shouldIgnoreMapClick(target: EventTarget | null) {
  return (
    target instanceof HTMLElement &&
    Boolean(
      target.closest("[data-map-marker='true'], .maplibregl-ctrl, .maplibregl-popup"),
    )
  );
}

function createMarkerElement({
  active = false,
  draft = false,
}: {
  active?: boolean;
  draft?: boolean;
}) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = [
    "club-map-marker",
    active ? "club-map-marker--active" : "",
    draft ? "club-map-marker--draft" : "",
  ]
    .filter(Boolean)
    .join(" ");
  button.setAttribute("data-map-marker", "true");
  button.setAttribute("aria-label", draft ? "Новая метка" : "Метка на карте");
  button.innerHTML =
    '<span class="club-map-marker__pin"><span class="club-map-marker__center"></span></span>';

  return button;
}

export function MapComponent({
  pins,
  activePinId,
  draftPosition,
  onSelectPin,
  onCreateDraft,
}: MapComponentProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const markerRefs = useRef<MapLibreMarker[]>([]);
  const onCreateDraftRef = useRef(onCreateDraft);
  const onSelectPinRef = useRef(onSelectPin);

  useEffect(() => {
    onCreateDraftRef.current = onCreateDraft;
  }, [onCreateDraft]);

  useEffect(() => {
    onSelectPinRef.current = onSelectPin;
  }, [onSelectPin]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) {
      return;
    }

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: mapStyle,
      center: defaultCenter,
      zoom: 5.15,
      maxZoom: 14,
      minZoom: 3,
      attributionControl: false,
      dragRotate: false,
      pitchWithRotate: false,
      touchPitch: false,
    });

    map.addControl(
      new maplibregl.NavigationControl({
        showCompass: false,
        visualizePitch: false,
      }),
      "top-left",
    );

    map.on("click", (event) => {
      if (shouldIgnoreMapClick(event.originalEvent.target)) {
        return;
      }

      onCreateDraftRef.current({
        lat: event.lngLat.lat,
        lng: event.lngLat.lng,
      });
    });

    mapRef.current = map;

    return () => {
      markerRefs.current.forEach((marker) => marker.remove());
      markerRefs.current = [];
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;

    if (!map) {
      return;
    }

    markerRefs.current.forEach((marker) => marker.remove());
    markerRefs.current = [];

    pins.forEach((pin) => {
      const element = createMarkerElement({ active: pin.id === activePinId });
      element.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        onSelectPinRef.current(pin.id);
      });

      const marker = new maplibregl.Marker({
        element,
        anchor: "bottom",
      })
        .setLngLat([pin.location.lng, pin.location.lat])
        .addTo(map);

      markerRefs.current.push(marker);
    });

    if (draftPosition) {
      const draftMarker = new maplibregl.Marker({
        element: createMarkerElement({ draft: true }),
        anchor: "bottom",
      })
        .setLngLat([draftPosition.lng, draftPosition.lat])
        .addTo(map);

      markerRefs.current.push(draftMarker);
    }
  }, [pins, activePinId, draftPosition]);

  useEffect(() => {
    const map = mapRef.current;

    if (!map) {
      return;
    }

    if (draftPosition) {
      map.flyTo({
        center: [draftPosition.lng, draftPosition.lat],
        zoom: Math.max(map.getZoom(), 7.4),
        duration: 700,
        essential: true,
      });

      return;
    }

    const selectedPin = pins.find((pin) => pin.id === activePinId);

    if (!selectedPin) {
      return;
    }

    map.flyTo({
      center: [selectedPin.location.lng, selectedPin.location.lat],
      zoom: Math.max(map.getZoom(), 7.2),
      duration: 650,
      essential: true,
    });
  }, [activePinId, draftPosition, pins]);

  return <div ref={containerRef} className="h-full w-full" />;
}
