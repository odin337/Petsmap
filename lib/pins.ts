import { PIN_ROLE_OPTIONS, type PinCoordinates, type PinRecord, type PinRole } from "@/types/pin";

const roleSet = new Set<PinRole>(PIN_ROLE_OPTIONS);

function sanitizeString(value: string) {
  return value.trim();
}

export function parseTitlesInput(value: string) {
  return value
    .split(/\r?\n/)
    .map((title) => title.trim())
    .filter(Boolean);
}

export function formatTitlesInput(titles: string[]) {
  return titles.join("\n");
}

export function normalizePinRecord(pin: PinRecord): PinRecord {
  const role = roleSet.has(pin.role) ? pin.role : PIN_ROLE_OPTIONS[0];

  return {
    ...pin,
    role,
    species: sanitizeString(pin.species || "Собака"),
    breed: sanitizeString(pin.breed),
    petName: sanitizeString(pin.petName),
    birthDate: pin.birthDate || "",
    city: sanitizeString(pin.city),
    contactName: sanitizeString(pin.contactName),
    description: sanitizeString(pin.description),
    titles: Array.isArray(pin.titles)
      ? pin.titles.map((title) => title.trim()).filter(Boolean)
      : [],
    gallery: Array.isArray(pin.gallery) ? pin.gallery : [],
    videoUrl: sanitizeString(pin.videoUrl || ""),
    pedigree:
      pin.pedigree && pin.pedigree.generations.length > 0
        ? {
            generations: pin.pedigree.generations.map((generation) => ({
              ...generation,
              label: sanitizeString(generation.label),
              entries: generation.entries
                .map((entry) => ({
                  ...entry,
                  name: sanitizeString(entry.name),
                  note: entry.note ? sanitizeString(entry.note) : undefined,
                }))
                .filter((entry) => entry.name),
            })),
          }
        : null,
    dysplasiaTest: pin.dysplasiaTest
      ? {
          ...pin.dysplasiaTest,
          name: sanitizeString(pin.dysplasiaTest.name),
          url: sanitizeString(pin.dysplasiaTest.url),
          description: pin.dysplasiaTest.description
            ? sanitizeString(pin.dysplasiaTest.description)
            : undefined,
        }
      : null,
  };
}

export function createPinId() {
  return globalThis.crypto.randomUUID();
}

export function createEmptyPin(location: PinCoordinates): PinRecord {
  return {
    id: createPinId(),
    role: PIN_ROLE_OPTIONS[0],
    species: "Собака",
    breed: "",
    petName: "",
    birthDate: "",
    titles: [],
    location,
    city: "",
    contactName: "",
    description: "",
    isRainbow: false,
    pedigree: {
      generations: [
        {
          label: "Родители",
          entries: [
            {
              id: createPinId(),
              name: "",
            },
            {
              id: createPinId(),
              name: "",
            },
          ],
        },
      ],
    },
    dysplasiaTest: null,
    gallery: [],
    videoUrl: "",
  };
}
