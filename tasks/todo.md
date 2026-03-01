# OpenNeo 2D Office Pivot — Implementation Progress

## Phase 1: Foundation ✅
- [x] Install pixi.js v8, zustand
- [x] Create `lib/game/types.ts` — all type definitions
- [x] Create `lib/game/adapter.ts` — Agent ↔ OfficeAgent conversion
- [x] Create `lib/game/store.ts` — Zustand game store with persist
- [x] Create `app/office/layout.tsx` + `page.tsx` — route scaffolding
- [x] Create `lib/game/engine/PixiApp.ts` — PIXI.Application wrapper
- [x] Create `components/office/OfficeCanvas.tsx` — canvas mount
- [x] Verify: Build passes, `/office` route registered

## Phase 2: Tile World ✅
- [x] Create `lib/game/engine/TileMapRenderer.ts` — room rendering with colored floors
- [x] Create `lib/game/rooms.ts` — 9 room definitions with grid bounds and furniture
- [x] Create `lib/game/engine/Camera.ts` — pan/zoom controls (wheel + shift-drag)
- [x] Create `lib/game/engine/AgentRenderer.ts` — placeholder colored sprites
- [x] Create `lib/game/engine/FurnitureRenderer.ts` — furniture placeholders
- [x] Create `lib/game/engine/InteractionManager.ts` — click detection
- [x] Create `lib/game/sprites.ts` — color/label mappings per role

## Phase 3: React UI Overlays ✅
- [x] Create `components/office/GameHUD.tsx` — balance, date, time controls
- [x] Create `components/office/AgentPanel.tsx` — agent detail sheet
- [x] Create `components/office/HireMenu.tsx` — hire new agent dialog
- [x] Create `components/office/EventNotification.tsx` — event toast
- [x] Create `components/mode-toggle.tsx` — Office/Dashboard switch
- [x] Modify `components/dashboard-header.tsx` — add ModeToggle
- [x] Add `office.*` keys to all 4 i18n locale files (EN, JA, ZH-CN, ZH-TW)

## Phase 4: Game Logic ✅
- [x] Create `lib/game/economy.ts` — revenue/cost simulation per tick
- [x] Create `lib/game/engine/GameLoop.ts` — interval-based tick system
- [x] Create `hooks/use-game-tick.ts` — React bridge for game ticks
- [x] Create `lib/game/events.ts` — random events, milestones
- [x] Create `components/office/RoomManager.tsx` — unlock rooms dialog
- [x] Implement agent leveling (XP, stats improvement per tick)
- [x] Mood system with random fluctuations

## Phase 5: Real API Layer ✅
- [x] Create `lib/game/api/types.ts` — TaskExecutor interface
- [x] Create `lib/game/api/simulation.ts` — mock executor
- [x] Create `lib/game/api/executor.ts` — mode-aware factory
- [x] Create `lib/game/api/real/base.ts` — real API skeleton
- [x] Create `lib/game/sync.ts` — office ↔ dashboard sync

## Phase 6: Polish & Assets (TODO)
- [ ] Create/commission pixel art sprites (7 agent types)
- [ ] Create office tileset + tilemap in Tiled
- [ ] Implement sprite animations (idle, walk, work cycles)
- [ ] Add ambient effects (speech bubbles, typing, coffee steam)
- [ ] Dragon Quest-style dialog boxes for interactions
- [ ] Performance optimization (sprite pooling, off-screen culling)
- [ ] Responsive design for different window sizes
- [ ] Comprehensive testing
- [ ] OKR Editor component
- [ ] Finance Dashboard component
- [ ] MiniMap component
- [ ] Time Controls standalone component

## Review

### Build Status
- `pnpm build` ✅ — all routes compile, `/office` route present
- `pnpm test:run` ✅ — 46/46 tests pass (no regressions)

### Files Created (28 new files)
**Core types & state**: `lib/game/types.ts`, `lib/game/store.ts`, `lib/game/adapter.ts`, `lib/game/rooms.ts`, `lib/game/sprites.ts`, `lib/game/economy.ts`, `lib/game/events.ts`, `lib/game/sync.ts`
**Engine**: `lib/game/engine/PixiApp.ts`, `lib/game/engine/TileMapRenderer.ts`, `lib/game/engine/Camera.ts`, `lib/game/engine/AgentRenderer.ts`, `lib/game/engine/FurnitureRenderer.ts`, `lib/game/engine/InteractionManager.ts`, `lib/game/engine/GameLoop.ts`
**API layer**: `lib/game/api/types.ts`, `lib/game/api/simulation.ts`, `lib/game/api/executor.ts`, `lib/game/api/real/base.ts`
**Components**: `components/office/OfficeView.tsx`, `components/office/OfficeCanvas.tsx`, `components/office/GameHUD.tsx`, `components/office/AgentPanel.tsx`, `components/office/HireMenu.tsx`, `components/office/EventNotification.tsx`, `components/office/RoomManager.tsx`, `components/mode-toggle.tsx`
**Routes**: `app/office/layout.tsx`, `app/office/page.tsx`
**Hooks**: `hooks/use-office-engine.ts`, `hooks/use-game-tick.ts`

### Files Modified (6 files)
- `package.json` — added pixi.js v8, zustand
- `app/globals.css` — added pixelated rendering CSS
- `components/dashboard-header.tsx` — added ModeToggle
- `lib/i18n/locales/en.json` — added office.* keys
- `lib/i18n/locales/ja.json` — added office.* keys
- `lib/i18n/locales/zh-CN.json` — added office.* keys
- `lib/i18n/locales/zh-TW.json` — added office.* keys
