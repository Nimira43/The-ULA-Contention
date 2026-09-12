const PROJECTILE_SPEED = 0.05
const PROJECTILE_DAMAGE = 1

export function fireZap(player, projectiles) {
  projectiles.push({
    roomCol: player.roomCol,
    roomRow: player.roomRow,
    x: player.x,
    y: player.y,
    vx: player.facingX * PROJECTILE_SPEED,
    vy: player.facingY * PROJECTILE_SPEED,
  })
}

export function updateProjectiles(projectiles, enemies) {
  for (let i = projectiles.length - 1; i >= 0; i--) {
    const p = projectiles[i]
    p.x += p.vx
    p.y += p.vy

    if (p.x < 0 || p.x > 1 || p.y < 0 || p.y > 1) {
      projectiles.splice(i, 1)
      continue
    }

    const hit = enemies.find(
      (e) =>
        e.hp > 0 &&
        e.roomCol === p.roomCol &&
        e.roomRow === p.roomRow &&
        Math.hypot(e.x - p.x, e.y - p.y) < 0.05
    )

    if (hit) {
      hit.hp -= PROJECTILE_DAMAGE
      projectiles.splice(i, 1)
    }
  }

  for (let i = enemies.length - 1; i >= 0; i--) {
    if (enemies[i].hp <= 0) enemies.splice(i, 1)
  }
}

export function renderProjectiles(ctx, canvas, projectiles, roomCol, roomRow) {
  const MARGIN = 20
  const { width, height } = canvas
  const w = width - MARGIN * 2
  const h = height - MARGIN * 2

  ctx.fillStyle = '#81f681'
  for (const p of projectiles) {
    if (p.roomCol !== roomCol || p.roomRow !== roomRow) continue
    const cx = MARGIN + p.x * w
    const cy = MARGIN + p.y * h
    ctx.beginPath()
    ctx.arc(cx, cy, 3, 0, Math.PI * 2)
    ctx.fill()
  }
}