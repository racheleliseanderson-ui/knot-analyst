import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

/**
 * Parent route for knot use cases. Keep the outlet for detail pages and make
 * the bare /applications path land on the practical index instead of an empty
 * parent shell.
 */
export const Route = createFileRoute("/applications")({
  beforeLoad: ({ location }) => {
    if (location.pathname === "/applications") {
      throw redirect({ to: "/applications/" });
    }
  },
  component: () => <Outlet />,
});
