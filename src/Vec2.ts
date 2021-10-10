export default class Vec2 {
  constructor(public x: number, public y: number) {}

  add(x: number, y: number) {
    this.x += x;
    this.y += y;
    return this;
  }
  sub(x: number, y: number) {
    this.x -= x;
    this.y -= y;
    return this;
  }
  set(x: number, y: number) {
    this.x = x;
    this.y = y;
    return this;
  }

  duplicate() {
    return new Vec2(this.x, this.y);
  }

  toString() {
    return `${this.x}, ${this.y}`;
  }
  toArray() {
    return [this.x, this.y];
  }
}
