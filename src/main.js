import './css/styles.css'
import { generateGrid, roomKey } from './game/grid.js'
import { createPlayer, movePlayer, damagePlayer } from './game/player.js'
import { renderRoom, renderChipProps } from './game/render.js'
import {
  spawnSwarm,
  spawnRamLeakers,
  spawnFastResistors,
  makeSplitChild,
  updateResistors,
  updateFastDash,
  checkFastResistorContact,
  updateResistorAttacks,
  renderResistors,
} from './game/enemies.js'
import {
  fireZap,
  fireEnemyProjectile,
  fireEnemyProjectileAtPlayer,
  updateProjectiles,
  renderProjectiles,
} from './game/projectiles.js'
import { createObjective, damageObjective, objectiveHealthPercent } from './game/objective.js'
import { spawnHealthPickups, collectPickups, useHealthPickup, renderPickups } from './game/pickups.js'
import { spawnGlitchTokens, checkGlitchContact, applyGlitch, renderGlitchTokens } from './game/hazards.js'
import { spawnLogicGates, updateLogicGates, renderLogicGates } from './game/logicgates.js'
import {
  spawnBusJammer,
  activateHunt,
  updateBusJammerHunt,
  updateBusJammerAttacks,
  renderBusJammers,
} from './game/busjammer.js'
import {
  spawnCapacitors,
  spawnHostileCapacitors,
  repelFromCapacitors,
  checkHostileCapacitorContact,
  damageCapacitor,
  renderCapacitors,
} from './game/capacitors.js'
import { spawnLeakZones, updateLeakZones, renderLeakZones } from './game/leakzones.js'
import {
  spawnCorruptionBalls,
  splitCorruptionBall,
  updateCorruptionBalls,
  renderCorruptionBalls,
} from './game/corruptionballs.js'
import { createMusicPlayer } from './game/music.js'
import { playSfx } from './game/sfx.js'
import { playLoadingScreen } from './game/loadingScreen.js'
import { LEVELS } from './game/levels.js'

const appEl = document.querySelector('#app')
const music = createMusicPlayer(0.4)

playLoadingScreen(appEl, music, startGame)

