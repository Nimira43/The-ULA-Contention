const PHASE_BOOT = 'boot'
const PHASE_LOAD_CMD = 'load_cmd'
const PHASE_LOADING = 'loading'
const PHASE_TITLE = 'title'

const BOOT_DURATION = 120
const LOAD_TARGET = 'LOAD ""'
const LOADING_AUDIO_SRC = '/sounds/spectrum_loading.mp3'

const T_PROGRAM_TEXT = 5
const T_BYTES_TEXT = 16
const T_REVEAL_START = 19
const T_REVEAL_END = 53
const T_WIPE_START = 53
const T_WIPE_END = 56
const T_TOTAL = 113 

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
  let typedBuffer = ''

  const loadingAudio = new Audio(LOADING_AUDIO_SRC)

  function onKeydown(e) {
    if (phase === PHASE_LOAD_CMD) {
      if (e.key === 'Backspace') {
        typedBuffer = typedBuffer.slice(0, -1)
      } else if (e.key === 'Enter') {
        if (typedBuffer.toUpperCase() === LOAD_TARGET) {
          phase = PHASE_LOADING
          loadingAudio.currentTime = 0
          loadingAudio.play().catch(() => {})
        }
      } else if (e.key.length === 1 && typedBuffer.length < LOAD_TARGET.length) {
        typedBuffer += /[a-z]/i.test(e.key) ? e.key.toUpperCase() : e.key
      }
      return
    }
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
    ctx.fillText(typedBuffer, 40, canvas.height - 40)

    if (frame % 30 < 15) {
      const w = ctx.measureText(typedBuffer).width
      ctx.fillRect(40 + w + 4, canvas.height - 52, 10, 16)
    }
  }

  function drawLoadingStripes(elapsedSeconds) {
    ctx.fillStyle = '#000'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    const overallProgress = Math.min(1, elapsedSeconds / T_TOTAL)
    const paletteIndex = Math.min(
      STRIPE_PALETTES.length - 1,
      Math.floor(overallProgress * STRIPE_PALETTES.length)
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

    if (elapsedSeconds < T_WIPE_START) {
      ctx.fillStyle = '#c0c0c0'
      ctx.fillRect(margin, margin, innerW, innerH)
    } else {
      const wipeProgress = Math.min(1, (elapsedSeconds - T_WIPE_START) / (T_WIPE_END - T_WIPE_START))
      const wipeY = margin + innerH * wipeProgress
      ctx.fillStyle = '#03da03'
      ctx.fillRect(margin, margin, innerW, wipeY - margin)
      ctx.fillStyle = '#c0c0c0'
      ctx.fillRect(margin, wipeY, innerW, margin + innerH - wipeY)
    }

    if (elapsedSeconds >= T_PROGRAM_TEXT && elapsedSeconds < T_REVEAL_START) {
      ctx.fillStyle = '#000'
      ctx.font = "14px 'Share Tech Mono', monospace"
      ctx.textAlign = 'left'
      ctx.fillText('Program: The ULA Contention', margin + 10, margin + 24)
      if (elapsedSeconds >= T_BYTES_TEXT) {
        ctx.fillText('Bytes: The ULA Contention', margin + 10, margin + 44)
      }
    }

    if (elapsedSeconds >= T_REVEAL_START) {
      const revealProgress = Math.min(1, (elapsedSeconds - T_REVEAL_START) / (T_REVEAL_END - T_REVEAL_START))
      const revealHeight = innerH * revealProgress
      ctx.save()
      ctx.beginPath()
      ctx.rect(margin, margin, innerW, revealHeight)
      ctx.clip()
      ctx.fillStyle = '#000'
      ctx.textAlign = 'center'
      ctx.font = "40px 'VT323', monospace"
      const jitter = revealProgress < 1 ? (Math.random() - 0.5) * 4 : 0
      ctx.fillText('THE ULA', canvas.width / 2 + jitter, margin + 70)
      ctx.fillText('CONTENTION', canvas.width / 2 - jitter, margin + 120)
      ctx.font = "18px 'IBM Plex Mono', monospace"
      ctx.fillText('by NimiraTech', canvas.width / 2, margin + 160)
      ctx.restore()
    }
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

  loadingAudio.addEventListener('ended', () => {
    if (phase === PHASE_LOADING) phase = PHASE_TITLE
  })

  function tick() {
    if (stopped) return
    frame += 1

    if (phase === PHASE_BOOT) {
      drawBoot()
      timer -= 1
      if (timer <= 0) phase = PHASE_LOAD_CMD
    } else if (phase === PHASE_LOAD_CMD) {
      drawLoadCmd()
    } else if (phase === PHASE_LOADING) {
      drawLoadingStripes(loadingAudio.currentTime)
      if (loadingAudio.currentTime >= T_TOTAL) phase = PHASE_TITLE
    } else if (phase === PHASE_TITLE) {
      drawTitle()
    }

    requestAnimationFrame(tick)
  }

  requestAnimationFrame(tick)
}