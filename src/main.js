import './css/styles.css'
import { generateGrid, roomKey } from './game/grid.js'
import { createPlayer, movePlayer } from './game/player.js'
import { renderRoom } from './game/render.js'

document.querySelector('#app').innerHTML = `
  <div class="game-container">
    <h1 class="logo-font">
    The ULA Contention
    </h1>
    <canvas
      id="game-canvas"
      width="640"
      height="480"
    >
    </canvas>
  </div>
`

const canvas = document.querySelector('#game-canvas')
const ctx = canvas.getContext('2d')

const { rooms, startKey } = generateGrid(5, 4, 9)
const [startCol, startRow] = startKey.split(',').map(Number)
const player = createPlayer(startCol, startRow)

const input = { up: false, down: false, left: false, right: false }

const keyMap = {
  ArrowUp: 'up', w: 'up', W: 'up',
  ArrowDown: 'down', s: 'down', S: 'down',
  ArrowLeft: 'left', a: 'left', A: 'left',
  ArrowRight: 'right', d: 'right', D: 'right',
}

window.addEventListener('keydown', (e) => {
  const dir = keyMap[e.key]
  if (dir) input[dir] = true
})
window.addEventListener('keyup', (e) => {
  const dir = keyMap[e.key]
  if (dir) input[dir] = false
})

function loop() {
  movePlayer(player, input, rooms, roomKey)
  renderRoom(ctx, canvas, rooms, roomKey, player)
  requestAnimationFrame(loop)
}

loop()