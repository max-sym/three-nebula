const {
  Alpha,
  Body,
  VectorVelocity,
  Color,
  CrossZone,
  Emitter,
  Force,
  Gravity,
  Life,
  Mass,
  RadialVelocity,
  Radius,
  Rate,
  Scale,
  ScreenZone,
  Span,
  SpriteRenderer,
  GPURenderer,
  Vector3D,
  Position,
  PointZone,
} = window.Nebula;

const ParticleSystem = window.Nebula.default;

const createSprite = () => {
  const map = new THREE.TextureLoader().load('/assets/dot.png');
  const material = new THREE.SpriteMaterial({
    map: map,
    blending: THREE.AdditiveBlending,
  });

  return new THREE.Sprite(material);
};

const createEmitter = side => {
  const emitter = new Emitter();

  return emitter
    .setSubsteps(50)
    .setRate(new Rate(1, new Span(0.016 / emitter.substeps)))
    .addInitializers([
      new Body(createSprite()),
      new Mass(1),
      new Life(0.08),
      new Position(new PointZone(0, 0, 0)),
      new VectorVelocity(new Vector3D(2000 * side, 0, 0), 1),
    ])
    .addBehaviours([
      new Alpha(1, 0),
      new Scale(0.5, new Span(1, 2)),
      new Color(0x5555ff, 0xff0000),
      new Gravity(500),
    ])
    .emit();
};

window.init = async ({ scene, camera, renderer }) => {
  const system = new ParticleSystem();
  const emitterL = createEmitter(-1);
  const emitterR = createEmitter(1);
  const systemRenderer = new GPURenderer(scene, THREE);

  camera.position.set(0, -50, 100);
  const box = new THREE.BoxGeometry(1, 1, 1);
  const mesh = new THREE.Mesh(
    box,
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
  );
  scene.add(mesh);

  return system
    .addEmitter(emitterL)
    .addEmitter(emitterR)
    .addRenderer(systemRenderer);
};

// class Rate extends RateCore {
//   getValue(time) {
//     this.startTime += time;

//     const qt = Math.round(this.startTime / this.nextTime);

//     if (!qt) return 0;

//     this.init();

//     if (this.numPan.b == 1) {
//       if (this.numPan.getValue('Float') > 0.5) return qt;
//       else return 0;
//     } else {
//       return this.numPan.getValue('Int') * qt;
//     }
//   }
// }
