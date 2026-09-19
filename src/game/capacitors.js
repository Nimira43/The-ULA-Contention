const RADIUS = 0.14
const PUSH_STRENGTH = 0.05
const MAX_HP = 100
const HOSTILE_DAMAGE = 8
const HOSTILE_COOLDOWN = 45

export function spawnCapacitors(count, roomCol, roomRow) {
  const capacitors = []
  for (let i = 0; i < count; i++) {
    capacitors.push({
      roomCol,
      roomRow,
      x: 0.2 + Math.random() * 0.6,
      y: 0.2 + Math.random() * 0.6,
      radius: RADIUS,
      hp: MAX_HP,
      maxHp: MAX_HP,
      hostile: false,
    })
  }
  return capacitors
}

export function spawnHostileCapacitors(count, roomCol, roomRow) {
  const capacitors = []
  for (let i = 0; i < count; i++) {
    capacitors.push({
      roomCol,
      roomRow,
      x: 0.2 + Math.random() * 0.6,
      y: 0.2 + Math.random() * 0.6,
      radius: RADIUS * 0.6,
      hp: MAX_HP,
      maxHp: MAX_HP,
      hostile: true,
      contactCooldown: 0,
    })
  }
  return capacitors
}

export function damageCapacitor(capacitor, amount) {
  capacitor.hp = Math.max(0, capacitor.hp - amount)
}

export function repelFromCapacitors(capacitors, enemyGroups) {
  for (const cap of capacitors) {
    if (cap.hp <= 0 || cap.hostile) continue
    for (const group of enemyGroups) {
      for (const e of group) {
        if (e.roomCol !== cap.roomCol || e.roomRow !== cap.roomRow) continue
        const dx = e.x - cap.x
        const dy = e.y - cap.y
        const dist = Math.hypot(dx, dy)
        if (dist < cap.radius && dist > 0.0001) {
          const push = (cap.radius - dist) * PUSH_STRENGTH
          e.x += (dx / dist) * push
          e.y += (dy / dist) * push
        }
      }
    }
  }
}

export function checkHostileCapacitorContact(capacitors, player, damagePlayerFn) {
  for (const cap of capacitors) {
    if (!cap.hostile || cap.hp <= 0) continue
    if (cap.roomCol !== player.roomCol || cap.roomRow !== player.roomRow) continue

    if (cap.contactCooldown > 0) {
      cap.contactCooldown -= 1
      continue
    }
    if (Math.hypot(cap.x - player.x, cap.y - player.y) < cap.radius) {
      damagePlayerFn(player, HOSTILE_DAMAGE)
      cap.contactCooldown = HOSTILE_COOLDOWN
    }
  }
}

export function renderCapacitors(ctx, canvas, capacitors, roomCol, roomRow) {
  const MARGIN = 20
  const { width, height } = canvas
  const w = width - MARGIN * 2
  const h = height - MARGIN * 2

  for (const cap of capacitors) {
    if (cap.roomCol !== roomCol || cap.roomRow !== roomRow || cap.hp <= 0) continue
    const cx = MARGIN + cap.x * w
    const cy = MARGIN + cap.y * h

    const bodyColour = cap.hostile ? '#d63b3b' : '#3b7bd6'
    const ringColour = cap.hostile ? 'rgba(214, 59, 59, 0.4)' : 'rgba(59, 123, 214, 0.35)'
    const stripeColour = cap.hostile ? '#f0a0a0' : '#9ac0f0'

    ctx.strokeStyle = ringColour
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.arc(cx, cy, cap.radius * w, 0, Math.PI * 2)
    ctx.stroke()

    ctx.fillStyle = bodyColour
    ctx.fillRect(cx - 7, cy - 12, 14, 24)
    ctx.strokeStyle = '#1a1a1a'
    ctx.lineWidth = 2
    ctx.strokeRect(cx - 7, cy - 12, 14, 24)
    ctx.strokeStyle = stripeColour
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(cx - 3, cy - 12)
    ctx.lineTo(cx - 3, cy + 12)
    ctx.moveTo(cx + 3, cy - 12)
    ctx.lineTo(cx + 3, cy + 12)
    ctx.stroke()

    if (!cap.hostile && cap.hp < cap.maxHp) {
      const barW = 24
      ctx.fillStyle = '#1a1a1a'
      ctx.fillRect(cx - barW / 2, cy + 16, barW, 4)
      ctx.fillStyle = '#3b7bd6'
      ctx.fillRect(cx - barW / 2, cy + 16, barW * (cap.hp / cap.maxHp), 4)
    }
  }
}
