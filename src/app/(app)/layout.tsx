import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { MeshBackground } from "@/components/shared/MeshBackground";
import { BottomNav } from "@/components/layout/BottomNav";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="relative min-h-screen bg-black">
      <MeshBackground />
      <div className="relative z-10 max-w-[430px] mx-auto min-h-screen px-4 pb-[100px]">
        {children}
      </div>
      <BottomNav />
    </div>
  );
}
