import { js } from "~/utils/template-strings";
import type { InferSelectModel } from "drizzle-orm";
import { characters } from "~/db/schema";

interface EntityModel {
  name: string;
  lastName: string;
  level: number;
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  physDmg: number;
  magDmg: number;
  armor: number;
  magArmor: number;
  finesse: number;
  dexterity: number;
  critRate: number;
}

export class Entity {
  public name: string;
  public lastName: string;
  public level: number;
  public hp: number;
  public maxHp: number;
  public mp: number;
  public maxMp: number;
  public physDmg: number;
  public magDmg: number;
  public armor: number;
  public magArmor: number;
  public finesse: number;
  public dexterity: number;
  public critRate: number;
  public status: JSON[];
  public skills: string[];
  public target: Entity[];

  constructor({
    name,
    lastName,
    level,
    hp,
    maxHp,
    mp,
    maxMp,
    physDmg,
    magDmg,
    armor,
    magArmor,
    finesse,
    dexterity,
    critRate,
  }: EntityModel) {
    this.name = name;
    this.lastName = lastName;

    this.level = level;

    this.hp = hp;
    this.maxHp = maxHp;
    this.mp = mp;
    this.maxMp = maxMp;

    this.physDmg = physDmg;
    this.magDmg = magDmg;
    this.armor = armor;
    this.magArmor = magArmor;

    this.finesse = finesse;
    this.dexterity = dexterity;

    this.critRate = critRate;

    this.status = [];
    this.skills = [];

    this.target = [];

    this.init(); // Initialize
  }

  init() {}

  public modifyHp(amount: number): number {
    const oldHp = this.hp;
    this.hp = Math.max(0, Math.min(this.maxHp, this.hp + amount));
    return this.hp - oldHp; // Returns the actual change (e.g., +20 or -15)
  }

  makeTargets(targets: Entity[], scope: string) {
    // eg. targets = [slime1, slime2, slime3] <- all Entities
    // eg. scope = All Enemies
    this.target = []; // cleanup, in case.
    const presets: Record<string, () => Entity[]> = {
      //----
      "All Enemies": () => targets,
      "All Allies": () => targets,
      //----
      "One Enemy": () => [targets[0]].filter(Boolean) as Entity[], // Ensure target exists
      "One Ally": () => [targets[0]].filter(Boolean) as Entity[],
      //----
      "One KOd Ally": () =>
        [targets.find((t) => t.hp <= 0)].filter(Boolean) as Entity[],
      "All KOd Allies": () => targets.filter((t) => t.hp <= 0) as Entity[],
      // ---
    };

    if (presets[scope]) {
      this.target = presets[scope]();
    } else {
      // We treat 'b' as the individual target being checked in the list
      try {
        const filterFn = new Function("b", js`return ${scope};`);

        this.target = targets.filter((t) => {
          try {
            return filterFn(t);
          } catch {
            return false;
          }
        });
      } catch (e) {
        console.error("Invalid Target Scope Formula:", scope);
        this.target = [];
      }
    }
  }

  /**
   * Parses a formula string like "a.physDmg * 2 - b.armor"
   * @param formula The string formula to evaluate
   * @param target The entity being targeted
   */
  public evalFormula(formula: string, target: Entity): number {
    const context = {
      a: this, // Using 'this' directly captures all numeric properties
      b: target,
    };

    try {
      const fn = new Function("a", "b", js`return ${formula};`);
      const result = fn(context.a, context.b);
      return Math.max(0, Math.floor(result));
    } catch (e) {
      console.error("Formula Error:", formula, e);
      return 0;
    }
  }

  public executeAction(
    formula: string,
    targets: Entity[],
    category: "damage" | "healing" | "lifesteal" = "damage",
  ) {
    return targets.map((target) => {
      const value = this.evalFormula(formula, target);
      let changeA = 0;
      let changeB = 0;

      switch (category) {
        case "damage":
          changeB = target.modifyHp(-value);
          break;
        case "healing":
          changeB = target.modifyHp(value);
          break;
        case "lifesteal":
          changeB = target.modifyHp(-value);
          changeA = this.modifyHp(Math.abs(changeB));
          break;
        default:
          break;
      }

      return {
        targetName: target.name,
        targetHp: target.hp,
        valueB: changeB, // The HP change on the target
        valueA: changeA, // The HP change on the caster (for lifesteal)
      };
    });
  }

  checkIfAlive() {
    return this.hp > 0;
  }
}

interface CharacterModel extends EntityModel {
  gender: "male" | "female";
  height: number;
  exp: number;
  expToLevelUp: number;
}

export class Character extends Entity {
  public gender: string;
  public equipSkills: JSON[];

  constructor({
    name,
    lastName,
    level,
    hp,
    maxHp,
    mp,
    maxMp,
    physDmg,
    magDmg,
    armor,
    magArmor,
    finesse,
    dexterity,
    critRate,
    gender,
  }: CharacterModel) {
    super({
      name,
      lastName,
      level,
      hp,
      maxHp,
      mp,
      maxMp,
      physDmg,
      magDmg,
      armor,
      magArmor,
      finesse,
      dexterity,
      critRate,
    });

    this.gender = gender;
    this.equipSkills = [];
  }
}
