import { objectiveHealthPercent } from './objective.js'
import { cpuBossStabilityPercent } from './cpuboss.js'
import { ulaBossHealthPercent } from './ulaboss.js'
import { c5BossHealthPercent } from './c5boss.js'

const alive = (list) => list.filter((e) => e.hp > 0).length

export const LEVEL_RULES = {
  1: {
    winMessage: 'ROM SECURED!',
    isComplete: (s) => s.resistors.length === 0,
    remainingLabel: 'Hostiles',
    remaining: (s) => s.resistors.length,
    gauge: (s) => ({ label: 'ROM Health', value: `${objectiveHealthPercent(s.romObjective)}%` }),
  },
  2: {
    winMessage: 'ADDRESS BUS CLEAR!',
    isComplete: (s) => s.logicGates.length === 0 && s.busJammers.length === 0,
    remainingLabel: 'Hostiles',
    remaining: (s) => s.logicGates.length + s.busJammers.length,
  },
  3: {
    winMessage: 'REGISTER STABLE!',
    isComplete: (s) => s.resistors.length === 0 && s.logicGates.length === 0,
    remainingLabel: 'Hostiles',
    remaining: (s) => s.resistors.length + s.logicGates.length,
  },
  4: {
    winMessage: 'CORRUPTION CLEARED!',
    isComplete: (s) => s.corruptionBalls.length === 0,
    remainingLabel: 'Corruption',
    remaining: (s) => s.corruptionBalls.length,
  },
  5: {
    winMessage: 'CPU STABILISED!',
    isBoss: true,
    isComplete: (s) => s.cpuBoss.length === 0,
    remainingLabel: 'Sections',
    remaining: (s) => alive(s.cpuBoss),
    gauge: (s) => ({ label: 'CPU Stability', value: `${cpuBossStabilityPercent(s.cpuBoss)}%` }),
  },
  6: {
    winMessage: 'COLOUR CLASH CLEARED!',
    isComplete: (s) => s.logicGates.length === 0,
    remainingLabel: 'Hostiles',
    remaining: (s) => s.logicGates.length,
  },
  7: {
    winMessage: 'UPPER RAM SECURED!',
    isComplete: (s) => s.resistors.length === 0,
    remainingLabel: 'Hostiles',
    remaining: (s) => s.resistors.length,
  },
  8: {
    winMessage: 'PSU SECURED!',
    isComplete: (s) => s.resistors.length === 0,
    remainingLabel: 'Raiders',
    remaining: (s) => s.resistors.length,
    gauge: (s) => ({ label: 'PSU Health', value: `${objectiveHealthPercent(s.psuObjective)}%` }),
  },
  9: {
    winMessage: 'ULA DEFEATED!',
    isBoss: true,
    isComplete: (s) => s.ulaBoss.length === 0,
    remainingLabel: 'Sections',
    remaining: (s) => alive(s.ulaBoss),
    gauge: (s) => ({ label: 'ULA Integrity', value: `${ulaBossHealthPercent(s.ulaBoss)}%` }),
  },
  10: {
    winMessage: 'C5 DESTROYED — YOU WIN!',
    isBoss: true,
    usesLives: true,
    isComplete: (s) => s.c5Boss.length > 0 && s.c5Boss.every((t) => t.hp <= 0),
    remainingLabel: 'Turrets',
    remaining: (s) => alive(s.c5Boss),
    gauge: (s) => ({ label: 'C5 Integrity', value: `${c5BossHealthPercent(s.c5Boss)}%` }),
  },
}

export const FINAL_LEVEL = Math.max(...Object.keys(LEVEL_RULES).map(Number))
