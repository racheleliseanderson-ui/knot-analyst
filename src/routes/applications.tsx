import { createFileRoute, Outlet } from "@tanstack/react-router";

/**
 * Path prefix for /applications and /applications/$id.
 * Without an Outlet the $id note never mounts — the list route wins the match.
 */
export const Route = createFileRoute("/applications")({
  component: () => <Outlet />,
});
