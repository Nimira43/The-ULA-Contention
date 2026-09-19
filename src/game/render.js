const WALL_COLOUR = '#03da03'
const PLAYER_COLOUR = '#81f681'
const DOOR_GAP = 0.24
const MARGIN = 20
const CHIP_COLOURS = { safe: '#03da03', danger: '#ff3b3b' }

export function renderRoom(ctx, canvas, rooms, roomKeyFn, player) {
  const { width, height } = canvas

  ctx.fillStyle = '#000'
  ctx.fillRect(0, 0, width, height)

  const room = rooms.get(roomKeyFn(player.roomCol, player.roomRow))
  const w = width - MARGIN * 2
  const h = height - MARGIN * 2

  ctx.strokeStyle = WALL_COLOUR
  ctx.lineWidth = 4

  drawWall(ctx, MARGIN, MARGIN, MARGIN + w, MARGIN, room.doors.N, false)
  drawWall(ctx, MARGIN, MARGIN + h, MARGIN + w, MARGIN + h, room.doors.S, false)
  drawWall(ctx, MARGIN, MARGIN, MARGIN, MARGIN + h, room.doors.W, true)
  drawWall(ctx, MARGIN + w, MARGIN, MARGIN + w, MARGIN + h, room.doors.E, true)

  const px = MARGIN + player.x * w
  const py = MARGIN + player.y * h
  ctx.fillStyle = PLAYER_COLOUR
  ctx.beginPath()
  ctx.arc(px, py, 10, 0, Math.PI * 2)
  ctx.fill()
}

export function renderChipProps(ctx, canvas, chips) {
  if (!chips) return
  const { width, height } = canvas
  const w = width - MARGIN * 2
  const h = height - MARGIN * 2

  ctx.font = "12px 'IBM Plex Mono', monospace"
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  for (const chip of chips) {
    const colour = CHIP_COLOURS[chip.colour] || CHIP_COLOURS.safe
    const cx = MARGIN + chip.x * w
    const cy = MARGIN + chip.y * h
    const boxW = ctx.measureText(chip.label).width + 20
    const boxH = 24

    ctx.fillStyle = '#1a1a1a'
    ctx.fillRect(cx - boxW / 2, cy - boxH / 2, boxW, boxH)
    ctx.strokeStyle = colour
    ctx.lineWidth = 2
    ctx.strokeRect(cx - boxW / 2, cy - boxH / 2, boxW, boxH)
    ctx.fillStyle = colour
    ctx.fillText(chip.label, cx, cy)
  }
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