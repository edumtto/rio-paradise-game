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

  update(delta, moveVector, buildings = []) {
    if (moveVector.x === 0 && moveVector.z === 0) return;

    const limit = World.bounds - HALF_SIZE;
    const { x, z } = this.mesh.position;

    // Resolve each axis separately so the character slides along a
    // building's wall instead of getting stuck when moving diagonally.
    const nextX = THREE.MathUtils.clamp(x + moveVector.x * MOVE_SPEED * delta, -limit, limit);
    if (!this.#collidesWithAny(nextX, z, buildings)) {
      this.mesh.position.x = nextX;
    }

    const nextZ = THREE.MathUtils.clamp(z + moveVector.z * MOVE_SPEED * delta, -limit, limit);
    if (!this.#collidesWithAny(this.mesh.position.x, nextZ, buildings)) {
      this.mesh.position.z = nextZ;
    }
  }

  #collidesWithAny(x, z, buildings) {
    return buildings.some((box) =>
      x + HALF_SIZE > box.minX &&
      x - HALF_SIZE < box.maxX &&
      z + HALF_SIZE > box.minZ &&
      z - HALF_SIZE < box.maxZ
    );
  }
}
