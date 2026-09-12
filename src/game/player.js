const DOOR_WIDTH = 0.24
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
  }
}

export function movePlayer(player, input, rooms, roomKeyFn) {
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

  let nx = player.x + dx * player.speed
  let ny = player.y + dy * player.speed

  const room = rooms.get(roomKeyFn(player.roomCol, player.roomRow))
  const doorMin = 0.5 - DOOR_WIDTH / 2
  const doorMax = 0.5 + DOOR_WIDTH / 2
  const inDoorRange = (v) => v > doorMin && v < doorMax

  if (nx < 0) {
    if (room.doors.W && inDoorRange(ny)) {
      player.roomCol -= 1
      nx = 1 - player.speed
    } else {
      nx = 0
    }
  } else if (nx > 1) {
    if (room.doors.E && inDoorRange(ny)) {
      player.roomCol += 1
      nx = player.speed
    } else {
      nx = 1
    }
  }

  if (ny < 0) {
    if (room.doors.N && inDoorRange(nx)) {
      player.roomRow -= 1
      ny = 1 - player.speed
    } else {
      ny = 0
    }
  } else if (ny > 1) {
    if (room.doors.S && inDoorRange(nx)) {
      player.roomRow += 1
      ny = player.speed
    } else {
      ny = 1
    }
  }

  player.x = clamp(nx, 0, 1)
  player.y = clamp(ny, 0, 1)
}