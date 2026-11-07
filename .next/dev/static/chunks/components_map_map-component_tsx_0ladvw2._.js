(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/components/map/map-component.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MapComponent",
    ()=>MapComponent
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$maplibre$2d$gl$2f$dist$2f$maplibre$2d$gl$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/maplibre-gl/dist/maplibre-gl.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
const defaultCenter = [
    37.618423,
    55.751244
];
const mapStyle = {
    version: 8,
    sources: {
        osm: {
            type: "raster",
            tiles: [
                "https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            ],
            tileSize: 256,
            attribution: "OpenStreetMap"
        }
    },
    layers: [
        {
            id: "osm",
            type: "raster",
            source: "osm"
        }
    ]
};
function shouldIgnoreMapClick(target) {
    return target instanceof HTMLElement && Boolean(target.closest("[data-map-marker='true'], .maplibregl-ctrl, .maplibregl-popup"));
}
function createMarkerElement({ active = false, draft = false }) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = [
        "club-map-marker",
        active ? "club-map-marker--active" : "",
        draft ? "club-map-marker--draft" : ""
    ].filter(Boolean).join(" ");
    button.setAttribute("data-map-marker", "true");
    button.setAttribute("aria-label", draft ? "Новая метка" : "Метка на карте");
    button.innerHTML = '<span class="club-map-marker__pin"><span class="club-map-marker__center"></span></span>';
    return button;
}
function MapComponent({ pins, activePinId, draftPosition, onSelectPin, onCreateDraft }) {
    _s();
    const containerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const mapRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const markerRefs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])([]);
    const onCreateDraftRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(onCreateDraft);
    const onSelectPinRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(onSelectPin);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MapComponent.useEffect": ()=>{
            onCreateDraftRef.current = onCreateDraft;
        }
    }["MapComponent.useEffect"], [
        onCreateDraft
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MapComponent.useEffect": ()=>{
            onSelectPinRef.current = onSelectPin;
        }
    }["MapComponent.useEffect"], [
        onSelectPin
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MapComponent.useEffect": ()=>{
            if (!containerRef.current || mapRef.current) {
                return;
            }
            const map = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$maplibre$2d$gl$2f$dist$2f$maplibre$2d$gl$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].Map({
                container: containerRef.current,
                style: mapStyle,
                center: defaultCenter,
                zoom: 5.15,
                maxZoom: 14,
                minZoom: 3,
                attributionControl: false,
                dragRotate: false,
                pitchWithRotate: false,
                touchPitch: false
            });
            map.addControl(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$maplibre$2d$gl$2f$dist$2f$maplibre$2d$gl$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].NavigationControl({
                showCompass: false,
                visualizePitch: false
            }), "top-left");
            map.on("click", {
                "MapComponent.useEffect": (event)=>{
                    if (shouldIgnoreMapClick(event.originalEvent.target)) {
                        return;
                    }
                    onCreateDraftRef.current({
                        lat: event.lngLat.lat,
                        lng: event.lngLat.lng
                    });
                }
            }["MapComponent.useEffect"]);
            mapRef.current = map;
            return ({
                "MapComponent.useEffect": ()=>{
                    markerRefs.current.forEach({
                        "MapComponent.useEffect": (marker)=>marker.remove()
                    }["MapComponent.useEffect"]);
                    markerRefs.current = [];
                    map.remove();
                    mapRef.current = null;
                }
            })["MapComponent.useEffect"];
        }
    }["MapComponent.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MapComponent.useEffect": ()=>{
            const map = mapRef.current;
            if (!map) {
                return;
            }
            markerRefs.current.forEach({
                "MapComponent.useEffect": (marker)=>marker.remove()
            }["MapComponent.useEffect"]);
            markerRefs.current = [];
            pins.forEach({
                "MapComponent.useEffect": (pin)=>{
                    const element = createMarkerElement({
                        active: pin.id === activePinId
                    });
                    element.addEventListener("click", {
                        "MapComponent.useEffect": (event)=>{
                            event.preventDefault();
                            event.stopPropagation();
                            onSelectPinRef.current(pin.id);
                        }
                    }["MapComponent.useEffect"]);
                    const marker = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$maplibre$2d$gl$2f$dist$2f$maplibre$2d$gl$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].Marker({
                        element,
                        anchor: "bottom"
                    }).setLngLat([
                        pin.location.lng,
                        pin.location.lat
                    ]).addTo(map);
                    markerRefs.current.push(marker);
                }
            }["MapComponent.useEffect"]);
            if (draftPosition) {
                const draftMarker = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$maplibre$2d$gl$2f$dist$2f$maplibre$2d$gl$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].Marker({
                    element: createMarkerElement({
                        draft: true
                    }),
                    anchor: "bottom"
                }).setLngLat([
                    draftPosition.lng,
                    draftPosition.lat
                ]).addTo(map);
                markerRefs.current.push(draftMarker);
            }
        }
    }["MapComponent.useEffect"], [
        pins,
        activePinId,
        draftPosition
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MapComponent.useEffect": ()=>{
            const map = mapRef.current;
            if (!map) {
                return;
            }
            if (draftPosition) {
                map.flyTo({
                    center: [
                        draftPosition.lng,
                        draftPosition.lat
                    ],
                    zoom: Math.max(map.getZoom(), 7.4),
                    duration: 700,
                    essential: true
                });
                return;
            }
            const selectedPin = pins.find({
                "MapComponent.useEffect.selectedPin": (pin)=>pin.id === activePinId
            }["MapComponent.useEffect.selectedPin"]);
            if (!selectedPin) {
                return;
            }
            map.flyTo({
                center: [
                    selectedPin.location.lng,
                    selectedPin.location.lat
                ],
                zoom: Math.max(map.getZoom(), 7.2),
                duration: 650,
                essential: true
            });
        }
    }["MapComponent.useEffect"], [
        activePinId,
        draftPosition,
        pins
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: containerRef,
        className: "h-full w-full"
    }, void 0, false, {
        fileName: "[project]/components/map/map-component.tsx",
        lineNumber: 213,
        columnNumber: 10
    }, this);
}
_s(MapComponent, "Lz705NjKI/ATGflx2sLzi6iYcHI=");
_c = MapComponent;
var _c;
__turbopack_context__.k.register(_c, "MapComponent");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/map/map-component.tsx [app-client] (ecmascript, next/dynamic entry)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/components/map/map-component.tsx [app-client] (ecmascript)"));
}),
]);

//# sourceMappingURL=components_map_map-component_tsx_0ladvw2._.js.map