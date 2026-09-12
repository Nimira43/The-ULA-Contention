const GLITCH_DURATION = 90 // ~1.5s at 60fps

export function spawnGlitchTokens(count, roomCol, roomRow) {
  const tokens = []
  for (let i = 0; i < count; i++) {
    tokens.push({
      roomCol,
      roomRow,
      x: 0.2 + Math.random() * 0.6,
      y: 0.2 + Math.random() * 0.6,
      active: true,
    })
  }
  return tokens
}

export function checkGlitchContact(tokens, player, status) {
  for (const t of tokens) {
    if (!t.active) continue
    if (t.roomCol !== player.roomCol || t.roomRow !== player.roomRow) continue
    if (Math.hypot(t.x - player.x, t.y - player.y) < 0.05) {
      status.glitchTimer = GLITCH_DURATION
      t.active = false
    }
  }
}

export function applyGlitch(status, input) {
  if (status.glitchTimer > 0) {
    status.glitchTimer -= 1
    return { up: input.down, down: input.up, left: input.right, right: input.left }
  }
  return input
}

export function renderGlitchTokens(ctx, canvas, tokens, roomCol, roomRow) {
  const MARGIN = 20
  const { width, height } = canvas
  const w = width - MARGIN * 2
  const h = height - MARGIN * 2

  ctx.font = "10px 'IBM Plex Mono', monospace"
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  for (const t of tokens) {
    if (!t.active) continue
    if (t.roomCol !== roomCol || t.roomRow !== roomRow) continue
    const cx = MARGIN + t.x * w
    const cy = MARGIN + t.y * h

    ctx.fillStyle = '#e0d02a'
    ctx.fillRect(cx - 10, cy - 8, 20, 16)
    ctx.strokeStyle = '#8a7f1a'
    ctx.lineWidth = 1
    ctx.strokeRect(cx - 10, cy - 8, 20, 16)
    ctx.fillStyle = '#1a1a1a'
    ctx.fillText('?', cx, cy)
  }
}
