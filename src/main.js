import './css/styles.css'
import { generateGrid, roomKey } from './game/grid.js'
import { createPlayer, movePlayer } from './game/player.js'
import { renderRoom, renderChipProps } from './game/render.js'
import { spawnResistors, updateResistors, renderResistors } from './game/enemies.js'
import { LEVELS, HUD_PLACEHOLDER_STATS } from './game/levels.js'

document.querySelector('#app').innerHTML = `
  <div class="game-frame">
    <div class="game-area">
      <h1 class="logo-font">The ULA Contention</h1>
      <canvas id="game-canvas" width="640" height="480"></canvas>
    </div>
    <aside class="hud-sidebar">
      <div class="hud-stats">
        <div class="hud-row"><span>Lifeforce</span><span id="hud-life"></span></div>
        <div class="hud-row"><span>Laser Regen</span><span id="hud-laser"></span></div>
        <div class="hud-row"><span>Health Pickups</span><span id="hud-pickups"></span></div>
      </div>
      <div class="hud-area">
        <div id="hud-area-num"></div>
        <div id="hud-area-name"></div>
      </div>
      <div class="hud-status-label">Status</div>
      <div class="hud-status" id="hud-status"></div>
    </aside>
  </div>
`

const canvas = document.querySelector('#game-canvas')
const ctx = canvas.getContext('2d')

const hud = {
  life: document.querySelector('#hud-life'),
  laser: document.querySelector('#hud-laser'),
  pickups: document.querySelector('#hud-pickups'),
  areaNum: document.querySelector('#hud-area-num'),
  areaName: document.querySelector('#hud-area-name'),
  status: document.querySelector('#hud-status'),
}

// Debug-only for now: press 1, 3, or 5 to preview that level's HUD/chip props.
// Real level progression will replace this once levels are wired up properly.
let currentLevel = 1
let resistors = []

function spawnLevelEnemies() {
  // Grunts only spawn on levels 1 and 3, per design — level 5 is the CPU mini-boss room.
  if (currentLevel === 1 || currentLevel === 3) {
    resistors = spawnResistors(rooms, roomKey, 4, startCol, startRow)
  } else {
    resistors = []
  }
}

function updateHud() {
  const level = LEVELS[currentLevel]
  hud.life.textContent = HUD_PLACEHOLDER_STATS.lifeforce
  hud.laser.textContent = HUD_PLACEHOLDER_STATS.laserRegen
  hud.pickups.textContent = HUD_PLACEHOLDER_STATS.healthPickups
  hud.areaNum.textContent = `Area ${String(currentLevel).padStart(2, '0')}`
  hud.areaName.textContent = level.areaName
  hud.status.textContent = level.status
}

window.addEventListener('keydown', (e) => {
  if (['1', '3', '5'].includes(e.key)) {
    currentLevel = Number(e.key)
    updateHud()
    spawnLevelEnemies()
  }
  const dir = keyMap[e.key]
  if (dir) input[dir] = true
})
window.addEventListener('keyup', (e) => {
  const dir = keyMap[e.key]
  if (dir) input[dir] = false
})

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

updateHud()
spawnLevelEnemies()

function loop() {
  movePlayer(player, input, rooms, roomKey)
  updateResistors(resistors)
  renderRoom(ctx, canvas, rooms, roomKey, player)
  renderChipProps(ctx, canvas, LEVELS[currentLevel].chips)
  renderResistors(ctx, canvas, resistors, player.roomCol, player.roomRow)
  requestAnimationFrame(loop)
}

loop()