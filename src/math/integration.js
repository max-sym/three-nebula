import { INTEGRATION_TYPE_EULER } from './constants';
import { DEFAULT_SYSTEM_DELTA } from '../core/constants';

export const eulerIntegrationEmitter = (particle, time, damping) => {
  if (particle.sleep) {
    return;
  }

  particle.old.position.copy(particle.position);
  particle.old.velocity.copy(particle.velocity);
  particle.acceleration.scalar(1 / particle.mass);
  particle.velocity.add(particle.acceleration.scalar(time));
  particle.position.add(particle.old.velocity.scalar(time));
  damping &&
    particle.velocity.scalar(Math.pow(damping, time / DEFAULT_SYSTEM_DELTA));
  particle.acceleration.clear();
};

/**
 * Performs euler integration on the particle.
 *
 * @param {Particle} particle - The particle to integrate
 * @param {number} time - The factor of time to use
 * @param {number} damping - The damping to use
 * @return void
 */
const eulerIntegration = (particle, time, damping) => {
  if (particle.sleep) {
    return;
  }

  const isLast = particle.index === particle.parent.particles.length - 1;

  let oldParticle = isLast
    ? particle
    : particle.parent.particles[particle.index + 1];

  const timeFraction = time / particle.fractions;

  particle.position.copy(oldParticle.position);
  particle.velocity.copy(oldParticle.velocity);

  particle.position.add(particle.velocity.clone().scalar(timeFraction));
  particle.acceleration.scalar(1 / particle.mass);
  particle.velocity.add(particle.acceleration.scalar(timeFraction));
  damping &&
    particle.velocity.scalar(
      Math.pow(damping, timeFraction / DEFAULT_SYSTEM_DELTA)
    );
};

/**
 * Performs the chosen integration on the particle.
 * Defaults to euler integration.
 *
 * @param {Particle} particle - The particle to integrate
 * @param {number} time - The factor of time to use
 * @param {number} damping - The damping to use
 * @param {string} [type=INTEGRATION_TYPE_EULER] - The algorithm to use
 * @return void
 */
export const integrate = (
  particle,
  time,
  damping,
  type = INTEGRATION_TYPE_EULER
) => {
  switch (type) {
    case INTEGRATION_TYPE_EULER:
      eulerIntegration(particle, time, damping);
      break;
    default:
      eulerIntegration(particle, time, damping);
  }
};
