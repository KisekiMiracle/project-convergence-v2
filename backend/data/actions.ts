import { js } from "~/utils/template-strings";
import type { Entity } from "./entities";
import { CombatLog } from "./combat-log";

export class Action {
  constructor(
    private source: Entity,
    private formula: string,
    private scope: string,
    private message: string,
  ) {}

  public resolveTargets(allEntities: Entity[]): Entity[] {
    const presets: Record<
      string,
      (targets: Entity[], src: Entity) => Entity[]
    > = {
      self: (_, src) => [src],
      "One Ally": (t, src) =>
        [t.find((x) => x.id !== src.id && x.hp > 0)].filter(
          Boolean,
        ) as Entity[],
      "All Allies": (t) => t.filter((x) => x.hp > 0),
      "One Enemy": (t) => [t.find((x) => x.hp > 0)].filter(Boolean) as Entity[],
      "All Enemies": (t) => t.filter((x) => x.hp > 0),
    };

    if (presets[this.scope])
      return presets[this.scope]!(allEntities, this.source);

    // Custom Formula Targeting
    try {
      const filterFn = new Function("b", js`return ${this.scope};`);
      return allEntities.filter((t) => {
        try {
          return filterFn(t);
        } catch (error) {
          console.error("We got an error trying to calculate this!", error);
          return false;
        }
      });
    } catch {
      return [];
    }
  }

  /**
   * Parses a formula string like "a.physDmg * 2 - b.armor"
   * @param target The entity being targeted
   */
  private evalFormula(target: Entity): number {
    const context = { a: this.source, b: target };
    try {
      const fn = new Function("a", "b", js`return ${this.formula};`);
      return Math.max(0, Math.floor(fn(context.a, context.b)));
    } catch (e) {
      console.error("Formula Error:", this.formula, e);
      return 0;
    }
  }

  public preExecution() {
    // NOTE: Calculation extends from here.
  }

  public execute(
    targets: Entity[],
    category: "damage" | "healing" | "lifesteal" = "damage",
  ) {
    return targets.map((target) => {
      const value = this.evalFormula(target);
      let changeA = 0;
      let changeB = 0;

      const message = CombatLog.format(
        this.message,
        this.source,
        target,
        value,
      );

      const preCalcHp = target.hp;

      switch (category) {
        case "damage":
          changeB = target.modifyHp(-value);
          break;
        case "healing":
          changeB = target.modifyHp(value);
          break;
        case "lifesteal":
          changeB = target.modifyHp(-value);
          changeA = this.source.modifyHp(Math.abs(changeB));
          break;
      }
      return {
        targetName: target.name,
        message,
        initialHp: preCalcHp,
        currentHp: target.hp,
      };
    });
  }

  private postExecution() {
    // NOTE: Calculation extends from here.
  }

  public perform(
    allEntities: Entity[],
    category: "damage" | "healing" | "lifesteal" = "damage",
  ) {
    // 1. Resolve the targets using the scope defined in the constructor
    const targets = this.resolveTargets(allEntities);

    // 2. Execute on those resolved targets
    return this.execute(targets, category);
  }
}
