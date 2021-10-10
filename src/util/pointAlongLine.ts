import Vec2 from "../Vec2";

export default function pointAlongLine(point1: Vec2, point2: Vec2, percentage: number) {
  percentage = percentage / 100;
  return new Vec2(
    point1.x * (1.0 - percentage) + point2.x * percentage,
    point1.y * (1.0 - percentage) + point2.y * percentage
  );
}
