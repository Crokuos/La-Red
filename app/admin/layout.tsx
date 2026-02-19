import { ReactNode } from "react";
import { requireAdmin } from "../_lib/auth";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  await requireAdmin();
  return <>{children}</>;
}
