const CHARGED_DURATION = 120 
const DISCHARGED_DURATION = 180 
const BURST_SHOTS = 3
const BURST_GAP = 8 

export function spawnLogicGates(count, roomCol, roomRow) {
  const gates = []
  for (let i = 0; i < count; i++) {
    gates.push({
      roomCol,
      roomRow,
      x: 0.3 + Math.random() * 0.4,
      y: 0.3 + Math.random() * 0.4,
      hp: 2,
      charged: false,
      invulnerable: true,
      timer: Math.floor(Math.random() * DISCHARGED_DURATION),
      burstShotsLeft: 0,
      burstTimer: 0,
    })
  }
  return gates
}

export function updateLogicGates(gates, player, projectiles, fireAtPlayerFn) {
  for (const g of gates) {
    g.timer -= 1
    if (g.timer <= 0) {
      g.charged = !g.charged
      g.invulnerable = !g.charged
      g.timer = g.charged ? CHARGED_DURATION : DISCHARGED_DURATION
      if (g.charged) {
        g.burstShotsLeft = BURST_SHOTS
        g.burstTimer = 0
      }
    }

    if (g.burstShotsLeft > 0) {
      g.burstTimer -= 1
      if (g.burstTimer <= 0) {
        if (g.roomCol === player.roomCol && g.roomRow === player.roomRow) {
          fireAtPlayerFn(g, player, projectiles)
        }
        g.burstShotsLeft -= 1
        g.burstTimer = BURST_GAP
      }
    }
  }
}

export function renderLogicGates(ctx, canvas, gates, roomCol, roomRow) {
  const MARGIN = 20
  const { width, height } = canvas
  const w = width - MARGIN * 2
  const h = height - MARGIN * 2

  for (const g of gates) {
    if (g.roomCol !== roomCol || g.roomRow !== roomRow) continue
    const cx = MARGIN + g.x * w
    const cy = MARGIN + g.y * h

    ctx.fillStyle = g.charged ? '#03da03' : '#0a3d0a'
    ctx.strokeStyle = g.charged ? '#81f681' : '#1f5c1f'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(cx - 12, cy)
    ctx.lineTo(cx, cy - 12)
    ctx.lineTo(cx + 12, cy)
    ctx.lineTo(cx, cy + 12)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()
  }
}