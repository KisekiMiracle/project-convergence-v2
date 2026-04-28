import { js } from "~/utils/template-strings";
import type { InferSelectModel } from "drizzle-orm";
import { characterDefinitions } from "~/db/schema";
import type { UUID } from "node:crypto";
import { Action } from "./actions";

interface EntityModel {
  id: UUID;
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
  public id: UUID;
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
  public target: Array<Entity>;

  constructor({
    id,
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
    this.id = id;
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

  public modifyMp(amount: number): number {
    const oldMp = this.mp;
    this.mp = Math.max(0, Math.min(this.maxMp, this.mp + amount));
    return this.mp - oldMp; // Returns the actual change (e.g., +20 or -15)
  }

  public performAction(
    formula: string,
    scope: string,
    targets: Entity[],
    cat: "damage" | "healing" | "lifesteal" = "damage",
    message: string,
  ) {
    const action = new Action(this, formula, scope, message);
    const resolvedTargets = action.resolveTargets(targets);
    return action.execute(resolvedTargets, cat);
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
  job: string;
  weapon: string;
}

export class Character extends Entity {
  public gender: string;
  public height: number;
  public exp: number;
  public expToLevelUp: number;
  public equipSkills: JSON[];
  public job: string;
  public weapon: string;

  constructor({
    id,
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
    height,
    exp,
    expToLevelUp,
    job,
    weapon,
  }: CharacterModel) {
    super({
      id,
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
    this.height = height;
    this.weapon = weapon;

    this.exp = exp;
    this.expToLevelUp = expToLevelUp;

    this.equipSkills = [];

    this.target = [] as Array<Entity | Character>;

    this.job = job;
  }
}
