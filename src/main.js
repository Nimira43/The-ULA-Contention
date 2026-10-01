import './css/styles.css'
import { generateGrid, roomKey } from './game/grid.js'
import { createPlayer, movePlayer, damagePlayer } from './game/player.js'
import { renderRoom, renderChipProps } from './game/render.js'
import {
  updateResistors,
  updateFastDash,
  checkResistorContactDamage,
  updateResistorAttacks,
  makeSplitChild,
  renderResistors,
} from './game/enemies.js'
import { fireZap, updateProjectiles, renderProjectiles } from './game/projectiles.js'
import { damageObjective } from './game/objective.js'
import { collectPickups, useHealthPickup, renderPickups } from './game/pickups.js'
import { checkGlitchContact, applyGlitch, renderGlitchTokens } from './game/hazards.js'
import { updateLogicGates, renderLogicGates, SPECTRUM_PALETTE } from './game/logicgates.js'
import { activateHunt, updateBusJammerHunt, updateBusJammerAttacks, renderBusJammers } from './game/busjammer.js'
import {
  repelFromCapacitors,
  checkHostileCapacitorContact,
  damageCapacitor,
  renderCapacitors,
} from './game/capacitors.js'
import { updateLeakZones, renderLeakZones } from './game/leakzones.js'
import { splitCorruptionBall, updateCorruptionBalls, renderCorruptionBalls } from './game/corruptionballs.js'
import { updateCpuBossAttacks, updateCpuBossStabilise, renderCpuBoss } from './game/cpuboss.js'
import { updateUlaBoss, updateUlaBossDestruction, renderUlaBoss } from './game/ulaboss.js'
import { updateC5BossAttacks, updateC5BossDestruction, renderC5Boss } from './game/c5boss.js'
import { createMusicPlayer } from './game/music.js'
import { playSfx } from './game/sfx.js'
import { playLoadingScreen } from './game/loadingscreen.js'
import { LEVELS } from './game/levels.js'
import { createGameState } from './game/gameState.js'
import { spawnLevelEnemies } from './game/levelSetup.js'
import { createHudDom, updateHud } from './game/hud.js'
import {
  fireEnemyProjectileWithSfx,
  fireAtPlayerWithSfx,
  fireCpuLaserAtPlayer,
  fireUlaLaserAtPlayer,
  fireC5LaserAtPlayer,
} from './game/combatSfx.js'
import { KEY_MAP, createInputState, isDoorBlocked } from './game/input.js'

const appEl = document.querySelector('#app')
const music = createMusicPlayer(0.4)

playLoadingScreen(appEl, music, startGame)

