import * as THREE from "three";
import { World } from "./World.js";
import { Character } from "./Character.js";
import { InputController } from "./InputController.js";

export class Game {
  constructor(container) {
    this.clock = new THREE.Clock();

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x87ceeb);

    this.camera = this.#createCamera();
    this.renderer = this.#createRenderer(container);

    this.world = new World(this.scene);
    this.character = new Character(this.scene);
    this.input = new InputController();

    window.addEventListener("resize", () => this.#onResize());
  }

  #createCamera() {
    const camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );

    // Offset kept constant from the character so the view follows it.
    this.cameraOffset = new THREE.Vector3(0, 14, 10);
    camera.position.copy(this.cameraOffset);
    camera.lookAt(0, 0, 0);

    return camera;
  }

  #updateCamera() {
    const target = this.character.mesh.position;

    this.camera.position.set(
      target.x + this.cameraOffset.x,
      target.y + this.cameraOffset.y,
      target.z + this.cameraOffset.z
    );
    this.camera.lookAt(target);
  }

  #createRenderer(container) {
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;

    container.appendChild(renderer.domElement);

    return renderer;
  }

  #onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  start() {
    this.renderer.setAnimationLoop(() => this.#tick());
  }

  #tick() {
    const delta = this.clock.getDelta();

    this.character.update(delta, this.input.getMoveVector(), this.world.buildings);
    this.#updateCamera();

    this.renderer.render(this.scene, this.camera);
  }
}
