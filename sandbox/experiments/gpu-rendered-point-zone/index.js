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
  Rate: RateCore,
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

const createEmitter = () => {
  const emitter = new Emitter();

  return emitter
    .setRate(new Rate(new Span(10, 10), new Span(0.01)))
    .addInitializers([
      new Body(createSprite()),
      new Mass(1),
      new Life(0.05),
      new Position(new PointZone(0, 0, 0)),
      new VectorVelocity(new Vector3D(1000, 0, 0), 10),
    ])
    .addBehaviours([
      new Scale(1, 1),
      new Color(0xffffff, 0xffffff),
      new Gravity(300),
    ])
    .emit();
};

window.init = async ({ scene, camera, renderer }) => {
  const system = new ParticleSystem();
  const emitter = createEmitter();
  const systemRenderer = new GPURenderer(scene, THREE);

  camera.position.set(0, -50, 100);
  const box = new THREE.BoxGeometry(1, 1, 1);
  const mesh = new THREE.Mesh(
    box,
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
  );
  scene.add(mesh);

  return system.addEmitter(emitter).addRenderer(systemRenderer);
};

class Rate extends RateCore {
  getValue(time) {
    this.startTime += time;

    const qt = Math.round(this.startTime / this.nextTime);

    if (!qt) return 0;

    this.init();

    if (this.numPan.b == 1) {
      if (this.numPan.getValue('Float') > 0.5) return qt;
      else return 0;
    } else {
      return this.numPan.getValue('Int') * qt;
    }
  }
}
