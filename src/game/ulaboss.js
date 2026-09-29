const SECTIONS = [
  { key: 'video', label: 'VIDEO GEN', x: 0.28, y: 0.22, maxHp: 20 },
  { key: 'contention', label: 'CONTENTION', x: 0.72, y: 0.22, maxHp: 20 },
  { key: 'io', label: 'AUDIO/IO', x: 0.5, y: 0.34, maxHp: 35 },
]

const HIT_RADIUS = 0.08
const CHARGED_DURATION = 110
const DISCHARGED_DURATION = 130
const BURST_SHOTS = 2
const BURST_GAP = 10
const DESTROY_FLASH_FRAMES = 40

export function spawnUlaBoss(roomCol, roomRow) {
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
    charged: false,
    invulnerable: true,
    timer: Math.floor(Math.random() * DISCHARGED_DURATION),
    burstShotsLeft: 0,
    burstTimer: 0,
    destroyed: false,
    flashTimer: 0,
  }))
}

export function updateUlaBoss(sections, player, projectiles, fireAtPlayerFn) {
  for (const s of sections) {
    if (s.hp <= 0) continue

    s.timer -= 1
    if (s.timer <= 0) {
      s.charged = !s.charged
      s.invulnerable = !s.charged
      s.timer = s.charged ? CHARGED_DURATION : DISCHARGED_DURATION
      if (s.charged) {
        s.burstShotsLeft = BURST_SHOTS
        s.burstTimer = 0
      }
    }

    if (s.burstShotsLeft > 0) {
      s.burstTimer -= 1
      if (s.burstTimer <= 0) {
        if (s.roomCol === player.roomCol && s.roomRow === player.roomRow) {
          fireAtPlayerFn(s, player, projectiles)
        }
        s.burstShotsLeft -= 1
        s.burstTimer = BURST_GAP
      }
    }
  }
}

export function updateUlaBossDestruction(sections) {
  for (let i = sections.length - 1; i >= 0; i--) {
    const s = sections[i]
    if (s.hp <= 0 && !s.destroyed) {
      s.destroyed = true
      s.flashTimer = DESTROY_FLASH_FRAMES
    }
    if (s.destroyed) {
      s.flashTimer -= 1
      if (s.flashTimer <= 0) sections.splice(i, 1)
    }
  }
}

export function ulaBossHealthPercent(sections) {
  if (sections.length === 0) return 0
  const totalHp = sections.reduce((sum, s) => sum + Math.max(0, s.hp), 0)
  const totalMax = sections.reduce((sum, s) => sum + s.maxHp, 0)
  return totalMax > 0 ? Math.round((totalHp / totalMax) * 100) : 0
}

export function renderUlaBoss(ctx, canvas, sections, roomCol, roomRow) {
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
    if (s.destroyed) {
      const flashOn = Math.floor(s.flashTimer / 4) % 2 === 0
      colour = flashOn ? '#ffb347' : '#d63b3b'
    } else if (s.charged) {
      colour = '#03da03'
    } else {
      colour = '#333333'
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
      ctx.font = "11px 'IBM Plex Mono', monospace"
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(s.label, cx, cy)
    }
  }
}