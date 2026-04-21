import { motion } from "motion/react";

export default function Sidemenu() {
  return (
    <motion.aside
      layout
      initial={{
        x: -100,
      }}
      animate={{
        x: 0,
      }}
      className="h-full sticky top-0 left-0 min-w-56 bg-neutral-700 text-white"
    >
      <h2>Sidemenu</h2>
    </motion.aside>
  );
}
