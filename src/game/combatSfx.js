import { playSfx } from './sfx.js'
import { fireEnemyProjectile, fireEnemyProjectileAtPlayer } from './projectiles.js'

export function fireEnemyProjectileWithSfx(source, objective, projectiles) {
  playSfx('resistorLaser')
  fireEnemyProjectile(source, objective, projectiles)
}

export function fireAtPlayerWithSfx(source, player, projectiles) {
  playSfx('resistorLaser')
  fireEnemyProjectileAtPlayer(source, player, projectiles)
}

export function fireCpuLaserAtPlayer(source, player, projectiles) {
  playSfx('cpuLaser')
  fireEnemyProjectileAtPlayer(source, player, projectiles)
}

export function fireUlaLaserAtPlayer(source, player, projectiles) {
  playSfx('ulaLaser')
  fireEnemyProjectileAtPlayer(source, player, projectiles)
}
