import { getFileText } from "@/lib/get_text";

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
