import type { UUID } from "node:crypto";
import type { Character, Entity } from "./entities";
import { Action } from "./actions";

interface ItemProps {
  id: UUID;
  name: string;
  description: string;
  effect: string; // a template literal describing the effect
  scope?: string;
  amount: number;
  message: string;
}

export class Item {
  public id: UUID;
  public name: string;
  public description: string;
  public effect: string;
  public scope: string;
  public amount: number;
  public target: Array<Entity | Character>;
  public message: string;

  constructor({
    id,
    name,
    description,
    effect,
    scope = "self",
    amount,
    message,
  }: ItemProps) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.effect = effect;
    this.scope = scope;
    this.amount = amount;

    this.target = [];
    this.message = message;
  }

  updateAmount(amount: number) {
    this.amount = Math.max(0, this.amount - amount);
  }

  public use(
    user: Entity,
    allEntities: Entity[],
    category: "healing" | "damage" = "healing",
  ) {
    const action = new Action(user, this.effect, this.scope, this.message);
    const targets = action.resolveTargets(allEntities);

    this.updateAmount(1);
    return action.execute(targets, category);
  }
}
