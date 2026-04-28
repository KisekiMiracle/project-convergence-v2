import { useState, useCallback } from "react";
import type { Message } from "react-hook-form";
import { useSocket, useSocketEvent } from "~/hooks/use-socket";
import type { Route } from "./+types/home";
import { useOutletContext } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Home | Project Convergence" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function HomePage() {
  const user = useOutletContext();

  return (
    <div>
      <h1>Homepage</h1>
      <p>{JSON.stringify(user)}</p>
    </div>
  );
}
