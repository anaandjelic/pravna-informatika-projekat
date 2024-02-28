"use client";

import { ListItem } from "@/app/ui/list_item";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FilePath } from "@/lib/file_path";
import { FileText } from "lucide-react";
import { useEffect, useState } from "react";

export default function HTMLPresude() {
  const [presude, setPresude] = useState<FilePath[]>([]);

  const [selectedHTMLIndex, setSelectedHTMLIndex] = useState<number>(0);
  const [htmlText, setHtmlText] = useState<string>("");
  const [attributes, setAttributes] = useState<Object>({});
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

  useEffect(() => {
    const getHtmlText = async () => {
      fetch(`http://localhost:3000/api/htmls/get_text?file=${encodeURI(presude[selectedHTMLIndex].path)}`)
        .then((res) => res.json())
        .then((data) => {
          setHtmlText(data);
        });
    };
    if (presude[selectedHTMLIndex] !== undefined) {
      getHtmlText();
      fetch(`http://localhost:8080/case/extract/${encodeURI(presude[selectedHTMLIndex].stem)}`)
        .then((res) => res.json())
        .then((data) => {
          setAttributes(data);
        })
        .catch((err) => {});
    }
  }, [selectedHTMLIndex, presude]);

  return (
    <div className="flex h-full flex-row overflow-hidden space-x-6 pr-2 pb-2">
      <Card className="h-full">
        <CardHeader>
          <CardTitle>HTML Presude</CardTitle>
          <CardDescription>Pregled presuda u HTML-u.</CardDescription>
        </CardHeader>
        <CardContent className="h-[90%]">
          <ScrollArea
            className="w-96 h-full"
            type="always"
          >
            <div className="w-full pr-3">
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
        </CardContent>
      </Card>
      <div className="flex flex-col flex-grow space-y-6">
        <ScrollArea className="w-full h-2/3">
          <div
            className="flex-grow w-full"
            dangerouslySetInnerHTML={{ __html: htmlText }}
          />
        </ScrollArea>
        <Card className="w-full h-72">
          <CardHeader className="p-3">
            <CardTitle className="text-lg">Atributi presude</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea
              className="w-full h-56"
              type="always"
            >
              <pre className="rounded-md bg-slate-950 p-4">
                <code className="text-white break-words whitespace-pre-wrap">
                  {JSON.stringify(attributes, null, 2)}
                </code>
              </pre>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
