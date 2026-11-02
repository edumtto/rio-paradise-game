import * as THREE from "three";
import { World } from "./World.js";

const MOVE_SPEED = 4; // units per second
const HALF_SIZE = 0.5;

export class Character {
  constructor(scene) {
    const geometry = new THREE.BoxGeometry(1, 3, 1);
    const material = new THREE.MeshStandardMaterial({ color: 0xdb5f34 });

    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.set(0, HALF_SIZE, 0);
    this.mesh.castShadow = true;

    scene.add(this.mesh);
  }

  update(delta, moveVector) {
    if (moveVector.x === 0 && moveVector.z === 0) return;

    const limit = World.bounds - HALF_SIZE;

    this.mesh.position.x += moveVector.x * MOVE_SPEED * delta;
    this.mesh.position.z += moveVector.z * MOVE_SPEED * delta;

    this.mesh.position.x = THREE.MathUtils.clamp(this.mesh.position.x, -limit, limit);
    this.mesh.position.z = THREE.MathUtils.clamp(this.mesh.position.z, -limit, limit);
  }
}
