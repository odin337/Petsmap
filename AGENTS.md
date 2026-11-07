# AGENTS

## Project Summary

`PetsMap` is a Next.js 16 App Router application for the National Breed Club "Честный знак". The MVP is a client-heavy interactive map with a MapLibre-based raster basemap, mock data, modal pin cards, SEO-friendly headings, pedigree visualization, media sections, and safe VK/RuTube video embedding.

## Key Files

| Path | Purpose |
|---|---|
| `app/page.tsx` | Server entry point, resolves query params and injects initial state into the client map shell |
| `components/map/map-page-client.tsx` | Main client screen: full-screen map, URL state, create/select flows, modal orchestration |
| `components/map/map-component.tsx` | MapLibre map with raster OpenStreetMap layer, custom markers, and click-to-create draft logic |
| `components/pins/pin-card.tsx` | Modal card with `view/edit/create` modes and SEO-rendered headings |
| `components/pins/pin-form.tsx` | Edit/create form for all pin fields, including pedigree, media, and video URL validation |
| `components/pins/pedigree-tree.tsx` | Visual pedigree grid with graceful fallback to structured content |
| `lib/video/embed.ts` | Safe VK Video / RuTube parsing and trusted iframe URL generation |
| `lib/mock-data.ts` | Mock data loader and normalization layer |
| `types/pin.ts` | Core domain model for map pins and card sections |
| `data/mockData.json` | MVP fixture dataset used by the map and modal |

## Workflow Notes

- Use `npm run dev -- --port 3001` when `3000` is occupied by another local project.
- Use `npm run lint` before finishing.
- Use `npm run build` to validate App Router, TypeScript, and production compatibility.
- The map layer is powered by `maplibre-gl` with a raster OpenStreetMap style object; keep the user-facing source badge in sync if the style changes.
- Keep video embeds restricted to trusted VK/RuTube formats. Do not render arbitrary iframe URLs.
- Keep document links restricted to valid `http/https` URLs.
- Gallery preview currently supports HTTPS links from Unsplash demo hosts only; future storage-backed uploads should replace this.
