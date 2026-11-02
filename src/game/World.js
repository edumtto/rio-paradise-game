import * as THREE from "three";

const GROUND_SIZE = 20;

// Buildings sit near the ground's edges so they frame the scenario
// without blocking the view of the character in the middle.
const BUILDING_LAYOUT = [
  { x: -8, z: -8, width: 3, depth: 3, height: 5, color: 0xa3a3a3 },
  { x: 8, z: -8, width: 3, depth: 4, height: 7, color: 0x8c8c99 },
  { x: -8, z: 8, width: 4, depth: 3, height: 4, color: 0x9c8c7a },
  { x: 8, z: 8, width: 3, depth: 3, height: 6, color: 0xa39080 },
  { x: 0, z: -9, width: 4, depth: 2, height: 5, color: 0x8f9aa3 },
  { x: 0, z: 9, width: 4, depth: 2, height: 5, color: 0x8f9aa3 },
];

export class World {
  constructor(scene) {
    this.group = new THREE.Group();

    this.group.add(this.#createGround());
    this.group.add(this.#createLights());

    const { group: buildingsGroup, aabbs } = this.#createBuildings();
    this.group.add(buildingsGroup);
    this.buildings = aabbs;

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

  #createBuildings() {
    const group = new THREE.Group();
    const aabbs = [];

    for (const building of BUILDING_LAYOUT) {
      const { x, z, width, depth, height, color } = building;

      const geometry = new THREE.BoxGeometry(width, height, depth);
      const material = new THREE.MeshStandardMaterial({ color });
      const mesh = new THREE.Mesh(geometry, material);

      mesh.position.set(x, height / 2, z);
      mesh.castShadow = true;
      mesh.receiveShadow = true;

      group.add(mesh);

      aabbs.push({
        minX: x - width / 2,
        maxX: x + width / 2,
        minZ: z - depth / 2,
        maxZ: z + depth / 2,
      });
    }

    return { group, aabbs };
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
