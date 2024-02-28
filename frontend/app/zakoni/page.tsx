import { getFileText } from "@/lib/file_utils";

export default async function Zakoni() {
  const htmlText: string = await getFileText("public/html/krivicni-zakonik.html");

  return (
    <div
      className="w-full h-full"
      title="Krivicni Zakonik"
      dangerouslySetInnerHTML={{ __html: htmlText }}
    ></div>
  );
}
