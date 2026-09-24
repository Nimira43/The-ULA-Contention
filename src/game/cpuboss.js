const SECTIONS = [
  { key: 'left', label: 'LEFT CORE', x: 0.28, y: 0.22, maxHp: 15 },
  { key: 'right', label: 'RIGHT CORE', x: 0.72, y: 0.22, maxHp: 15 },
  { key: 'alu', label: 'CENTRAL ALU', x: 0.5, y: 0.34, maxHp: 25 },
]

const HIT_RADIUS = 0.08
const BASE_ATTACK_COOLDOWN = 100
const ATTACK_COOLDOWN_STEP = 25
const STABILISE_FLASH_FRAMES = 45

export function spawnCpuBoss(roomCol, roomRow) {
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
    stabilised: false,
    flashTimer: 0,
  }))
}

export function updateCpuBossAttacks(sections, player, projectiles, fireAtPlayerFn) {
  const aliveCount = sections.filter((s) => s.hp > 0).length
  const cooldownBase = Math.max(30, BASE_ATTACK_COOLDOWN - (3 - aliveCount) * ATTACK_COOLDOWN_STEP)

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

export function updateCpuBossStabilise(sections) {
  for (let i = sections.length - 1; i >= 0; i--) {
    const s = sections[i]
    if (s.hp <= 0 && !s.stabilised) {
      s.stabilised = true
      s.flashTimer = STABILISE_FLASH_FRAMES
    }
    if (s.stabilised) {
      s.flashTimer -= 1
      if (s.flashTimer <= 0) sections.splice(i, 1)
    }
  }
}

export function cpuBossStabilityPercent(sections) {
  if (sections.length === 0) return 0
  const totalHp = sections.reduce((sum, s) => sum + Math.max(0, s.hp), 0)
  const totalMax = sections.reduce((sum, s) => sum + s.maxHp, 0)
  return totalMax > 0 ? Math.round((totalHp / totalMax) * 100) : 0
}

export function renderCpuBoss(ctx, canvas, sections, roomCol, roomRow) {
  const MARGIN = 20
  const { width, height } = canvas
  const w = width - MARGIN * 2
  const h = height - MARGIN * 2

  for (const s of sections) {
    if (s.roomCol !== roomCol || s.roomRow !== roomRow) continue
    const cx = MARGIN + s.x * w
    const cy = MARGIN + s.y * h
    const r = s.radius * w

    let colour
    if (s.stabilised) {
      const flashOn = Math.floor(s.flashTimer / 4) % 2 === 0
      colour = flashOn ? '#ffffff' : '#3bd6d6'
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

    if (!s.stabilised) {
      ctx.fillStyle = colour
      ctx.font = "11px 'IBM Plex Mono', monospace"
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(s.label, cx, cy)
    }
  }
}
