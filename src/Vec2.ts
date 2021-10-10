export default class Vec2 {
  constructor(public x: number, public y: number) {}

  add(x: number, y: number) {
    this.x += x;
    this.y += y;
  }
  sub(x: number, y: number) {
    this.x -= x;
    this.y -= y;
  }
  set(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  toString() {
    return `${this.x}, ${this.y}`;
  }
}
