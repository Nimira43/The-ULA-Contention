import { createObjective } from './objective.js'
import {
  spawnSwarm,
  spawnRamLeakers,
  spawnFastResistors,
  spawnEliteResistors,
} from './enemies.js'
import { spawnHealthPickups } from './pickups.js'
import { spawnGlitchTokens } from './hazards.js'
import { spawnLogicGates } from './logicgates.js'
import { spawnBusJammer } from './busjammer.js'
import { spawnCapacitors, spawnHostileCapacitors } from './capacitors.js'
import { spawnLeakZones } from './leakzones.js'
import { spawnCorruptionBalls } from './corruptionballs.js'
import { spawnCpuBoss } from './cpuboss.js'
import { spawnUlaBoss } from './ulaboss.js'
import { spawnC5Boss } from './c5boss.js'

function keepAwayFromCentre(entities, minDist = 0.22, cx = 0.5, cy = 0.5) {
  for (const e of entities) {
    const dist = Math.hypot(e.x - cx, e.y - cy)
    if (dist < minDist) {
      const angle = Math.random() * Math.PI * 2
      e.x = Math.min(0.9, Math.max(0.1, cx + Math.cos(angle) * minDist))
      e.y = Math.min(0.9, Math.max(0.1, cy + Math.sin(angle) * minDist))
    }
  }
}

function startLevel1Fight(state, ctx) {
  const { startCol, startRow } = ctx
  state.romObjective = createObjective(startCol, startRow, 0.5, 0.22, 100)
  state.resistors = spawnSwarm(5, startCol, startRow)
  state.pickups = spawnHealthPickups(3, startCol, startRow)
  state.glitchTokens = spawnGlitchTokens(2, startCol, startRow)
}

function startLevel2(state, ctx) {
  const { startCol, startRow, rooms, roomKeyFn } = ctx
  state.logicGates = spawnLogicGates(3, startCol, startRow)
  state.capacitors = spawnCapacitors(2, startCol, startRow)

  const startRoom = rooms.get(roomKeyFn(startCol, startRow))
  const doorSide = Object.keys(startRoom.doors).find((d) => startRoom.doors[d])
  state.busJammers = doorSide ? [spawnBusJammer(startCol, startRow, doorSide)] : []
}

function startLevel3(state, ctx) {
  const { startCol, startRow } = ctx

  state.logicGates = spawnLogicGates(2, startCol, startRow, {
    kind: 'wraith',
    chargedDuration: 90,
    dischargedDuration: 150,
    burstShots: 1,
  })
  state.resistors = spawnRamLeakers(4, startCol, startRow)
  state.leakZones = spawnLeakZones(3, startCol, startRow)
  state.pickups = spawnHealthPickups(2, startCol, startRow)
}

function startLevel4(state, ctx) {
  const { startCol, startRow } = ctx
  state.resistors = spawnFastResistors(3, startCol, startRow)
  keepAwayFromCentre(state.resistors)
  state.capacitors = spawnHostileCapacitors(1, startCol, startRow)
  keepAwayFromCentre(state.capacitors)
  state.corruptionBalls = spawnCorruptionBalls(3, startCol, startRow)
  state.pickups = spawnHealthPickups(2, startCol, startRow)
}

function startLevel5(state, ctx) {
  const { startCol, startRow } = ctx
  state.cpuBoss = spawnCpuBoss(startCol, startRow)
  state.pickups = spawnHealthPickups(2, startCol, startRow)
}

function startLevel6(state, ctx) {
  const { startCol, startRow } = ctx
  state.logicGates = spawnLogicGates(3, startCol, startRow, {
    kind: 'phantom',
    chargedDuration: 100,
    dischargedDuration: 140,
    burstShots: 2,
  })
  state.capacitors = spawnCapacitors(2, startCol, startRow)
  state.pickups = spawnHealthPickups(2, startCol, startRow)
}

function startLevel7(state, ctx) {
  const { startCol, startRow } = ctx
  state.resistors = spawnRamLeakers(3, startCol, startRow)
  state.leakZones = spawnLeakZones(2, startCol, startRow)
  state.capacitors = spawnHostileCapacitors(2, startCol, startRow)
  keepAwayFromCentre(state.capacitors)
  state.pickups = spawnHealthPickups(2, startCol, startRow)
}

function startLevel8(state, ctx) {
  const { startCol, startRow } = ctx
  state.psuObjective = createObjective(startCol, startRow, 0.5, 0.22, 150)
  state.resistors = spawnEliteResistors(4, startCol, startRow)
  keepAwayFromCentre(state.resistors)
  state.pickups = spawnHealthPickups(3, startCol, startRow)
}

function startLevel9(state, ctx) {
  const { startCol, startRow } = ctx
  state.ulaBoss = spawnUlaBoss(startCol, startRow)
  state.resistors = spawnSwarm(2, startCol, startRow)
  state.pickups = spawnHealthPickups(3, startCol, startRow)
}

function startLevel10(state, ctx) {
  const { startCol, startRow } = ctx
  state.c5Boss = spawnC5Boss(startCol, startRow)
  state.pickups = spawnHealthPickups(4, startCol, startRow)
  state.lives = 3
}

const LEVEL_STARTERS = {
  1: startLevel1Fight,
  2: startLevel2,
  3: startLevel3,
  4: startLevel4,
  5: startLevel5,
  6: startLevel6,
  7: startLevel7,
  8: startLevel8,
  9: startLevel9,
  10: startLevel10,
}

function clearAllEncounters(state) {
  state.resistors = []
  state.pickups = []
  state.glitchTokens = []
  state.logicGates = []
  state.busJammers = []
  state.capacitors = []
  state.leakZones = []
  state.corruptionBalls = []
  state.cpuBoss = []
  state.ulaBoss = []
  state.c5Boss = []
  state.romObjective.active = false
  state.psuObjective.active = false
}

export function spawnLevelEnemies(state, ctx) {
  clearAllEncounters(state)
  ctx.player.health = 100
  state.gameOver = false
  state.levelWon = false

  const starter = LEVEL_STARTERS[state.currentLevel]
  if (starter) starter(state, ctx)
}