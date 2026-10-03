import { LEVELS } from './levels.js'

const FONT = "'VT323', monospace"

function areaLabel(level) {
  return `AREA ${String(level).padStart(2, '0')} - ${LEVELS[level].areaName.toUpperCase()}`
}

function line(ctx, canvas, text, y, size, colour) {
  ctx.fillStyle = colour
  ctx.font = `${size}px ${FONT}`
  ctx.textAlign = 'center'
  ctx.fillText(text, canvas.width / 2, y)
}

export function drawPhaseScreen(ctx, canvas, state, frameCount) {
  ctx.fillStyle = '#000'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  const midY = canvas.height / 2
  const promptVisible = frameCount % 60 < 40

  if (state.phase === 'gameOver') {
    line(ctx, canvas, 'GAME OVER', midY - 30, 40, '#ff3b3b')
    line(ctx, canvas, areaLabel(state.currentLevel), midY + 10, 24, '#ff3b3b')
    if (promptVisible) line(ctx, canvas, 'PRESS ENTER TO RETRY', midY + 60, 24, '#81f681')
  } else if (state.phase === 'levelComplete') {
    line(ctx, canvas, state.winMessage, midY - 30, 40, '#81f681')
    line(ctx, canvas, `NEXT: ${areaLabel(state.currentLevel + 1)}`, midY + 10, 24, '#03da03')
    if (promptVisible) line(ctx, canvas, 'PRESS ENTER', midY + 60, 24, '#81f681')
  } else if (state.phase === 'victory') {
    line(ctx, canvas, state.winMessage, midY - 30, 40, '#81f681')
    if (promptVisible) line(ctx, canvas, 'PRESS ENTER TO PLAY AGAIN', midY + 40, 24, '#81f681')
  }
}
