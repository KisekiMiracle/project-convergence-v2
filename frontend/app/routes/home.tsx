import SigninForm from "~/components/forms/form";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Project Convergence" },
    { name: "description", content: "Welcome to Project Convergence!" },
  ];
}

export default function Home() {
  return (
    <main>
      <section>
        <div>Content</div>
        <SigninForm />
      </section>
    </main>
  );
}
