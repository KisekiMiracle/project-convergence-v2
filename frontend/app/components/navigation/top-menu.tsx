import { motion } from "motion/react";

export default function Topmenu() {
  return (
    <motion.aside
      layout
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="flex items-center justify-between"
    >
      <ul className="flex items-center gap-8">
        <li>
          <span>Shards:</span>
        </li>
        <li>
          <span>Shards:</span>
        </li>
      </ul>
    </motion.aside>
  );
}
