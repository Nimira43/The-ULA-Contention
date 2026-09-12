export function createObjective(roomCol, roomRow, x, y, maxHp) {
  return { roomCol, roomRow, x, y, maxHp, hp: maxHp, active: true }
}

export function damageObjective(objective, amount) {
  if (!objective.active) return
  objective.hp = Math.max(0, objective.hp - amount)
}

export function objectiveHealthPercent(objective) {
  return Math.round((objective.hp / objective.maxHp) * 100)
}