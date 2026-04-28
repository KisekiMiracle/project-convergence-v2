import { motion } from "motion/react";

export default function MainTopMenu() {
  return (
    <motion.aside
      layout
      initial={false}
      animate={{ y: 0 }}
      className="bg-opacity-20 sticky top-0 flex items-center justify-between border border-gray-100 bg-white/50 bg-clip-padding px-4 py-2 backdrop-blur-md backdrop-filter"
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
