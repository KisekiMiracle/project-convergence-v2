import { app } from "~/index";
import { Character, Entity } from "~/data/entities"; // Adjust paths as needed
import { js } from "~/utils/template-strings";

export default function CombatTestRoutes() {
  app.get("/api/character/test/combat-1", async (_req, res) => {
    try {
      // 1. Setup the "Attacker" (You)
      const hero = new Character({
        name: "Jhonny",
        lastName: "Test",
        level: 5,
        hp: 100,
        maxHp: 100,
        mp: 50,
        maxMp: 50,
        physDmg: 25,
        magDmg: 10,
        armor: 10,
        magArmor: 5,
        finesse: 15,
        dexterity: 12,
        critRate: 0.1,
        gender: "male",
        height: 180,
        exp: 0,
        expToLevelUp: 1000,
      });

      // 2. Setup the "Targets" (Enemies)
      const enemies = [
        new Entity({
          name: "Slime A",
          lastName: "Weak",
          level: 1,
          hp: 20,
          maxHp: 50,
          mp: 0,
          maxMp: 0,
          physDmg: 5,
          magDmg: 0,
          armor: 2,
          magArmor: 2,
          finesse: 5,
          dexterity: 5,
          critRate: 0,
        }),
        new Entity({
          name: "Slime B",
          lastName: "Tank",
          level: 2,
          hp: 40,
          maxHp: 80,
          mp: 0,
          maxMp: 0,
          physDmg: 5,
          magDmg: 0,
          armor: 15,
          magArmor: 10,
          finesse: 5,
          dexterity: 5,
          critRate: 0,
        }),
        new Entity({
          name: "Slime C",
          lastName: "Injured",
          level: 1,
          hp: 10,
          maxHp: 50,
          mp: 0,
          maxMp: 0,
          physDmg: 5,
          magDmg: 0,
          armor: 2,
          magArmor: 2,
          finesse: 5,
          dexterity: 5,
          critRate: 0,
        }),
      ];

      const skill = {
        formula: js`a.physDmg * 2 - b.armor * 2`,
        category: "damage" as const,
        scope: "All Enemies", // Only target living enemies
      };

      hero.makeTargets(enemies, skill.scope);

      const results = hero.executeAction(
        skill.formula,
        hero.target,
        skill.category,
      );

      const combatLog = results.map(
        (r) =>
          `${hero.name} used skill on ${r.targetName}. Damage: ${Math.abs(r.valueB)}. Remaining HP: ${r.targetHp}`,
      );

      return res.status(200).send({
        success: true,
        targetsIdentified: hero.target.length,
        details: results,
        log: combatLog,
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
