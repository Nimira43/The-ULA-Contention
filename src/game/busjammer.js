const DOOR_POSITIONS = {
  N: { x: 0.5, y: 0.08 },
  S: { x: 0.5, y: 0.92 },
  W: { x: 0.08, y: 0.5 },
  E: { x: 0.92, y: 0.5 },
}

export function spawnBusJammer(roomCol, roomRow, doorSide) {
  const pos = DOOR_POSITIONS[doorSide]
  return {
    roomCol,
    roomRow,
    doorSide,
    x: pos.x,
    y: pos.y,
    hp: 6,
    bands: ['yellow', 'violet', 'red'],
    ohms: '4.7kΩ',
  }
}

export function renderBusJammers(ctx, canvas, jammers, roomCol, roomRow) {
  const MARGIN = 20
  const { width, height } = canvas
  const w = width - MARGIN * 2
  const h = height - MARGIN * 2
  const bodyW = 40
  const bodyH = 18
  const bandHex = { yellow: '#e0d02a', violet: '#8a3bd6', red: '#d63b3b' }

  for (const j of jammers) {
    if (j.roomCol !== roomCol || j.roomRow !== roomRow || j.hp <= 0) continue
    const cx = MARGIN + j.x * w
    const cy = MARGIN + j.y * h

    ctx.fillStyle = '#d8c39a'
    ctx.fillRect(cx - bodyW / 2, cy - bodyH / 2, bodyW, bodyH)
    ctx.strokeStyle = '#8a7451'
    ctx.lineWidth = 2
    ctx.strokeRect(cx - bodyW / 2, cy - bodyH / 2, bodyW, bodyH)

    j.bands.forEach((band, i) => {
      ctx.fillStyle = bandHex[band]
      ctx.fillRect(cx - bodyW / 2 + 6 + i * 9, cy - bodyH / 2, 4, bodyH)
    })
  }
}