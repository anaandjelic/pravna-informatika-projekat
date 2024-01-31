import { promises as fs } from "fs";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

export async function GET(request: NextRequest) {
  const dirPath: string = request.nextUrl.searchParams.get("dir") || "/pdfs/presude";
  const publicDirPath = path.join("public", dirPath);

  try {
    const pdfFiles: FilePath[] = [];

    const files = await fs.readdir(publicDirPath);
    for (const file of files) {
      if (path.extname(file).toLowerCase() === ".pdf") {
        pdfFiles.push({ stem: path.parse(file).name, path: path.join(dirPath, file) });
      }
    }

    return NextResponse.json(pdfFiles);
  } catch (error) {
    return NextResponse.json({ error: "Failed to retrieve PDF files" });
  }
}
