import Initializer from './Initializer';

export class AirResistance extends Initializer {
  constructor(resistance) {
    super();
    this.resistance = resistance;
  }
  initialize(particle) {
    particle.damping = this.resistance;
  }
}
