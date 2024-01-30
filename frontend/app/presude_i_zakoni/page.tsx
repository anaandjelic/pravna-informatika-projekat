import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function PresudeIZakoni() {
  return (
    <div className="flex h-full flex-row overflow-hidden space-x-6">
      <Tabs defaultValue="presude" className="flex flex-col w-96 h-full">
        <div className="hack pb-4">
          <TabsList>
            <TabsTrigger value="presude">Presude</TabsTrigger>
            <TabsTrigger value="zakoni">Zakoni</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="presude" className="flex-grow overflow-auto">
          <ScrollArea className="h-full" type="always">
            {Array.from({ length: 40 }, (_, i) => (
              <div key={i}>Presuda {i}</div>
            ))}
          </ScrollArea>
        </TabsContent>
        <TabsContent value="zakoni" className="flex-grow overflow-auto">
          <ScrollArea className="h-full" type="always">
            {Array.from({ length: 40 }, (_, i) => (
              <div key={i}>Zakon {i}</div>
            ))}
          </ScrollArea>
        </TabsContent>
      </Tabs>
      <ScrollArea className="w-auto h-full">PDF VIEWER</ScrollArea>
    </div>
  );
}
