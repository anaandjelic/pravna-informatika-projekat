import { Sidebar } from "@/components/ui/sidebar";

export default function Home() {
  return (
    <div className="border-t">
      <div className="grid grid-cols-6">
        <Sidebar className="block h-full" />
        <div className="col-span-5 border-l">
          <div className="h-full py-6 px-8"></div>
        </div>
      </div>
    </div>
  );
}
