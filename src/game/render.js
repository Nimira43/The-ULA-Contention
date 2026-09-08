const WALL_COLOR = '#03da03'
const PLAYER_COLOR = '#81f681'
const DOOR_GAP = 0.24
const MARGIN = 20

export function renderRoom(ctx, canvas, rooms, roomKeyFn, player) {
  const { width, height } = canvas

  ctx.fillStyle = '#000'
  ctx.fillRect(0, 0, width, height)

  const room = rooms.get(roomKeyFn(player.roomCol, player.roomRow))
  const w = width - MARGIN * 2
  const h = height - MARGIN * 2

  ctx.strokeStyle = WALL_COLOR
  ctx.lineWidth = 4

  drawWall(ctx, MARGIN, MARGIN, MARGIN + w, MARGIN, room.doors.N, false)
  drawWall(ctx, MARGIN, MARGIN + h, MARGIN + w, MARGIN + h, room.doors.S, false)
  drawWall(ctx, MARGIN, MARGIN, MARGIN, MARGIN + h, room.doors.W, true)
  drawWall(ctx, MARGIN + w, MARGIN, MARGIN + w, MARGIN + h, room.doors.E, true)

  const px = MARGIN + player.x * w
  const py = MARGIN + player.y * h
  ctx.fillStyle = PLAYER_COLOR
  ctx.beginPath()
  ctx.arc(px, py, 10, 0, Math.PI * 2)
  ctx.fill()
}

function drawWall(ctx, x1, y1, x2, y2, hasDoor, vertical) {
  if (!hasDoor) {
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.stroke()
    return
  }

  const gapStart = 0.5 - DOOR_GAP / 2
  const gapEnd = 0.5 + DOOR_GAP / 2

  const midStart = vertical
    ? [x1, y1 + (y2 - y1) * gapStart]
    : [x1 + (x2 - x1) * gapStart, y1]
  const midEnd = vertical
    ? [x1, y1 + (y2 - y1) * gapEnd]
    : [x1 + (x2 - x1) * gapEnd, y1]

  ctx.beginPath()
  ctx.moveTo(x1, y1)
  ctx.lineTo(midStart[0], midStart[1])
  ctx.stroke()

  ctx.beginPath()
  ctx.moveTo(midEnd[0], midEnd[1])
  ctx.lineTo(x2, y2)
  ctx.stroke()
}