const KEY_TO_ACTION = {
  KeyW: "up",
  ArrowUp: "up",
  KeyS: "down",
  ArrowDown: "down",
  KeyA: "left",
  ArrowLeft: "left",
  KeyD: "right",
  ArrowRight: "right",
};

export class InputController {
  constructor() {
    this.actions = { up: false, down: false, left: false, right: false };

    window.addEventListener("keydown", (event) => this.#setAction(event, true));
    window.addEventListener("keyup", (event) => this.#setAction(event, false));
  }

  #setAction(event, value) {
    const action = KEY_TO_ACTION[event.code];
    if (action) this.actions[action] = value;
  }

  /** Movement vector on the XZ plane, normalized. x: left/right, z: forward/back. */
  getMoveVector() {
    const x = (this.actions.right ? 1 : 0) - (this.actions.left ? 1 : 0);
    const z = (this.actions.down ? 1 : 0) - (this.actions.up ? 1 : 0);

    const length = Math.hypot(x, z);
    if (length === 0) return { x: 0, z: 0 };

    return { x: x / length, z: z / length };
  }
}
