import type { Room, RoomId, FurnitureItem } from './types'

// ─── Room definitions ───
// Grid coordinates are in 16x16 tile units
// The full office map is 40x30 tiles (640x480 at 1x scale)

function desk(id: string, x: number, y: number): FurnitureItem {
  return { id, type: 'desk', gridPosition: { x, y }, gridSize: { width: 2, height: 1 } }
}

function computer(id: string, x: number, y: number): FurnitureItem {
  return { id, type: 'computer', gridPosition: { x, y }, gridSize: { width: 1, height: 1 } }
}

function whiteboard(id: string, x: number, y: number): FurnitureItem {
  return { id, type: 'whiteboard', gridPosition: { x, y }, gridSize: { width: 2, height: 1 } }
}

function plant(id: string, x: number, y: number): FurnitureItem {
  return { id, type: 'plant', gridPosition: { x, y }, gridSize: { width: 1, height: 1 } }
}

export const DEFAULT_ROOMS: Room[] = [
  {
    id: 'lobby',
    name: 'Lobby',
    unlocked: true,
    unlockCost: 0,
    gridBounds: { x: 0, y: 0, width: 10, height: 8 },
    capacity: 2,
    furniture: [
      plant('lobby-plant-1', 1, 1),
      plant('lobby-plant-2', 8, 1),
    ],
  },
  {
    id: 'dev',
    name: 'Development',
    unlocked: true,
    unlockCost: 0,
    gridBounds: { x: 11, y: 0, width: 14, height: 8 },
    capacity: 4,
    furniture: [
      desk('dev-desk-1', 12, 2),
      computer('dev-comp-1', 12, 2),
      desk('dev-desk-2', 12, 4),
      computer('dev-comp-2', 12, 4),
      desk('dev-desk-3', 18, 2),
      computer('dev-comp-3', 18, 2),
      desk('dev-desk-4', 18, 4),
      computer('dev-comp-4', 18, 4),
      whiteboard('dev-wb-1', 14, 0),
    ],
  },
  {
    id: 'sales',
    name: 'Sales & Marketing',
    unlocked: true,
    unlockCost: 0,
    gridBounds: { x: 26, y: 0, width: 14, height: 8 },
    capacity: 4,
    furniture: [
      desk('sales-desk-1', 28, 2),
      computer('sales-comp-1', 28, 2),
      desk('sales-desk-2', 28, 4),
      computer('sales-comp-2', 28, 4),
      desk('sales-desk-3', 34, 2),
      computer('sales-comp-3', 34, 2),
      whiteboard('sales-wb-1', 30, 0),
    ],
  },
  {
    id: 'finance',
    name: 'Finance',
    unlocked: false,
    unlockCost: 25000,
    gridBounds: { x: 0, y: 9, width: 10, height: 8 },
    capacity: 2,
    furniture: [
      desk('fin-desk-1', 2, 11),
      computer('fin-comp-1', 2, 11),
      desk('fin-desk-2', 2, 13),
      computer('fin-comp-2', 2, 13),
    ],
  },
  {
    id: 'hr',
    name: 'Human Resources',
    unlocked: false,
    unlockCost: 20000,
    gridBounds: { x: 11, y: 9, width: 10, height: 8 },
    capacity: 2,
    furniture: [
      desk('hr-desk-1', 13, 11),
      computer('hr-comp-1', 13, 11),
      plant('hr-plant-1', 19, 9),
    ],
  },
  {
    id: 'support',
    name: 'Support',
    unlocked: false,
    unlockCost: 15000,
    gridBounds: { x: 22, y: 9, width: 10, height: 8 },
    capacity: 3,
    furniture: [
      desk('sup-desk-1', 24, 11),
      computer('sup-comp-1', 24, 11),
      desk('sup-desk-2', 24, 13),
      computer('sup-comp-2', 24, 13),
    ],
  },
  {
    id: 'research',
    name: 'Research Lab',
    unlocked: false,
    unlockCost: 30000,
    gridBounds: { x: 33, y: 9, width: 7, height: 8 },
    capacity: 2,
    furniture: [
      desk('res-desk-1', 35, 11),
      computer('res-comp-1', 35, 11),
      whiteboard('res-wb-1', 34, 9),
    ],
  },
  {
    id: 'executive',
    name: 'Executive Office',
    unlocked: false,
    unlockCost: 50000,
    gridBounds: { x: 0, y: 18, width: 12, height: 8 },
    capacity: 1,
    furniture: [
      desk('exec-desk-1', 4, 20),
      computer('exec-comp-1', 4, 20),
      plant('exec-plant-1', 1, 18),
      plant('exec-plant-2', 10, 18),
    ],
  },
  {
    id: 'breakroom',
    name: 'Break Room',
    unlocked: true,
    unlockCost: 0,
    gridBounds: { x: 13, y: 18, width: 8, height: 8 },
    capacity: 6,
    furniture: [
      { id: 'break-coffee', type: 'coffee', gridPosition: { x: 15, y: 18 }, gridSize: { width: 1, height: 1 } },
      plant('break-plant-1', 19, 18),
    ],
  },
]

export function getRoomById(rooms: Room[], id: RoomId): Room | undefined {
  return rooms.find((r) => r.id === id)
}

export function getUnlockedRooms(rooms: Room[]): Room[] {
  return rooms.filter((r) => r.unlocked)
}
