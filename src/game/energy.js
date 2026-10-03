const MAX_ENERGY = 100
const SHOT_COST = 5
const REGEN_PER_FRAME = 0.3
const BOSS_REGEN_PER_FRAME = 0.55

export function createEnergy() {
  return { value: MAX_ENERGY }
}

export function refillEnergy(energy) {
  energy.value = MAX_ENERGY
}

export function canFire(energy) {
  return energy.value >= SHOT_COST
}

export function spendShot(energy) {
  energy.value = Math.max(0, energy.value - SHOT_COST)
}

export function regenEnergy(energy, isBoss) {
  const rate = isBoss ? BOSS_REGEN_PER_FRAME : REGEN_PER_FRAME
  energy.value = Math.min(MAX_ENERGY, energy.value + rate)
}
