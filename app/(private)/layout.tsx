import BottomNav from "../_components/BottomNav";
import { requireActivatedUser } from "../_lib/auth";

export default async function PrivateLayout({ children }: { children: React.ReactNode }) {
  await requireActivatedUser();
  return (
    <>
      {children}
      <BottomNav />
    </>
  );
}
