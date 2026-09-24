const SFX_PATHS = {
  playerLaser: '/sounds/player_laser.wav',
  resistorLaser: '/sounds/resistor_laser.mp3',
  cpuLaser: '/sounds/cpu_laser.wav',
  healthPickup: '/sounds/health_pickup.wav',
  healthRestored: '/sounds/health_restored.mp3',
}

export function playSfx(key, volume = 0.6) {
  const path = SFX_PATHS[key]
  if (!path) return
  const audio = new Audio(path)
  audio.volume = volume
  audio.play().catch(() => {})
}