const clamp = (v, min, max) => Math.min(max, Math.max(min, v))

export function createPlayer(startCol, startRow) {
  return {
    roomCol: startCol,
    roomRow: startRow,
    x: 0.5,
    y: 0.5,
    speed: 0.02,
    facingX: 0,
    facingY: 1,
    health: 100,
  }
}

export function damagePlayer(player, amount) {
  player.health = Math.max(0, player.health - amount)
}

export function resetPlayerForLevel(player, startCol, startRow) {
  player.roomCol = startCol
  player.roomRow = startRow
  player.x = 0.5
  player.y = 0.5
  player.facingX = 0
  player.facingY = 1
  player.health = 100
}

export function movePlayer(player, input) {
  let dx = 0
  let dy = 0
  if (input.up) dy -= 1
  if (input.down) dy += 1
  if (input.left) dx -= 1
  if (input.right) dx += 1

  if (dx !== 0 || dy !== 0) {
    const len = Math.hypot(dx, dy)
    player.facingX = dx / len
    player.facingY = dy / len
  }

  if (dx !== 0 && dy !== 0) {
    dx *= Math.SQRT1_2
    dy *= Math.SQRT1_2
  }

  player.x = clamp(player.x + dx * player.speed, 0, 1)
  player.y = clamp(player.y + dy * player.speed, 0, 1)
}