function startGame() {
  const { canvas, hud } = createHudDom(appEl)
  const ctx = canvas.getContext('2d')

  const { rooms, startKey } = generateGrid(5, 4, 9)
  const [startCol, startRow] = startKey.split(',').map(Number)
  const player = createPlayer(startCol, startRow)

  const state = createGameState(startCol, startRow)
  const levelCtx = { player, rooms, roomKeyFn: roomKey, startCol, startRow }

  const rawInput = createInputState()
  const FIRE_COOLDOWN_FRAMES = 10 // ~6 shots/sec @ 60fps
  let fireCooldown = 0
  let loopRunning = false
  let frameCount = 0

  const wallCycleColours = SPECTRUM_PALETTE.filter((c) => c !== '#000000')

  window.addEventListener('keydown', (e) => {
    if (['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].includes(e.key)) {
      state.currentLevel = e.key === '0' ? 10 : Number(e.key)
      spawnLevelEnemies(state, levelCtx)
      updateHud(hud, state, player, LEVELS[state.currentLevel])
      if (!loopRunning) {
        loopRunning = true
        loop()
      }
    }

    const dir = KEY_MAP[e.key]
    if (dir) rawInput[dir] = true

    if (e.key === ' ') rawInput.fire = true
    if (e.key.toLowerCase() === 'h' && !e.repeat) {
      if (useHealthPickup(state.pickupStockpile, player)) playSfx('healthRestored')
    }
  })
  window.addEventListener('keyup', (e) => {
    const dir = KEY_MAP[e.key]
    if (dir) rawInput[dir] = false
    if (e.key === ' ') rawInput.fire = false
  })

  spawnLevelEnemies(state, levelCtx)
  updateHud(hud, state, player, LEVELS[state.currentLevel])

  function loop() {
    if (state.gameOver) {
      ctx.fillStyle = '#000'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = '#ff3b3b'
      ctx.font = "40px 'VT323', monospace"
      ctx.textAlign = 'center'
      ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2)
      loopRunning = false
      return
    }
    if (state.levelWon) {
      ctx.fillStyle = '#000'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = '#81f681'
      ctx.font = "40px 'VT323', monospace"
      ctx.textAlign = 'center'
      ctx.fillText(state.winMessage, canvas.width / 2, canvas.height / 2)
      loopRunning = false
      return
    }

    const input = applyGlitch(state.status, rawInput)
    frameCount += 1

    movePlayer(player, input, rooms, roomKey, (col, row, dir) =>
      isDoorBlocked(state.busJammers, col, row, dir)
    )

    fireCooldown -= 1
    if (rawInput.fire && fireCooldown <= 0) {
      fireZap(player, state.projectiles)
      playSfx('playerLaser')
      fireCooldown = FIRE_COOLDOWN_FRAMES
    }

    updateResistors(state.resistors)
    updateFastDash(state.resistors, player)
    checkResistorContactDamage(state.resistors, player, damagePlayer)
    updateResistorAttacks(state.resistors, state.romObjective, fireEnemyProjectileWithSfx, state.projectiles)
    updateResistorAttacks(state.resistors, state.psuObjective, fireEnemyProjectileWithSfx, state.projectiles)
    updateLogicGates(state.logicGates, player, state.projectiles, fireAtPlayerWithSfx)

    if (state.currentLevel === 2 && state.logicGates.length === 0) {
      for (const j of state.busJammers) {
        if (j.mode === 'blocking') activateHunt(j)
      }
    }
    updateBusJammerHunt(state.busJammers, player)
    updateBusJammerAttacks(state.busJammers, player, state.projectiles, fireAtPlayerWithSfx)
    updateCpuBossAttacks(state.cpuBoss, player, state.projectiles, fireCpuLaserAtPlayer)
    updateUlaBoss(state.ulaBoss, player, state.projectiles, fireUlaLaserAtPlayer)
    updateC5BossAttacks(state.c5Boss, player, state.projectiles, fireC5LaserAtPlayer)

    repelFromCapacitors(state.capacitors, [state.resistors, state.logicGates])
    checkHostileCapacitorContact(state.capacitors, player, damagePlayer)
    updateLeakZones(state.leakZones, player, damagePlayer)
    updateCorruptionBalls(state.corruptionBalls, player, damagePlayer)

    const hittables = [
      ...state.resistors,
      ...state.logicGates,
      ...state.busJammers,
      ...state.leakZones,
      ...state.corruptionBalls,
      ...state.cpuBoss,
      ...state.ulaBoss,
      ...state.c5Boss,
    ]
    const activeObjective = state.romObjective.active
      ? state.romObjective
      : state.psuObjective.active
        ? state.psuObjective
        : null
    updateProjectiles(state.projectiles, hittables, {
      objective: activeObjective,
      damageObjectiveFn: damageObjective,
      player,
      capacitors: state.capacitors,
      damageCapacitorFn: damageCapacitor,
      damagePlayerFn: damagePlayer,
    })

    const splitting = state.resistors.filter((e) => e.hp <= 0 && e.splitOnDeath)
    for (const parent of splitting) {
      state.resistors.push(makeSplitChild(parent), makeSplitChild(parent))
    }

    const poppedBalls = state.corruptionBalls.filter((b) => b.hp <= 0)
    for (const ball of poppedBalls) {
      state.corruptionBalls.push(...splitCorruptionBall(ball))
    }

    state.resistors = state.resistors.filter((e) => e.hp > 0)
    state.logicGates = state.logicGates.filter((g) => g.hp > 0)
    state.busJammers = state.busJammers.filter((j) => j.hp > 0)
    state.capacitors = state.capacitors.filter((c) => c.hp > 0)
    state.leakZones = state.leakZones.filter((z) => z.hp > 0)
    state.corruptionBalls = state.corruptionBalls.filter((b) => b.hp > 0)

    updateCpuBossStabilise(state.cpuBoss)
    updateUlaBossDestruction(state.ulaBoss)
    updateC5BossDestruction(state.c5Boss)
    collectPickups(state.pickups, player, state.pickupStockpile, () => playSfx('healthPickup'))
    checkGlitchContact(state.glitchTokens, player, state.status)

    if (state.romObjective.active && state.resistors.length === 0 && state.currentLevel === 1) {
      state.romObjective.active = false
    }

    if (state.romObjective.active && state.romObjective.hp <= 0) {
      state.gameOver = true
    }

    if (state.psuObjective.active && state.resistors.length === 0 && state.currentLevel === 8) {
      state.psuObjective.active = false
      state.levelWon = true
      state.winMessage = 'PSU SECURED!'
    }

    if (state.psuObjective.active && state.psuObjective.hp <= 0) {
      state.gameOver = true
    }

    if (player.health <= 0) {
      if (state.currentLevel === 10) {
        state.lives -= 1
        if (state.lives <= 0) {
          state.gameOver = true
        } else {
          player.health = 100
          for (const section of state.c5Boss) {
            if (!section.destroyed) section.hp = section.maxHp
          }
        }
      } else {
        state.gameOver = true
      }
    }

    if (state.currentLevel === 4 && state.corruptionBalls.length === 0) {
      state.levelWon = true
      state.winMessage = 'CORRUPTION CLEARED!'
    }

    if (state.currentLevel === 5 && state.cpuBoss.length === 0) {
      state.levelWon = true
      state.winMessage = 'CPU STABILISED!'
    }

    if (state.currentLevel === 9 && state.ulaBoss.length === 0) {
      state.levelWon = true
      state.winMessage = 'ULA DEFEATED!'
    }

    if (state.currentLevel === 10 && state.c5Boss.length > 0 && state.c5Boss.every((s) => s.hp <= 0)) {
      state.levelWon = true
      state.winMessage = 'C5 DESTROYED — YOU WIN!'
    }

    updateHud(hud, state, player, LEVELS[state.currentLevel])

    const wallColour =
      state.currentLevel === 6
        ? wallCycleColours[Math.floor(frameCount / 20) % wallCycleColours.length]
        : undefined

    renderRoom(ctx, canvas, rooms, roomKey, player, wallColour)
    renderChipProps(ctx, canvas, LEVELS[state.currentLevel].chips)
    renderCapacitors(ctx, canvas, state.capacitors, player.roomCol, player.roomRow)
    renderLeakZones(ctx, canvas, state.leakZones, player.roomCol, player.roomRow)
    renderResistors(ctx, canvas, state.resistors, player.roomCol, player.roomRow)
    renderCorruptionBalls(ctx, canvas, state.corruptionBalls, player.roomCol, player.roomRow)
    renderCpuBoss(ctx, canvas, state.cpuBoss, player.roomCol, player.roomRow)
    renderUlaBoss(ctx, canvas, state.ulaBoss, player.roomCol, player.roomRow)
    renderC5Boss(ctx, canvas, state.c5Boss, player.roomCol, player.roomRow)
    renderLogicGates(ctx, canvas, state.logicGates, player.roomCol, player.roomRow)
    renderBusJammers(ctx, canvas, state.busJammers, player.roomCol, player.roomRow)
    renderProjectiles(ctx, canvas, state.projectiles, player.roomCol, player.roomRow)
    renderPickups(ctx, canvas, state.pickups, player.roomCol, player.roomRow)
    renderGlitchTokens(ctx, canvas, state.glitchTokens, player.roomCol, player.roomRow)

    requestAnimationFrame(loop)
  }

  loopRunning = true
  loop()
} 