import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BookMarked, Gavel, Scale, FilePlus } from "lucide-react";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
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
            <Button variant="ghost" className="w-full justify-start">
              <Scale className="mr-2" />
              Presude i zakoni
            </Button>
          </div>
        </div>
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-xl font-semibold tracking-tight">
            Akoma Ntoso
          </h2>
          <div className="space-y-1">
            <Button variant="ghost" className="w-full justify-start">
              <Gavel className="mr-2" />
              Presude
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <BookMarked className="mr-2" />
              Zakoni
            </Button>
          </div>
        </div>
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-xl font-semibold tracking-tight">
            Akcije
          </h2>
          <div className="space-y-1">
            <Button variant="ghost" className="w-full justify-start">
              <FilePlus className="mr-2" />
              Nova presuda
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
