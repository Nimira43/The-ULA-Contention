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
        <div class="hud-stats" id="hud-level-stats" style="display:none">
          <div class="hud-row" id="hud-gauge-row" style="display:none">
            <span id="hud-gauge-label"></span><span id="hud-gauge-value"></span>
          </div>
          <div class="hud-row" id="hud-remaining-row" style="display:none">
            <span id="hud-remaining-label"></span><span id="hud-remaining-value"></span>
          </div>
          <div class="hud-row" id="hud-lives-row" style="display:none">
            <span>Lives</span><span id="hud-lives"></span>
          </div>
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
    levelStats: appEl.querySelector('#hud-level-stats'),
    gaugeRow: appEl.querySelector('#hud-gauge-row'),
    gaugeLabel: appEl.querySelector('#hud-gauge-label'),
    gaugeValue: appEl.querySelector('#hud-gauge-value'),
    remainingRow: appEl.querySelector('#hud-remaining-row'),
    remainingLabel: appEl.querySelector('#hud-remaining-label'),
    remainingValue: appEl.querySelector('#hud-remaining-value'),
    livesRow: appEl.querySelector('#hud-lives-row'),
    lives: appEl.querySelector('#hud-lives'),
    areaNum: appEl.querySelector('#hud-area-num'),
    areaName: appEl.querySelector('#hud-area-name'),
    status: appEl.querySelector('#hud-status'),
  }

  return { canvas, hud }
}

const show = (el, visible) => {
  el.style.display = visible ? '' : 'none'
}

export function updateHud(hud, state, player, level, rules) {
  hud.life.textContent = `${Math.round(player.health)}%`
  hud.laser.textContent = `${Math.round(state.energy.value)}%`
  hud.pickups.textContent = state.pickupStockpile.count
  hud.areaNum.textContent = `Area ${String(state.currentLevel).padStart(2, '0')}`
  hud.areaName.textContent = level.areaName
  hud.status.textContent = level.status

  const gauge = rules.gauge ? rules.gauge(state) : null
  show(hud.gaugeRow, Boolean(gauge))
  if (gauge) {
    hud.gaugeLabel.textContent = gauge.label
    hud.gaugeValue.textContent = gauge.value
  }

  const hasRemaining = Boolean(rules.remaining)
  show(hud.remainingRow, hasRemaining)
  if (hasRemaining) {
    hud.remainingLabel.textContent = rules.remainingLabel
    hud.remainingValue.textContent = rules.remaining(state)
  }

  show(hud.livesRow, Boolean(rules.usesLives))
  if (rules.usesLives) hud.lives.textContent = state.lives

  show(hud.levelStats, Boolean(gauge) || hasRemaining || Boolean(rules.usesLives))
}