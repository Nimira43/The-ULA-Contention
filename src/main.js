import './css/styles.css'
import { generateGrid, roomKey } from './game/grid.js'
import { createPlayer, movePlayer } from './game/player.js'
import { renderRoom, renderChipProps } from './game/render.js'
import { spawnSwarm, updateResistors, updateResistorAttacks, renderResistors } from './game/enemies.js'
import { fireZap, fireEnemyProjectile, updateProjectiles, renderProjectiles } from './game/projectiles.js'
import { createObjective, damageObjective, objectiveHealthPercent } from './game/objective.js'
import { spawnHealthPickups, collectPickups, useHealthPickup, renderPickups } from './game/pickups.js'
import { spawnGlitchTokens, checkGlitchContact, applyGlitch, renderGlitchTokens } from './game/hazards.js'
import { spawnLogicGates, updateLogicGates, renderLogicGates } from './game/logicgates.js'
import { spawnBusJammer, renderBusJammers } from './game/busjammer.js'
import { spawnCapacitors, repelFromCapacitors, renderCapacitors } from './game/capacitors.js'
import { createMusicPlayer } from './game/music.js'
import { playSfx } from './game/sfx.js'
import { LEVELS } from './game/levels.js'

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
      <div class="hud-row" id="hud-rom-row" style="display:none">
        <span>ROM Health</span><span id="hud-rom"></span>
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
  romRow: document.querySelector('#hud-rom-row'),
  rom: document.querySelector('#hud-rom'),
  areaNum: document.querySelector('#hud-area-num'),
  areaName: document.querySelector('#hud-area-name'),
  status: document.querySelector('#hud-status'),
}

const { rooms, startKey } = generateGrid(5, 4, 9)
const [startCol, startRow] = startKey.split(',').map(Number)
const player = createPlayer(startCol, startRow)

let currentLevel = 1
let resistors = []
let logicGates = []
let busJammers = []
let capacitors = []
const projectiles = []
const pickupStockpile = { count: 0 }
let pickups = []
let glitchTokens = []
const status = { glitchTimer: 0 }
let gameOver = false

const music = createMusicPlayer(0.4)
window.addEventListener('keydown', () => music.start(), { once: true })
window.addEventListener('pointerdown', () => music.start(), { once: true })

function fireEnemyProjectileWithSfx(source, objective, projectiles) {
  playSfx('resistorLaser')
  fireEnemyProjectile(source, objective, projectiles)
}

let romObjective = createObjective(startCol, startRow, 0.5, 0.22, 100)

function startLevel1Fight() {
  romObjective = createObjective(startCol, startRow, 0.5, 0.22, 100)
  resistors = spawnSwarm(5, startCol, startRow)
  pickups = spawnHealthPickups(3, startCol, startRow)
  glitchTokens = spawnGlitchTokens(2, startCol, startRow)
}

function startLevel2() {
  logicGates = spawnLogicGates(3, startCol, startRow)
  capacitors = spawnCapacitors(2, startCol, startRow)

  const startRoom = rooms.get(roomKey(startCol, startRow))
  const doorSide = Object.keys(startRoom.doors).find((d) => startRoom.doors[d])
  busJammers = doorSide ? [spawnBusJammer(startCol, startRow, doorSide)] : []
}

function clearAllEncounters() {
  resistors = []
  pickups = []
  glitchTokens = []
  logicGates = []
  busJammers = []
  capacitors = []
  romObjective.active = false
}

function spawnLevelEnemies() {
  clearAllEncounters()
  if (currentLevel === 1) startLevel1Fight()
  if (currentLevel === 2) startLevel2()
}

function updateHud() {
  const level = LEVELS[currentLevel]
  hud.life.textContent = `${Math.round(player.health)}%`
  hud.laser.textContent = '43%' // placeholder until the energy system exists
  hud.pickups.textContent = pickupStockpile.count
  hud.areaNum.textContent = `Area ${String(currentLevel).padStart(2, '0')}`
  hud.areaName.textContent = level.areaName
  hud.status.textContent = level.status

  if (romObjective.active) {
    hud.romRow.style.display = ''
    hud.rom.textContent = `${objectiveHealthPercent(romObjective)}%`
  } else {
    hud.romRow.style.display = 'none'
  }
}

const rawInput = { up: false, down: false, left: false, right: false }
const keyMap = {
  ArrowUp: 'up', w: 'up', W: 'up',
  ArrowDown: 'down', s: 'down', S: 'down',
  ArrowLeft: 'left', a: 'left', A: 'left',
  ArrowRight: 'right', d: 'right', D: 'right',
}

function isDoorBlocked(col, row, dir) {
  return busJammers.some(
    (j) => j.hp > 0 && j.roomCol === col && j.roomRow === row && j.doorSide === dir
  )
}

window.addEventListener('keydown', (e) => {
  if (['1', '2', '3', '5'].includes(e.key)) {
    currentLevel = Number(e.key)
    spawnLevelEnemies()
    updateHud()
  }

  const dir = keyMap[e.key]
  if (dir) rawInput[dir] = true

  if (e.key === ' ' && !e.repeat) {
    fireZap(player, projectiles)
    playSfx('playerLaser')
  }
  if (e.key.toLowerCase() === 'h' && !e.repeat) {
    if (useHealthPickup(pickupStockpile, player)) playSfx('healthRestored')
  }
})
window.addEventListener('keyup', (e) => {
  const dir = keyMap[e.key]
  if (dir) rawInput[dir] = false
})

spawnLevelEnemies()
updateHud()

function loop() {
  if (gameOver) {
    ctx.fillStyle = '#000'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = '#ff3b3b'
    ctx.font = "40px 'VT323', monospace"
    ctx.textAlign = 'center'
    ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2)
    return
  }

  const input = applyGlitch(status, rawInput)

  movePlayer(player, input, rooms, roomKey, isDoorBlocked)
  updateResistors(resistors)
  updateResistorAttacks(resistors, romObjective, fireEnemyProjectileWithSfx, projectiles)
  updateLogicGates(logicGates)
  repelFromCapacitors(capacitors, [resistors, logicGates])

  const hittables = [...resistors, ...logicGates, ...busJammers]
  updateProjectiles(projectiles, hittables, romObjective, damageObjective)
  resistors = resistors.filter((e) => e.hp > 0)
  logicGates = logicGates.filter((g) => g.hp > 0)
  busJammers = busJammers.filter((j) => j.hp > 0)

  collectPickups(pickups, player, pickupStockpile, () => playSfx('healthPickup'))
  checkGlitchContact(glitchTokens, player, status)

  if (romObjective.active && resistors.length === 0 && currentLevel === 1) {
    romObjective.active = false
  }
  if (romObjective.active && romObjective.hp <= 0) {
    gameOver = true
  }

  updateHud()

  renderRoom(ctx, canvas, rooms, roomKey, player)
  renderChipProps(ctx, canvas, LEVELS[currentLevel].chips)
  renderCapacitors(ctx, canvas, capacitors, player.roomCol, player.roomRow)
  renderResistors(ctx, canvas, resistors, player.roomCol, player.roomRow)
  renderLogicGates(ctx, canvas, logicGates, player.roomCol, player.roomRow)
  renderBusJammers(ctx, canvas, busJammers, player.roomCol, player.roomRow)
  renderProjectiles(ctx, canvas, projectiles, player.roomCol, player.roomRow)
  renderPickups(ctx, canvas, pickups, player.roomCol, player.roomRow)
  renderGlitchTokens(ctx, canvas, glitchTokens, player.roomCol, player.roomRow)

  requestAnimationFrame(loop)
}

loop()