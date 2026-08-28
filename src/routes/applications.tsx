import { createFileRoute, Outlet } from "@tanstack/react-router";

/** Parent route for the practical knot use-case index and detail pages. */
export const Route = createFileRoute("/applications")({
  component: () => <Outlet />,
});
