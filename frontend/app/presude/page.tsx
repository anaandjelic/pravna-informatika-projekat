"use client";

import { ListItem } from "@/app/ui/list_item";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FilePath } from "@/lib/file_path";
import { FileText } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export default function HTMLPresude() {
  const [presude, setPresude] = useState<FilePath[]>([]);

  const [selectedHTMLIndex, setSelectedHTMLIndex] = useState<number>(0);
  const handleSelect = (index: number) => {
    setSelectedHTMLIndex(index);
  };

  useEffect(() => {
    const getHtmlFiles = async () => {
      await fetch(`http://localhost:3000/api/htmls?dir=${encodeURI("/html/presude")}`)
        .then((res) => res.json())
        .then((data) => setPresude(data));
    };

    getHtmlFiles();
  }, []);

  const htmlToShow = useMemo(() => {
    return presude[selectedHTMLIndex]?.path;
  }, [presude, selectedHTMLIndex]);

  return (
    <div className="flex h-full flex-row overflow-hidden space-x-6 pr-2 pb-2">
      <ScrollArea
        className="p-3 rounded-md shadow-md bg-secondary w-96 h-full"
        type="always"
      >
        <div className="w-full">
          {presude.map((file, index) => (
            <ListItem
              key={index}
              text={file.stem}
              isSelected={index === selectedHTMLIndex}
              Icon={FileText}
              onClick={() => handleSelect(index)}
            ></ListItem>
          ))}
        </div>
      </ScrollArea>
      <div className="flex flex-col flex-grow space-y-6">
        <iframe
          className="flex-grow w-full"
          src={htmlToShow}
        />
        <ScrollArea
          className="p-3 rounded-md shadow-md bg-secondary w-full h-56"
          type="always"
        >
          {/* TODO: Tabela atributa ovde */}
          <p>Some text</p>
          <p>Some text</p>
          <p>Some text</p>
          <p>Some text</p>
          <p>Some text</p>
          <p>Some text</p>
          <p>Some text</p>
          <p>Some text</p>
          <p>Some text</p>
          <p>Some text</p>
          <p>Some text</p>
        </ScrollArea>
      </div>
    </div>
  );
}
