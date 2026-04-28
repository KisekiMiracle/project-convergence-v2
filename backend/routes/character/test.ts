import { app } from "~/index";
import { Character, Entity } from "~/data/entities"; // Adjust paths as needed
import { Item } from "~/data/items";
import { Action } from "~/data/actions"; // Adjust your path
import { randomUUID } from "node:crypto";
import { js } from "~/utils/template-strings";

export default function CombatTestRoutes() {
  app.get("/api/character/test/combat-1", async (_req, res) => {
    try {
      // 1. Setup Mock Entities
      const player = new Entity({
        id: randomUUID(),
        name: "Hero",
        lastName: "Tester",
        level: 1,
        hp: 50,
        maxHp: 60,
        mp: 50,
        maxMp: 50,
        physDmg: 20,
        magDmg: 30,
        armor: 5,
        magArmor: 5,
        finesse: 10,
        dexterity: 10,
        critRate: 0.1,
      });

      const slimes = [1, 2, 3].map(
        (i) =>
          new Entity({
            id: randomUUID(),
            name: `Slime ${i}`,
            lastName: "",
            level: 1,
            hp: Math.min(20, Math.floor(Math.random() * 100)),
            maxHp: 30,
            mp: 0,
            maxMp: 0,
            physDmg: 10,
            magDmg: 0,
            armor: 0,
            magArmor: 0,
            finesse: 5,
            dexterity: 5,
            critRate: 0.05,
          }),
      );

      // 2. Setup the Healing Potion
      const healthPotion = new Item({
        id: randomUUID(),
        name: "Healing Potion",
        description: "Restores 25 HP.",
        effect: "25", // The Action class will eval this formula
        amount: 1,
        scope: "self",
        message: `a.name has recovered [value] Health Points! Hurray!`,
      });

      const log = [];

      // 3. Hero attacks
      const attackAction = new Action(
        player,
        "a.physDmg - b.armor",
        `b.hp >= 20`,
        `a.name has dealt [value] damage to b.name`,
      );
      log.push({
        phase: "Player Attack",
        results: attackAction.perform(slimes, "damage"),
      });

      // 4. Slimes counter-attack (Direct object passing)
      const slimeAttack = new Action(
        slimes[0]!,
        "a.physDmg*5 - b.armor",
        "One Enemy",
        `a.name has dealt [value] damage to b.name`,
      );
      log.push({
        phase: "Slimes Counter",
        results: slimeAttack.perform([player], "damage"),
      });

      // 5. Player uses Healing Potion (Direct object passing)
      log.push({
        phase: "Player Heal",
        results: healthPotion.use(player, [player], "healing"),
      });

      res.status(200).send({
        finalPlayerHp: player.hp,
        battleLog: log,
      });
    } catch (error: any) {
      return res.status(500).send({
        success: false,
        message: "Combat simulation failed.",
        error: error.message,
      });
    }
  });
}
