// Resistor "grunt" enemies. Colour bands are real resistor codes — the lower-value
// tiers used here (10Ω–330Ω) are deliberately the weakest, so "lower value" grunts
// are literally lower-value resistors, not just a difficulty label.

const BAND_HEX = {
  black: '#1a1a1a',
  brown: '#7b4a2a',
  red: '#d63b3b',
  orange: '#e08a2a',
}

const LOW_VALUE_TIERS = [
  { bands: ['brown', 'black', 'black'], ohms: '10Ω', hp: 1, speed: 0.006 },
  { bands: ['brown', 'black', 'brown'], ohms: '100Ω', hp: 1, speed: 0.007 },
  { bands: ['red', 'red', 'brown'], ohms: '220Ω', hp: 2, speed: 0.008 },
  { bands: ['orange', 'orange', 'brown'], ohms: '330Ω', hp: 2, speed: 0.009 },
]

const clamp = (v, min, max) => Math.min(max, Math.max(min, v))

export function spawnResistors(rooms, roomKeyFn, count, excludeCol, excludeRow) {
  const roomList = [...rooms.values()].filter(
    (r) => !(r.col === excludeCol && r.row === excludeRow)
  )
  if (roomList.length === 0) return []

  const enemies = []
  for (let i = 0; i < count; i++) {
    const room = roomList[Math.floor(Math.random() * roomList.length)]
    const tier = LOW_VALUE_TIERS[Math.floor(Math.random() * LOW_VALUE_TIERS.length)]
    const angle = Math.random() * Math.PI * 2
    enemies.push({
      roomCol: room.col,
      roomRow: room.row,
      x: 0.25 + Math.random() * 0.5,
      y: 0.25 + Math.random() * 0.5,
      vx: Math.cos(angle) * tier.speed,
      vy: Math.sin(angle) * tier.speed,
      hp: tier.hp,
      bands: tier.bands,
      ohms: tier.ohms,
    })
  }
  return enemies
}

export function updateResistors(enemies) {
  for (const e of enemies) {
    e.x += e.vx
    e.y += e.vy

    if (e.x < 0.12 || e.x > 0.88) e.vx *= -1
    if (e.y < 0.12 || e.y > 0.88) e.vy *= -1
    e.x = clamp(e.x, 0.1, 0.9)
    e.y = clamp(e.y, 0.1, 0.9)

    // Occasional nudge so movement isn't a perfectly bouncing ball.
    if (Math.random() < 0.02) {
      e.vx += (Math.random() - 0.5) * 0.003
      e.vy += (Math.random() - 0.5) * 0.003
    }
  }
}

export function renderResistors(ctx, canvas, enemies, roomCol, roomRow) {
  const MARGIN = 20
  const { width, height } = canvas
  const w = width - MARGIN * 2
  const h = height - MARGIN * 2
  const bodyW = 26
  const bodyH = 12

  for (const e of enemies) {
    if (e.roomCol !== roomCol || e.roomRow !== roomRow) continue

    const cx = MARGIN + e.x * w
    const cy = MARGIN + e.y * h

    ctx.strokeStyle = '#9a9a9a'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(cx - bodyW / 2 - 8, cy)
    ctx.lineTo(cx - bodyW / 2, cy)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(cx + bodyW / 2, cy)
    ctx.lineTo(cx + bodyW / 2 + 8, cy)
    ctx.stroke()

    ctx.fillStyle = '#d8c39a'
    ctx.fillRect(cx - bodyW / 2, cy - bodyH / 2, bodyW, bodyH)
    ctx.strokeStyle = '#8a7451'
    ctx.lineWidth = 1
    ctx.strokeRect(cx - bodyW / 2, cy - bodyH / 2, bodyW, bodyH)

    e.bands.forEach((band, i) => {
      ctx.fillStyle = BAND_HEX[band]
      ctx.fillRect(cx - bodyW / 2 + 5 + i * 6, cy - bodyH / 2, 3, bodyH)
    })
  }
}
