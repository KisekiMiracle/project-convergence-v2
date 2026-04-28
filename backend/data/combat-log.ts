import type { Entity } from "./entities";

export class CombatLog {
  static format(
    template: string,
    source: Entity,
    target: Entity,
    value: number,
  ): string {
    // You can use a simple replace pattern instead of 'new Function'
    // It's much safer and easier to debug!
    return template
      .replace("[value]", value.toString())
      .replace("a.name", source.name)
      .replace("b.name", target.name);
  }
}
