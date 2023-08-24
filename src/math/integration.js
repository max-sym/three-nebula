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

  const isLast = 0 === particle.index;
  const lastInSequence = particle.subindex === 0;

  let oldParticle = particle;

  if (lastInSequence) {
    if (!isLast) {
      oldParticle =
        particle.parent.particles[particle.index - particle.fractions];
    }
  } else {
    if (!isLast) {
      oldParticle = particle.parent.particles[particle.index + 1];
    }
  }
  try {
    particle.position.add(oldParticle.velocity.scalar(time));
    particle.velocity.copy(oldParticle.velocity);
  } catch (e) {
    console.log(
      isLast,
      lastInSequence,
      oldParticle,
      particle.index,
      particle.parent.particles.length
    );
  }

  // particle.acceleration.scalar(1 / particle.mass);
  particle.acceleration.copy(
    oldParticle.acceleration.clone().scalar(1 / particle.mass)
  );

  particle.velocity.add(particle.acceleration.scalar(time));

  damping &&
    particle.velocity.scalar(Math.pow(damping, time / DEFAULT_SYSTEM_DELTA));
  particle.acceleration.clear();
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
