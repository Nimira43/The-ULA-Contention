const PHASE_BOOT = 'boot'
const PHASE_LOAD_CMD = 'load_cmd'
const PHASE_LOADING = 'loading'
const PHASE_TITLE = 'title'

const BOOT_DURATION = 180
const LOAD_CMD_DURATION = 180
const LOADING_DURATION = 24 * 60
const LOAD_TEXT = 'LOAD ""'

const STRIPE_PALETTES = [
  ['#00d0d0', '#d00000'],
  ['#0000d0', '#d0d000'],
  ['#00d000', '#d000d0'],
]

export function playLoadingScreen(container, music, onDone) {
  container.innerHTML = `
    <div class="loading-frame">
      <canvas id="loading-canvas" width="640" height="480"></canvas>
    </div>
  `
  const canvas = document.querySelector('#loading-canvas')
  const ctx = canvas.getContext('2d')

  let phase = PHASE_BOOT
  let timer = BOOT_DURATION
  let frame = 0
  let stopped = false
  let titleMusicAttempted = false

  function onKeydown(e) {
    if (phase === PHASE_TITLE && e.key === 'Enter' && !stopped) {
      stopped = true
      window.removeEventListener('keydown', onKeydown)
      music.start()
      onDone()
    }
  }
  window.addEventListener('keydown', onKeydown)

  function drawBoot() {
    ctx.fillStyle = '#c0c0c0'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = '#000'
    ctx.font = "16px 'Share Tech Mono', monospace"
    ctx.textAlign = 'left'
    ctx.fillText('© 2026 The ULA Contention', 40, canvas.height - 40)
  }

  function drawLoadCmd() {
    ctx.fillStyle = '#c0c0c0'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = '#000'
    ctx.font = "16px 'Share Tech Mono', monospace"
    ctx.textAlign = 'left'

    const elapsed = LOAD_CMD_DURATION - timer
    const revealCount = Math.min(LOAD_TEXT.length, Math.floor(elapsed / 6))
    const shown = LOAD_TEXT.slice(0, revealCount)
    ctx.fillText(shown, 40, canvas.height - 40)

    if (revealCount >= LOAD_TEXT.length && frame % 30 < 15) {
      const w = ctx.measureText(shown).width
      ctx.fillRect(40 + w + 4, canvas.height - 52, 10, 16)
    }
  }

  function drawLoadingStripes(progress) {
    ctx.fillStyle = '#000'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    const paletteIndex = Math.min(
      STRIPE_PALETTES.length - 1,
      Math.floor(progress * STRIPE_PALETTES.length)
    )
    const [colourA, colourB] = STRIPE_PALETTES[paletteIndex]
    const stripeHeight = 6
    const flip = Math.floor(frame / 3) % 2 === 0

    for (let y = 0; y < canvas.height; y += stripeHeight) {
      const row = Math.floor(y / stripeHeight)
      ctx.fillStyle = row % 2 === 0 === flip ? colourA : colourB
      ctx.fillRect(0, y, canvas.width, stripeHeight)
    }

    const margin = 60
    const innerW = canvas.width - margin * 2
    const innerH = canvas.height - margin * 2
    ctx.fillStyle = '#c0c0c0'
    ctx.fillRect(margin, margin, innerW, innerH)

    const revealHeight = innerH * Math.min(1, progress * 1.4)
    ctx.save()
    ctx.beginPath()
    ctx.rect(margin, margin, innerW, revealHeight)
    ctx.clip()
    ctx.fillStyle = '#000'
    ctx.textAlign = 'center'
    ctx.font = "40px 'VT323', monospace"
    const jitter = (Math.random() - 0.5) * 4
    ctx.fillText('THE ULA', canvas.width / 2 + jitter, margin + 70)
    ctx.fillText('CONTENTION', canvas.width / 2 - jitter, margin + 120)
    ctx.restore()
  }

  function drawTitle() {
    ctx.fillStyle = '#000'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.strokeStyle = '#03da03'
    ctx.lineWidth = 4
    ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40)

    ctx.fillStyle = '#03da03'
    ctx.textAlign = 'center'
    ctx.font = "60px 'VT323', monospace"
    ctx.fillText('THE ULA CONTENTION', canvas.width / 2, canvas.height / 2 - 20)

    if (frame % 60 < 40) {
      ctx.font = "24px 'VT323', monospace"
      ctx.fillText('PRESS ENTER', canvas.width / 2, canvas.height / 2 + 40)
    }

    if (!titleMusicAttempted) {
      titleMusicAttempted = true
      music.start()
    }
  }

  function tick() {
    if (stopped) return
    frame += 1
    timer -= 1

    if (phase === PHASE_BOOT) {
      drawBoot()
      if (timer <= 0) {
        phase = PHASE_LOAD_CMD
        timer = LOAD_CMD_DURATION
      }
    } else if (phase === PHASE_LOAD_CMD) {
      drawLoadCmd()
      if (timer <= 0) {
        phase = PHASE_LOADING
        timer = LOADING_DURATION
      }
    } else if (phase === PHASE_LOADING) {
      drawLoadingStripes(1 - timer / LOADING_DURATION)
      if (timer <= 0) {
        phase = PHASE_TITLE
      }
    } else if (phase === PHASE_TITLE) {
      drawTitle()
    }

    requestAnimationFrame(tick)
  }

  requestAnimationFrame(tick)
}
