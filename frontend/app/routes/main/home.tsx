import { useState, useCallback } from "react";
import type { Message } from "react-hook-form";
import { useSocket, useSocketEvent } from "~/hooks/use-socket";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Home | Project Convergence" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function HomePage() {
  return <section className="bg-white w-full min-h-screen">Homepage.</section>;
}
