const SECTIONS = [
  { key: 'hood', label: 'HOOD', x: 0.22, y: 0.2, maxHp: 10 },
  { key: 'nose', label: 'NOSE', x: 0.78, y: 0.2, maxHp: 10 },
  { key: 'frontWheel', label: 'FRONT WHEEL', x: 0.18, y: 0.4, maxHp: 10 },
  { key: 'rearMotor', label: 'REAR MOTOR', x: 0.82, y: 0.4, maxHp: 10 },
  { key: 'centre', label: 'CENTRE', x: 0.5, y: 0.32, maxHp: 16 },
]

const HIT_RADIUS = 0.08
const BASE_ATTACK_COOLDOWN = 110
const ATTACK_COOLDOWN_STEP = 15
const DESTROY_FLASH_FRAMES = 40

export function spawnC5Boss(roomCol, roomRow) {
  return SECTIONS.map((s) => ({
    roomCol,
    roomRow,
    key: s.key,
    label: s.label,
    x: s.x,
    y: s.y,
    radius: HIT_RADIUS,
    hp: s.maxHp,
    maxHp: s.maxHp,
    attackCooldown: 60 + Math.random() * 60,
    destroyed: false,
    flashTimer: 0,
  }))
}

export function updateC5BossAttacks(sections, player, projectiles, fireAtPlayerFn) {
  const aliveCount = sections.filter((s) => s.hp > 0).length
  const cooldownBase = Math.max(
    30,
    BASE_ATTACK_COOLDOWN - (SECTIONS.length - aliveCount) * ATTACK_COOLDOWN_STEP
  )

  for (const s of sections) {
    if (s.hp <= 0) continue
    if (s.roomCol !== player.roomCol || s.roomRow !== player.roomRow) continue

    s.attackCooldown -= 1
    if (s.attackCooldown <= 0) {
      fireAtPlayerFn(s, player, projectiles)
      s.attackCooldown = cooldownBase + Math.random() * 40
    }
  }
}

export function updateC5BossDestruction(sections) {
  for (const s of sections) {
    if (s.hp <= 0 && !s.destroyed) {
      s.destroyed = true
      s.flashTimer = DESTROY_FLASH_FRAMES
    }
    if (s.destroyed && s.flashTimer > 0) {
      s.flashTimer -= 1
    }
  }
}

export function c5BossHealthPercent(sections) {
  if (sections.length === 0) return 0
  const totalHp = sections.reduce((sum, s) => sum + Math.max(0, s.hp), 0)
  const totalMax = sections.reduce((sum, s) => sum + s.maxHp, 0)
  return totalMax > 0 ? Math.round((totalHp / totalMax) * 100) : 0
}

export function renderC5Boss(ctx, canvas, sections, roomCol, roomRow) {
  const MARGIN = 20
  const { width, height } = canvas
  const w = width - MARGIN * 2
  const h = height - MARGIN * 2

  for (const s of sections) {
    if (s.roomCol !== roomCol || s.roomRow !== roomRow) continue
    if (s.destroyed && s.flashTimer <= 0) continue

    const cx = MARGIN + s.x * w
    const cy = MARGIN + s.y * h
    const r = s.radius * w

    let colour
    if (s.destroyed) {
      const flashOn = Math.floor(s.flashTimer / 4) % 2 === 0
      colour = flashOn ? '#ffb347' : '#d63b3b'
    } else {
      const pct = s.hp / s.maxHp
      colour = pct > 0.66 ? '#03da03' : pct > 0.33 ? '#e0d02a' : '#ff3b3b'
    }

    ctx.fillStyle = '#1a1a1a'
    ctx.beginPath()
    ctx.arc(cx, cy, r, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = colour
    ctx.lineWidth = 3
    ctx.stroke()

    if (!s.destroyed) {
      ctx.fillStyle = colour
      ctx.font = "10px 'IBM Plex Mono', monospace"
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(s.label, cx, cy)
    }
  }
}
