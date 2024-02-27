import fs from "fs";

export async function getFileText(filePath: string) {
  return fs.readFileSync(filePath, "utf8");
}
