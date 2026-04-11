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
  public target: JSON[];

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

  makeTargets() {}

  /**
   * Parses a formula string like "a.physDmg * 2 - b.armor"
   * @param formula The string formula to evaluate
   * @param target The entity being targeted
   */
  public evalFormula(formula: string, target: Entity): number {
    // 1. Create a data context for the formula
    // 'a' refers to this entity (the attacker)
    // 'b' refers to the target (the defender)
    const context = {
      a: {
        dmg: this.physDmg,
        mdmg: this.magDmg,
        fns: this.finesse,
        dex: this.dexterity,
        crit: this.critRate,
        hp: this.hp,
        mp: this.mp,
        lvl: this.level,
        def: this.armor,
        mdef: this.magArmor,
      },
      b: {
        def: target.armor,
        mdef: target.magArmor,
        hp: target.hp,
        lvl: target.level,
      },
    };

    try {
      // 2. The Parser Logic
      // We use a Function constructor here.
      // It's safer than eval() and scoped to our context.

      // @ts-ignore
      const fn = new Function("a", "b", js`return ${formula};`);
      const result = fn(context.a, context.b);

      // Ensure we don't return NaN or negative damage
      return Math.max(0, Math.floor(result));
    } catch (e) {
      console.error("Formula Error:", formula, e);
      return 0;
    }
  }

  executeDamage({
    formula,
    type,
  }: {
    formula: string;
    type: "physical" | "magical" | "true";
  }) {
    // example formula: a.dmg - (1 - b.def)/2

    switch (type) {
      case "physical":
        break;
      case "magical":
        break;
      case "true":
        break;
      default:
        break;
    }
  }

  executeHealing() {}

  checkIfAlive() {
    return this.hp >= 1;
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
