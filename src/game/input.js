export const KEY_MAP = {
  ArrowUp: 'up', w: 'up', W: 'up',
  ArrowDown: 'down', s: 'down', S: 'down',
  ArrowLeft: 'left', a: 'left', A: 'left',
  ArrowRight: 'right', d: 'right', D: 'right',
}

export function createInputState() {
  return { up: false, down: false, left: false, right: false, fire: false }
}

export function isDoorBlocked(busJammers, col, row, dir) {
  return busJammers.some(
    (j) => j.hp > 0 && j.roomCol === col && j.roomRow === row && j.doorSide === dir
  )
}
