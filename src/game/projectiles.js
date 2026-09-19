const PLAYER_PROJECTILE_SPEED = 0.05
const ENEMY_PROJECTILE_SPEED = 0.02
const PROJECTILE_DAMAGE = 1
const OBJECTIVE_DAMAGE = 4
const PLAYER_DAMAGE = 10
const CAPACITOR_DRAIN = 20
const HIT_RADIUS = 0.05

export function fireZap(player, projectiles) {
  projectiles.push({
    owner: 'player',
    roomCol: player.roomCol,
    roomRow: player.roomRow,
    x: player.x,
    y: player.y,
    vx: player.facingX * PLAYER_PROJECTILE_SPEED,
    vy: player.facingY * PLAYER_PROJECTILE_SPEED,
  })
}

export function fireEnemyProjectile(source, objective, projectiles) {
  const dx = objective.x - source.x
  const dy = objective.y - source.y
  const len = Math.hypot(dx, dy) || 1
  projectiles.push({
    owner: 'enemy',
    target: 'objective',
    roomCol: source.roomCol,
    roomRow: source.roomRow,
    x: source.x,
    y: source.y,
    vx: (dx / len) * ENEMY_PROJECTILE_SPEED,
    vy: (dy / len) * ENEMY_PROJECTILE_SPEED,
  })
}

export function fireEnemyProjectileAtPlayer(source, player, projectiles) {
  const dx = player.x - source.x
  const dy = player.y - source.y
  const len = Math.hypot(dx, dy) || 1
  projectiles.push({
    owner: 'enemy',
    target: 'player',
    roomCol: source.roomCol,
    roomRow: source.roomRow,
    x: source.x,
    y: source.y,
    vx: (dx / len) * ENEMY_PROJECTILE_SPEED,
    vy: (dy / len) * ENEMY_PROJECTILE_SPEED,
  })
}

export function updateProjectiles(projectiles, hittables, opts) {
  const { objective, damageObjectiveFn, player, capacitors, damageCapacitorFn, damagePlayerFn } = opts

  for (let i = projectiles.length - 1; i >= 0; i--) {
    const p = projectiles[i]
    p.x += p.vx
    p.y += p.vy

    if (p.x < 0 || p.x > 1 || p.y < 0 || p.y > 1) {
      projectiles.splice(i, 1)
      continue
    }

    if (p.owner === 'player') {
      const hit = hittables.find(
        (e) =>
          e.hp > 0 &&
          !e.invulnerable &&
          e.roomCol === p.roomCol &&
          e.roomRow === p.roomRow &&
          Math.hypot(e.x - p.x, e.y - p.y) < (e.radius !== undefined ? e.radius : HIT_RADIUS)
      )
      if (hit) {
        hit.hp -= PROJECTILE_DAMAGE
        projectiles.splice(i, 1)
      }
      continue
    }

    if (p.owner === 'enemy' && p.target === 'objective') {
      if (
        objective &&
        objective.active &&
        p.roomCol === objective.roomCol &&
        p.roomRow === objective.roomRow &&
        Math.hypot(objective.x - p.x, objective.y - p.y) < HIT_RADIUS
      ) {
        damageObjectiveFn(objective, OBJECTIVE_DAMAGE)
        projectiles.splice(i, 1)
      }
      continue
    }

    if (p.owner === 'enemy' && p.target === 'player' && player) {
      if (
        p.roomCol === player.roomCol &&
        p.roomRow === player.roomRow &&
        Math.hypot(player.x - p.x, player.y - p.y) < HIT_RADIUS
      ) {
        const shield =
          capacitors &&
          capacitors.find(
            (c) =>
              c.hp > 0 &&
              c.roomCol === player.roomCol &&
              c.roomRow === player.roomRow &&
              Math.hypot(c.x - player.x, c.y - player.y) < c.radius
          )
        if (shield) {
          damageCapacitorFn(shield, CAPACITOR_DRAIN)
        } else {
          damagePlayerFn(player, PLAYER_DAMAGE)
        }
        projectiles.splice(i, 1)
      }
    }
  }
}

export function renderProjectiles(ctx, canvas, projectiles, roomCol, roomRow) {
  const MARGIN = 20
  const { width, height } = canvas
  const w = width - MARGIN * 2
  const h = height - MARGIN * 2

  for (const p of projectiles) {
    if (p.roomCol !== roomCol || p.roomRow !== roomRow) continue
    const cx = MARGIN + p.x * w
    const cy = MARGIN + p.y * h
    ctx.fillStyle = p.owner === 'player' ? '#81f681' : '#ff3b3b'
    ctx.beginPath()
    ctx.arc(cx, cy, 3, 0, Math.PI * 2)
    ctx.fill()
  }
}
