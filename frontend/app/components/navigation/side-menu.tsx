import { motion } from "motion/react";

export default function Sidemenu() {
  return (
    <motion.aside
      layout
      initial={false}
      animate={{
        x: 0,
      }}
      className="h-screen sticky top-0 left-0 min-w-64 border-r border-r-neutral-300"
    >
      <h2>Sidemenu</h2>
    </motion.aside>
  );
}
