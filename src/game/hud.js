import { objectiveHealthPercent } from './objective.js'
import { cpuBossStabilityPercent } from './cpuboss.js'
import { ulaBossHealthPercent } from './ulaboss.js'

export function createHudDom(appEl) {
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
        <div class="hud-row" id="hud-boss-row" style="display:none">
          <span id="hud-boss-label"></span><span id="hud-boss-value"></span>
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

  const canvas = appEl.querySelector('#game-canvas')
  const hud = {
    life: appEl.querySelector('#hud-life'),
    laser: appEl.querySelector('#hud-laser'),
    pickups: appEl.querySelector('#hud-pickups'),
    bossRow: appEl.querySelector('#hud-boss-row'),
    bossLabel: appEl.querySelector('#hud-boss-label'),
    bossValue: appEl.querySelector('#hud-boss-value'),
    areaNum: appEl.querySelector('#hud-area-num'),
    areaName: appEl.querySelector('#hud-area-name'),
    status: appEl.querySelector('#hud-status'),
  }

  return { canvas, hud }
}

export function updateHud(hud, state, player, level) {
  hud.life.textContent = `${Math.round(player.health)}%`
  hud.laser.textContent = '43%'
  hud.pickups.textContent = state.pickupStockpile.count
  hud.areaNum.textContent = `Area ${String(state.currentLevel).padStart(2, '0')}`
  hud.areaName.textContent = level.areaName
  hud.status.textContent = level.status

  if (state.romObjective.active) {
    hud.bossRow.style.display = ''
    hud.bossLabel.textContent = 'ROM Health'
    hud.bossValue.textContent = `${objectiveHealthPercent(state.romObjective)}%`
  } else if (state.psuObjective.active) {
    hud.bossRow.style.display = ''
    hud.bossLabel.textContent = 'PSU Health'
    hud.bossValue.textContent = `${objectiveHealthPercent(state.psuObjective)}%`
  } else if (state.currentLevel === 5 && state.cpuBoss.length > 0) {
    hud.bossRow.style.display = ''
    hud.bossLabel.textContent = 'CPU Stability'
    hud.bossValue.textContent = `${cpuBossStabilityPercent(state.cpuBoss)}%`
  } else if (state.currentLevel === 9 && state.ulaBoss.length > 0) {
    hud.bossRow.style.display = ''
    hud.bossLabel.textContent = 'ULA Integrity'
    hud.bossValue.textContent = `${ulaBossHealthPercent(state.ulaBoss)}%`
  } else {
    hud.bossRow.style.display = 'none'
  }
}