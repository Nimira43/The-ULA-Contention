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

const FAST_TIER = { bands: ['brown', 'black', 'brown'], ohms: '100Ω', hp: 1, speed: 0.009 }

const clamp = (v, min, max) => Math.min(max, Math.max(min, v))

export function spawnResistors(rooms, roomKeyFn, count, excludeCol, excludeRow) {
  const roomList = [...rooms.values()].filter(
    (r) => !(r.col === excludeCol && r.row === excludeRow)
  )
  if (roomList.length === 0) return []

  const enemies = []
  for (let i = 0; i < count; i++) {
    const room = roomList[Math.floor(Math.random() * roomList.length)]
    enemies.push(makeResistor(room.col, room.row))
  }
  return enemies
}

export function spawnSwarm(count, roomCol, roomRow) {
  const enemies = []
  for (let i = 0; i < count; i++) {
    enemies.push(makeResistor(roomCol, roomRow))
  }
  return enemies
}

export function spawnRamLeakers(count, roomCol, roomRow) {
  const enemies = []
  for (let i = 0; i < count; i++) {
    enemies.push(makeResistor(roomCol, roomRow, { splitOnDeath: true, generation: 0 }))
  }
  return enemies
}

export function makeSplitChild(parent) {
  const child = makeResistor(parent.roomCol, parent.roomRow, {
    splitOnDeath: false,
    generation: (parent.generation || 0) + 1,
  })
  child.x = parent.x
  child.y = parent.y
  child.hp = 1 
  return child
}

export function spawnFastResistors(count, roomCol, roomRow) {
  const enemies = []
  for (let i = 0; i < count; i++) {
    enemies.push(makeResistor(roomCol, roomRow, { tier: FAST_TIER, fast: true }))
  }
  return enemies
}

function makeResistor(roomCol, roomRow, opts = {}) {
  const tier = opts.tier || LOW_VALUE_TIERS[Math.floor(Math.random() * LOW_VALUE_TIERS.length)]
  const angle = Math.random() * Math.PI * 2
  return {
    roomCol,
    roomRow,
    x: 0.25 + Math.random() * 0.5,
    y: 0.25 + Math.random() * 0.5,
    vx: Math.cos(angle) * tier.speed,
    vy: Math.sin(angle) * tier.speed,
    hp: tier.hp,
    bands: tier.bands,
    ohms: tier.ohms,
    attackCooldown: 60 + Math.random() * 60,
    splitOnDeath: opts.splitOnDeath || false,
    generation: opts.generation || 0,
    fast: opts.fast || false,
    dashCooldown: opts.fast ? 60 + Math.random() * 60 : undefined,
    contactCooldown: 0,
  }
}

export function updateResistors(enemies) {
  for (const e of enemies) {
    e.x += e.vx
    e.y += e.vy

    if (e.x < 0.12 || e.x > 0.88) e.vx *= -1
    if (e.y < 0.12 || e.y > 0.88) e.vy *= -1
    e.x = clamp(e.x, 0.1, 0.9)
    e.y = clamp(e.y, 0.1, 0.9)

    if (Math.random() < 0.02) {
      e.vx += (Math.random() - 0.5) * 0.003
      e.vy += (Math.random() - 0.5) * 0.003
    }
  }
}

export function updateFastDash(enemies, player) {
  for (const e of enemies) {
    if (!e.fast) continue
    if (e.roomCol !== player.roomCol || e.roomRow !== player.roomRow) continue

    e.dashCooldown -= 1
    if (e.dashCooldown <= 0) {
      const dx = player.x - e.x
      const dy = player.y - e.y
      const len = Math.hypot(dx, dy) || 1
      e.vx = (dx / len) * FAST_TIER.speed * 1.3
      e.vy = (dy / len) * FAST_TIER.speed * 1.3
      e.dashCooldown = 140 + Math.random() * 80
    }
  }
}

export function updateResistorAttacks(enemies, objective, fireEnemyProjectile, projectiles) {
  if (!objective || !objective.active) return

  for (const e of enemies) {
    if (e.roomCol !== objective.roomCol || e.roomRow !== objective.roomRow) continue

    e.attackCooldown -= 1
    if (e.attackCooldown <= 0) {
      fireEnemyProjectile(e, objective, projectiles)
      e.attackCooldown = 90 + Math.random() * 60
    }
  }
}

export function checkFastResistorContact(enemies, player, damagePlayerFn) {
  for (const e of enemies) {
    if (!e.fast) continue
    if (e.roomCol !== player.roomCol || e.roomRow !== player.roomRow) continue

    if (e.contactCooldown > 0) {
      e.contactCooldown -= 1
      continue
    }
    if (Math.hypot(e.x - player.x, e.y - player.y) < 0.05) {
      damagePlayerFn(player, 8)
      e.contactCooldown = 60
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
