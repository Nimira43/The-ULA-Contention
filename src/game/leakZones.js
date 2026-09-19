const START_RADIUS = 0.05
const MAX_RADIUS = 0.16
const GROWTH_PER_FRAME = 0.00006
const DAMAGE_TICK_FRAMES = 30 
const DAMAGE_PER_TICK = 4
const MAX_HP = 30

export function spawnLeakZone(roomCol, roomRow, x, y) {
  return {
    roomCol,
    roomRow,
    x,
    y,
    radius: START_RADIUS,
    hp: MAX_HP,
    maxHp: MAX_HP,
    damageTimer: 0,
  }
}

export function spawnLeakZones(count, roomCol, roomRow) {
  const zones = []
  for (let i = 0; i < count; i++) {
    zones.push(spawnLeakZone(roomCol, roomRow, 0.2 + Math.random() * 0.6, 0.2 + Math.random() * 0.6))
  }
  return zones
}

export function damageLeakZone(zone, amount) {
  zone.hp = Math.max(0, zone.hp - amount)
}

export function updateLeakZones(zones, player, damagePlayerFn) {
  for (const zone of zones) {
    if (zone.hp <= 0) continue

    zone.radius = Math.min(MAX_RADIUS, zone.radius + GROWTH_PER_FRAME)

    if (zone.roomCol === player.roomCol && zone.roomRow === player.roomRow) {
      const dist = Math.hypot(player.x - zone.x, player.y - zone.y)
      if (dist < zone.radius) {
        zone.damageTimer -= 1
        if (zone.damageTimer <= 0) {
          damagePlayerFn(player, DAMAGE_PER_TICK)
          zone.damageTimer = DAMAGE_TICK_FRAMES
        }
      } else {
        zone.damageTimer = 0
      }
    }
  }
}

export function renderLeakZones(ctx, canvas, zones, roomCol, roomRow) {
  const MARGIN = 20
  const { width, height } = canvas
  const w = width - MARGIN * 2
  const h = height - MARGIN * 2

  for (const zone of zones) {
    if (zone.roomCol !== roomCol || zone.roomRow !== roomRow || zone.hp <= 0) continue
    const cx = MARGIN + zone.x * w
    const cy = MARGIN + zone.y * h
    const r = zone.radius * w

    ctx.fillStyle = 'rgba(214, 59, 59, 0.35)'
    ctx.beginPath()
    ctx.arc(cx, cy, r, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = 'rgba(255, 90, 90, 0.7)'
    ctx.lineWidth = 1.5
    ctx.stroke()
  }
}