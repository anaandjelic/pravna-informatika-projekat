"use client";

import { LinkButton } from "@/app/ui/link_button";
import { cn } from "@/lib/utils";
import { BookMarked, FilePlus, Gavel, Scale } from "lucide-react";
import { usePathname } from "next/navigation";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className={cn("pb-12", className)}>
      <h1 className="mb-2 px-4 pt-4 pb-2 text-2xl font-semibold">
        PRAVNA INFORMATIKA
      </h1>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-xl font-semibold tracking-tight">
            PDF Dokumenti
          </h2>
          <div className="space-y-1">
            <LinkButton
              text="Presude i zakoni"
              link="/presude_i_zakoni"
              Icon={Scale}
              pathname={pathname}
            />
          </div>
        </div>
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-xl font-semibold tracking-tight">
            Akoma Ntoso
          </h2>
          <div className="space-y-1">
            <LinkButton
              text="Presude"
              link="/presude"
              Icon={Gavel}
              pathname={pathname}
            />
            <LinkButton
              text="Zakoni"
              link="/zakoni"
              Icon={BookMarked}
              pathname={pathname}
            />
          </div>
        </div>
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-xl font-semibold tracking-tight">
            Akcije
          </h2>
          <div className="space-y-1">
            <LinkButton
              text="Nova presuda"
              link="/nova_presuda"
              Icon={FilePlus}
              pathname={pathname}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
