const PICKUP_RADIUS = 0.05
const HEAL_PERCENT = 25

export function spawnHealthPickups(count, roomCol, roomRow) {
  const pickups = []
  for (let i = 0; i < count; i++) {
    pickups.push({
      roomCol,
      roomRow,
      x: 0.2 + Math.random() * 0.6,
      y: 0.2 + Math.random() * 0.6,
      collected: false,
    })
  }
  return pickups
}

export function collectPickups(pickups, player, stockpile, onCollect) {
  for (const p of pickups) {
    if (p.collected) continue
    if (p.roomCol !== player.roomCol || p.roomRow !== player.roomRow) continue
    if (Math.hypot(p.x - player.x, p.y - player.y) < PICKUP_RADIUS) {
      p.collected = true
      stockpile.count += 1
      if (onCollect) onCollect()
    }
  }
}

export function useHealthPickup(stockpile, player) {
  if (stockpile.count <= 0) return false
  stockpile.count -= 1
  player.health = Math.min(100, player.health + HEAL_PERCENT)
  return true
}

export function renderPickups(ctx, canvas, pickups, roomCol, roomRow) {
  const MARGIN = 20
  const { width, height } = canvas
  const w = width - MARGIN * 2
  const h = height - MARGIN * 2

  for (const p of pickups) {
    if (p.collected) continue
    if (p.roomCol !== roomCol || p.roomRow !== roomRow) continue
    const cx = MARGIN + p.x * w
    const cy = MARGIN + p.y * h

    ctx.fillStyle = '#2ecc40'
    ctx.beginPath()
    ctx.arc(cx, cy, 8, 0, Math.PI * 2)
    ctx.fill()

    ctx.strokeStyle = '#fff'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(cx - 4, cy)
    ctx.lineTo(cx + 4, cy)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(cx, cy - 4)
    ctx.lineTo(cx, cy + 4)
    ctx.stroke()
  }
}