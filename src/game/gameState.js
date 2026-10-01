import { createObjective } from './objective.js'
 
export function createGameState(startCol, startRow) {
  return {
    currentLevel: 1,
    resistors: [],
    logicGates: [],
    busJammers: [],
    capacitors: [],
    leakZones: [],
    corruptionBalls: [],
    cpuBoss: [],
    ulaBoss: [],
    c5Boss: [],
    projectiles: [],
    pickupStockpile: { count: 0 },
    pickups: [],
    glitchTokens: [],
    status: { glitchTimer: 0 },
    gameOver: false,
    levelWon: false,
    winMessage: '',
    lives: 3,
    romObjective: createObjective(startCol, startRow, 0.5, 0.22, 100),
    psuObjective: createObjective(startCol, startRow, 0.5, 0.22, 150),
  }
}