function startGame() {
  appEl.innerHTML = `
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
  let leakZones = []
  let corruptionBalls = []
  const projectiles = []
  const pickupStockpile = { count: 0 }
  let pickups = []
  let glitchTokens = []
  const status = { glitchTimer: 0 }
  let gameOver = false
  let levelWon = false

  function fireEnemyProjectileWithSfx(source, objective, projectiles) {
    playSfx('resistorLaser')
    fireEnemyProjectile(source, objective, projectiles)
  }

  function fireAtPlayerWithSfx(source, player, projectiles) {
    playSfx('resistorLaser')
    fireEnemyProjectileAtPlayer(source, player, projectiles)
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

  function startLevel3() {
    logicGates = spawnLogicGates(2, startCol, startRow, {
      kind: 'wraith',
      chargedDuration: 90,
      dischargedDuration: 150,
      burstShots: 1,
    })
    resistors = spawnRamLeakers(4, startCol, startRow)
    leakZones = spawnLeakZones(3, startCol, startRow)
    pickups = spawnHealthPickups(2, startCol, startRow)
  }

  function keepAwayFromCentre(entities, minDist = 0.22, cx = 0.5, cy = 0.5) {
    for (const e of entities) {
      const dist = Math.hypot(e.x - cx, e.y - cy)
      if (dist < minDist) {
        const angle = Math.random() * Math.PI * 2
        e.x = Math.min(0.9, Math.max(0.1, cx + Math.cos(angle) * minDist))
        e.y = Math.min(0.9, Math.max(0.1, cy + Math.sin(angle) * minDist))
      }
    }
  }

  function startLevel4() {
    resistors = spawnFastResistors(3, startCol, startRow)
    keepAwayFromCentre(resistors)
    capacitors = spawnHostileCapacitors(1, startCol, startRow)
    keepAwayFromCentre(capacitors)
    corruptionBalls = spawnCorruptionBalls(3, startCol, startRow)
    pickups = spawnHealthPickups(2, startCol, startRow)
  }

  function clearAllEncounters() {
    resistors = []
    pickups = []
    glitchTokens = []
    logicGates = []
    busJammers = []
    capacitors = []
    leakZones = []
    corruptionBalls = []
    romObjective.active = false
  }

  function spawnLevelEnemies() {
    clearAllEncounters()
    player.health = 100
    gameOver = false
    levelWon = false
    if (currentLevel === 1) startLevel1Fight()
    if (currentLevel === 2) startLevel2()
    if (currentLevel === 3) startLevel3()
    if (currentLevel === 4) startLevel4()
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

  const rawInput = { up: false, down: false, left: false, right: false, fire: false }
  const keyMap = {
    ArrowUp: 'up', w: 'up', W: 'up',
    ArrowDown: 'down', s: 'down', S: 'down',
    ArrowLeft: 'left', a: 'left', A: 'left',
    ArrowRight: 'right', d: 'right', D: 'right',
  }

  const FIRE_COOLDOWN_FRAMES = 10 // ~6 shots/sec @ 60fps
  let fireCooldown = 0

  function isDoorBlocked(col, row, dir) {
    return busJammers.some(
      (j) => j.hp > 0 && j.roomCol === col && j.roomRow === row && j.doorSide === dir
    )
  }

  window.addEventListener('keydown', (e) => {
    if (['1', '2', '3', '4', '5'].includes(e.key)) {
      currentLevel = Number(e.key)
      spawnLevelEnemies()
      updateHud()
      if (!loopRunning) {
        loopRunning = true
        loop()
      }
    }

    const dir = keyMap[e.key]
    if (dir) rawInput[dir] = true

    if (e.key === ' ') rawInput.fire = true
    if (e.key.toLowerCase() === 'h' && !e.repeat) {
      if (useHealthPickup(pickupStockpile, player)) playSfx('healthRestored')
    }
  })
  window.addEventListener('keyup', (e) => {
    const dir = keyMap[e.key]
    if (dir) rawInput[dir] = false
    if (e.key === ' ') rawInput.fire = false
  })

  spawnLevelEnemies()
  updateHud()

  let loopRunning = false

  function loop() {
    if (gameOver) {
      ctx.fillStyle = '#000'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = '#ff3b3b'
      ctx.font = "40px 'VT323', monospace"
      ctx.textAlign = 'center'
      ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2)
      loopRunning = false
      return
    }
    if (levelWon) {
      ctx.fillStyle = '#000'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = '#81f681'
      ctx.font = "40px 'VT323', monospace"
      ctx.textAlign = 'center'
      ctx.fillText('CORRUPTION CLEARED!', canvas.width / 2, canvas.height / 2)
      loopRunning = false
      return
    }

    const input = applyGlitch(status, rawInput)

    movePlayer(player, input, rooms, roomKey, isDoorBlocked)

    fireCooldown -= 1
    if (rawInput.fire && fireCooldown <= 0) {
      fireZap(player, projectiles)
      playSfx('playerLaser')
      fireCooldown = FIRE_COOLDOWN_FRAMES
    }

    updateResistors(resistors)
    updateFastDash(resistors, player)
    checkFastResistorContact(resistors, player, damagePlayer)
    updateResistorAttacks(resistors, romObjective, fireEnemyProjectileWithSfx, projectiles)
    updateLogicGates(logicGates, player, projectiles, fireAtPlayerWithSfx)

    if (currentLevel === 2 && logicGates.length === 0) {
      for (const j of busJammers) {
        if (j.mode === 'blocking') activateHunt(j)
      }
    }
    updateBusJammerHunt(busJammers, player)
    updateBusJammerAttacks(busJammers, player, projectiles, fireAtPlayerWithSfx)

    repelFromCapacitors(capacitors, [resistors, logicGates])
    checkHostileCapacitorContact(capacitors, player, damagePlayer)
    updateLeakZones(leakZones, player, damagePlayer)
    updateCorruptionBalls(corruptionBalls, player, damagePlayer)

    const hittables = [...resistors, ...logicGates, ...busJammers, ...leakZones, ...corruptionBalls]
    updateProjectiles(projectiles, hittables, {
      objective: romObjective,
      damageObjectiveFn: damageObjective,
      player,
      capacitors,
      damageCapacitorFn: damageCapacitor,
      damagePlayerFn: damagePlayer,
    })

    const splitting = resistors.filter((e) => e.hp <= 0 && e.splitOnDeath)
    for (const parent of splitting) {
      resistors.push(makeSplitChild(parent), makeSplitChild(parent))
    }

    const poppedBalls = corruptionBalls.filter((b) => b.hp <= 0)
    for (const ball of poppedBalls) {
      corruptionBalls.push(...splitCorruptionBall(ball))
    }

    resistors = resistors.filter((e) => e.hp > 0)
    logicGates = logicGates.filter((g) => g.hp > 0)
    busJammers = busJammers.filter((j) => j.hp > 0)
    capacitors = capacitors.filter((c) => c.hp > 0)
    leakZones = leakZones.filter((z) => z.hp > 0)
    corruptionBalls = corruptionBalls.filter((b) => b.hp > 0)

    collectPickups(pickups, player, pickupStockpile, () => playSfx('healthPickup'))
    checkGlitchContact(glitchTokens, player, status)

    if (romObjective.active && resistors.length === 0 && currentLevel === 1) {
      romObjective.active = false
    }

    if (romObjective.active && romObjective.hp <= 0) {
      gameOver = true
    }
    
    if (player.health <= 0) {
      gameOver = true
    }
    
    if (currentLevel === 4 && corruptionBalls.length === 0) {
      levelWon = true
    }

    updateHud()

    renderRoom(ctx, canvas, rooms, roomKey, player)
    renderChipProps(ctx, canvas, LEVELS[currentLevel].chips)
    renderCapacitors(ctx, canvas, capacitors, player.roomCol, player.roomRow)
    renderLeakZones(ctx, canvas, leakZones, player.roomCol, player.roomRow)
    renderResistors(ctx, canvas, resistors, player.roomCol, player.roomRow)
    renderCorruptionBalls(ctx, canvas, corruptionBalls, player.roomCol, player.roomRow)
    renderLogicGates(ctx, canvas, logicGates, player.roomCol, player.roomRow)
    renderBusJammers(ctx, canvas, busJammers, player.roomCol, player.roomRow)
    renderProjectiles(ctx, canvas, projectiles, player.roomCol, player.roomRow)
    renderPickups(ctx, canvas, pickups, player.roomCol, player.roomRow)
    renderGlitchTokens(ctx, canvas, glitchTokens, player.roomCol, player.roomRow)

    requestAnimationFrame(loop)
  }

  loopRunning = true
  loop()

} 