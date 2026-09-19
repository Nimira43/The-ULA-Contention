const TIERS = [
  { radius: 0.09, speed: 0.011, damage: 6 },
  { radius: 0.06, speed: 0.014, damage: 4 },
  { radius: 0.035, speed: 0.017, damage: 3 },
]

const CONTACT_COOLDOWN_FRAMES = 30

function makeBall(roomCol, roomRow, x, y, tierIndex, angle) {
  const tier = TIERS[tierIndex]
  return {
    roomCol,
    roomRow,
    x,
    y,
    vx: Math.cos(angle) * tier.speed,
    vy: Math.sin(angle) * tier.speed,
    tierIndex,
    radius: tier.radius,
    damage: tier.damage,
    hp: 1, // any zap hit triggers a split (or destruction at the smallest tier)
    contactTimer: 0,
  }
}

export function spawnCorruptionBalls(count, roomCol, roomRow) {
  const balls = []
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2
    const x = 0.25 + Math.random() * 0.5
    const y = 0.25 + Math.random() * 0.5
    balls.push(makeBall(roomCol, roomRow, x, y, 0, angle))
  }
  return balls
}

export function splitCorruptionBall(ball) {
  const nextTier = ball.tierIndex + 1
  if (nextTier >= TIERS.length) return []

  const baseAngle = Math.atan2(ball.vy, ball.vx)
  return [
    makeBall(ball.roomCol, ball.roomRow, ball.x, ball.y, nextTier, baseAngle + Math.PI / 4),
    makeBall(ball.roomCol, ball.roomRow, ball.x, ball.y, nextTier, baseAngle - Math.PI / 4),
  ]
}

export function updateCorruptionBalls(balls, player, damagePlayerFn) {
  for (const b of balls) {
    b.x += b.vx
    b.y += b.vy

    if (b.x - b.radius < 0 || b.x + b.radius > 1) {
      b.vx *= -1
      b.x = Math.min(1 - b.radius, Math.max(b.radius, b.x))
    }
    if (b.y - b.radius < 0 || b.y + b.radius > 1) {
      b.vy *= -1
      b.y = Math.min(1 - b.radius, Math.max(b.radius, b.y))
    }

    if (b.roomCol !== player.roomCol || b.roomRow !== player.roomRow) continue
    const dist = Math.hypot(player.x - b.x, player.y - b.y)
    if (dist < b.radius) {
      b.contactTimer -= 1
      if (b.contactTimer <= 0) {
        damagePlayerFn(player, b.damage)
        b.contactTimer = CONTACT_COOLDOWN_FRAMES
      }
    } else {
      b.contactTimer = 0
    }
  }
}

export function renderCorruptionBalls(ctx, canvas, balls, roomCol, roomRow) {
  const MARGIN = 20
  const { width, height } = canvas
  const w = width - MARGIN * 2
  const h = height - MARGIN * 2

  for (const b of balls) {
    if (b.roomCol !== roomCol || b.roomRow !== roomRow) continue
    const cx = MARGIN + b.x * w
    const cy = MARGIN + b.y * h
    const r = b.radius * w

    ctx.fillStyle = 'rgba(214, 59, 59, 0.45)'
    ctx.beginPath()
    ctx.arc(cx, cy, r, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = 'rgba(255, 90, 90, 0.85)'
    ctx.lineWidth = 2
    ctx.stroke()
  }
}
