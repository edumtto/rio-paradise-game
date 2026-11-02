import * as THREE from "three";

const GROUND_SIZE = 20;

export class World {
  constructor(scene) {
    this.group = new THREE.Group();

    this.group.add(this.#createGround());
    this.group.add(this.#createLights());

    scene.add(this.group);
  }

  #createGround() {
    const geometry = new THREE.PlaneGeometry(GROUND_SIZE, GROUND_SIZE);
    const material = new THREE.MeshStandardMaterial({ color: 0x5fa84e });
    const ground = new THREE.Mesh(geometry, material);

    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;

    return ground;
  }

  #createLights() {
    const group = new THREE.Group();

    const ambient = new THREE.AmbientLight(0xffffff, 0.6);

    const sun = new THREE.DirectionalLight(0xffffff, 1);
    sun.position.set(5, 10, 5);
    sun.castShadow = true;

    // Default shadow frustum is only 10x10, too small to cover the whole
    // ground, so the shadow vanishes once the character nears the edges.
    const shadowExtent = GROUND_SIZE / 2;
    sun.shadow.camera.left = -shadowExtent;
    sun.shadow.camera.right = shadowExtent;
    sun.shadow.camera.top = shadowExtent;
    sun.shadow.camera.bottom = -shadowExtent;
    sun.shadow.camera.near = 1;
    sun.shadow.camera.far = 30;
    sun.shadow.mapSize.set(2048, 2048);

    group.add(ambient, sun);

    return group;
  }

  /** Half-width of the ground, used by the character to clamp movement. */
  static get bounds() {
    return GROUND_SIZE / 2;
  }
}
