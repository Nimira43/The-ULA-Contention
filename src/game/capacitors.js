const RADIUS = 0.14
const PUSH_STRENGTH = 0.05

export function spawnCapacitors(count, roomCol, roomRow) {
  const capacitors = []
  for (let i = 0; i < count; i++) {
    capacitors.push({
      roomCol,
      roomRow,
      x: 0.2 + Math.random() * 0.6,
      y: 0.2 + Math.random() * 0.6,
    })
  }
  return capacitors
}

export function repelFromCapacitors(capacitors, enemyGroups) {
  for (const cap of capacitors) {
    for (const group of enemyGroups) {
      for (const e of group) {
        if (e.roomCol !== cap.roomCol || e.roomRow !== cap.roomRow) continue
        const dx = e.x - cap.x
        const dy = e.y - cap.y
        const dist = Math.hypot(dx, dy)
        if (dist < RADIUS && dist > 0.0001) {
          const push = (RADIUS - dist) * PUSH_STRENGTH
          e.x += (dx / dist) * push
          e.y += (dy / dist) * push
        }
      }
    }
  }
}

export function renderCapacitors(ctx, canvas, capacitors, roomCol, roomRow) {
  const MARGIN = 20
  const { width, height } = canvas
  const w = width - MARGIN * 2
  const h = height - MARGIN * 2

  for (const cap of capacitors) {
    if (cap.roomCol !== roomCol || cap.roomRow !== roomRow) continue
    const cx = MARGIN + cap.x * w
    const cy = MARGIN + cap.y * h

    ctx.strokeStyle = 'rgba(59, 123, 214, 0.35)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.arc(cx, cy, RADIUS * w, 0, Math.PI * 2)
    ctx.stroke()

    ctx.fillStyle = '#3b7bd6'
    ctx.fillRect(cx - 7, cy - 12, 14, 24)
    ctx.strokeStyle = '#1a1a1a'
    ctx.lineWidth = 2
    ctx.strokeRect(cx - 7, cy - 12, 14, 24)
    ctx.strokeStyle = '#9ac0f0'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(cx - 3, cy - 12)
    ctx.lineTo(cx - 3, cy + 12)
    ctx.moveTo(cx + 3, cy - 12)
    ctx.lineTo(cx + 3, cy + 12)
    ctx.stroke()
  }
}
