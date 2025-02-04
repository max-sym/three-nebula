import { DEFAULT_SYSTEM_DELTA } from '../core/constants';

/**
 * Performs the chosen integration on the particle.
 * Defaults to euler integration.
 *
 * @param {Particle} particle - The particle to integrate
 * @param {number} time - The factor of time to use
 * @param {number} damping - The damping to use
 * @return void
 */
export const integrate = (particle, time, damping) => {
  if (particle.sleep) return;

  particle.position.add(particle.velocity.clone().multiplyScalar(time));
  particle.acceleration.multiplyScalar(1 / particle.mass);
  particle.velocity.add(particle.acceleration.multiplyScalar(time));
  damping &&
    particle.velocity.multiplyScalar(
      Math.pow(damping, time / DEFAULT_SYSTEM_DELTA)
    );
  particle.acceleration.clear();
};
