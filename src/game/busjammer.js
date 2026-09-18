const DOOR_POSITIONS = {
  N: { x: 0.5, y: 0.08 },
  S: { x: 0.5, y: 0.92 },
  W: { x: 0.08, y: 0.5 },
  E: { x: 0.92, y: 0.5 },
}

const HUNT_SPEED = 0.006
const HUNT_STOP_DISTANCE = 0.15
const ATTACK_COOLDOWN_MIN = 70
const ATTACK_COOLDOWN_RANGE = 40

export function spawnBusJammer(roomCol, roomRow, doorSide) {
  const pos = DOOR_POSITIONS[doorSide]
  return {
    roomCol,
    roomRow,
    doorSide,
    x: pos.x,
    y: pos.y,
    hp: 20, 
    bands: ['brown', 'black', 'orange'],
    ohms: '10kΩ',
    mode: 'blocking',
    attackCooldown: 80,
  }
}

export function activateHunt(jammer) {
  jammer.mode = 'hunting'
  jammer.doorSide = null 
}

export function updateBusJammerHunt(jammers, player) {
  for (const j of jammers) {
    if (j.mode !== 'hunting') continue
    if (j.roomCol !== player.roomCol || j.roomRow !== player.roomRow) continue

    const dx = player.x - j.x
    const dy = player.y - j.y
    const dist = Math.hypot(dx, dy)
    if (dist > HUNT_STOP_DISTANCE) {
      j.x += (dx / dist) * HUNT_SPEED
      j.y += (dy / dist) * HUNT_SPEED
    }
  }
}

export function updateBusJammerAttacks(jammers, player, projectiles, fireAtPlayerFn) {
  for (const j of jammers) {
    if (j.mode !== 'hunting') continue
    if (j.roomCol !== player.roomCol || j.roomRow !== player.roomRow) continue

    j.attackCooldown -= 1
    if (j.attackCooldown <= 0) {
      fireAtPlayerFn(j, player, projectiles)
      j.attackCooldown = ATTACK_COOLDOWN_MIN + Math.random() * ATTACK_COOLDOWN_RANGE
    }
  }
}

export function renderBusJammers(ctx, canvas, jammers, roomCol, roomRow) {
  const MARGIN = 20
  const { width, height } = canvas
  const w = width - MARGIN * 2
  const h = height - MARGIN * 2
  const bodyW = 40
  const bodyH = 18
  const bandHex = { brown: '#7b4a2a', black: '#1a1a1a', orange: '#e08a2a' }

  for (const j of jammers) {
    if (j.roomCol !== roomCol || j.roomRow !== roomRow || j.hp <= 0) continue
    const cx = MARGIN + j.x * w
    const cy = MARGIN + j.y * h

    ctx.fillStyle = '#d8c39a'
    ctx.fillRect(cx - bodyW / 2, cy - bodyH / 2, bodyW, bodyH)
    ctx.strokeStyle = j.mode === 'hunting' ? '#ff3b3b' : '#8a7451'
    ctx.lineWidth = 2
    ctx.strokeRect(cx - bodyW / 2, cy - bodyH / 2, bodyW, bodyH)

    j.bands.forEach((band, i) => {
      ctx.fillStyle = bandHex[band]
      ctx.fillRect(cx - bodyW / 2 + 6 + i * 9, cy - bodyH / 2, 4, bodyH)
    })
  }
}