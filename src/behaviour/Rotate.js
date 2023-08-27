import { DR, PI } from '../constants';
import { MathUtils, Vector3D, createSpan } from '../math';

import Behaviour from './Behaviour';
import { getEasingByName } from '../ease';
import { BEHAVIOUR_TYPE_ROTATE as type } from './types';

// Enums
const RotationTypeSame = 1;
const RotationTypeSet = 2;
const RotationTypeTo = 3;
const RotationTypeAdd = 4;

/**
 * Behaviour that rotates particles.
 */
export default class Rotate extends Behaviour {
  /**
   * Constructs a Rotate behaviour instance.
   *
   * @param {number} x - X axis rotation
   * @param {number} y - Y axis rotation
   * @param {number} z - Z axis rotation
   * @param {number} life - The life of the behaviour
   * @param {function} easing - The easing equation to use for transforms
   * @param {boolean} [isEnabled=true] - Determines if the behaviour will be applied or not
   * @return void
   */
  constructor(x, y, z, life, easing, isEnabled = true) {
    super(life, easing, type, isEnabled);

    this.reset(x, y, z);
  }

  /**
   * Gets the rotation type.
   *
   * @return {string}
   */
  get rotationType() {
    return this._rotationType;
  }

  /**
   * Sets the rotation type.
   *
   * @param {string}
   * @return void
   */
  set rotationType(rotationType) {
    /**
     * @desc The rotation type. ENUM of ['same', 'set', 'to', 'add'].
     * @type {string}
     */
    this._rotationType = rotationType;
  }

  /**
   * Resets the behaviour properties.
   *
   * @param {number} x - X axis rotation
   * @param {number} y - Y axis rotation
   * @param {number} z - Z axis rotation
   * @param {number} life - the life of the behaviour
   * @param {function} easing - the easing equation to use for transforms
   * @return void
   */
  reset(x, y, z, life, easing) {
    /**
     * @desc X axis rotation.
     * @type {number|Span}
     */
    this.x = x || 0;

    /**
     * @desc Y axis rotation.
     * @type {number|Span}
     */
    this.y = y || 0;

    /**
     * @desc Z axis rotation.
     * @type {number|Span}
     */
    this.z = z || 0;

    if (x === undefined || x == RotationTypeSame) {
      this.rotationType = RotationTypeSame;
    } else if (y == undefined) {
      this.rotationType = RotationTypeSet;
    } else if (z === undefined) {
      this.rotationType = RotationTypeTo;
    } else {
      this.rotationType = RotationTypeAdd;
      this.x = createSpan(this.x * DR);
      this.y = createSpan(this.y * DR);
      this.z = createSpan(this.z * DR);
    }

    life && super.reset(life, easing);
  }

  /**
   * Initializes the behaviour on a particle.
   *
   * @param {object} particle - the particle to initialize the behaviour on
   * @return void
   */
  initialize(particle) {
    switch (this.rotationType) {
      case RotationTypeSame:
        break;

      case RotationTypeSet:
        this._setRotation(particle.rotation, this.x);
        break;

      case RotationTypeTo:
        particle.transform.fR = particle.transform.fR || new Vector3D();
        particle.transform.tR = particle.transform.tR || new Vector3D();
        this._setRotation(particle.transform.fR, this.x);
        this._setRotation(particle.transform.tR, this.y);
        break;

      case RotationTypeAdd:
        particle.transform.addR = new Vector3D(
          this.x.getValue(),
          this.y.getValue(),
          this.z.getValue()
        );
        break;
    }
  }

  /**
   * Sets the particle's rotation prior to the behaviour being applied.
   *
   * NOTE It's hard to see here, but this is mutating the particle's rotation
   * even though the particle is not being passed in directly.
   *
   * NOTE the else if below will never be reached because the value being passed in
   * will never be of type Vector3D.
   *
   * @param {Vector3D} particleRotation - the particle's rotation vector
   * @param {string|number} value - the value to set the rotation value to, if 'random'
   * rotation is randomised
   * @return void
   */
  _setRotation(particleRotation, value) {
    particleRotation = particleRotation || new Vector3D();
    if (value == 'random') {
      var x = MathUtils.randomAToB(-PI, PI);
      var y = MathUtils.randomAToB(-PI, PI);
      var z = MathUtils.randomAToB(-PI, PI);

      particleRotation.set(x, y, z);
    }
    // we can't ever get here because value will never be a Vector3D!
    // consider refactoring to
    //  if (value instance of Span) { vec3.add(value.getValue()); }
    else if (value instanceof Vector3D) {
      particleRotation.copy(value);
    }
  }

  /**
   * Mutates the particle.rotation property.
   *
   * @see http://stackoverflow.com/questions/21622956/how-to-convert-direction-vector-to-euler-angles
   * @param {object} particle - the particle to apply the behaviour to
   * @param {number} time - engine time
   * @return void
   */
  mutate(particle, time) {
    this.energize(particle, time);

    switch (this.rotationType) {
      // orients the particle in the direction it is moving
      case RotationTypeSame:
        if (!particle.rotation) {
          particle.rotation = new Vector3D();
        }

        particle.rotation.copy(particle.velocity);
        break;

      case RotationTypeSet:
        //
        break;

      case RotationTypeTo:
        particle.rotation.x = MathUtils.lerp(
          particle.transform.fR.x,
          particle.transform.tR.x,
          this.energy
        );
        particle.rotation.y = MathUtils.lerp(
          particle.transform.fR.y,
          particle.transform.tR.y,
          this.energy
        );
        particle.rotation.z = MathUtils.lerp(
          particle.transform.fR.z,
          particle.transform.tR.z,
          this.energy
        );
        break;

      case RotationTypeAdd:
        particle.rotation.add(particle.transform.addR);
        break;
    }
  }

  static fromJSON(json) {
    const { x, y, z, life, easing, isEnabled = true } = json;

    return new Rotate(x, y, z, life, getEasingByName(easing), isEnabled);
  }
}
