import fs from "node:fs";
import path from "node:path";
import uploadConfing from "@/configs/upload";

class DiskStorage {
  async savefile(file: string) {
    const tmpPath = path.resolve(uploadConfing.TMP_FOLDER, file);
    const destPath = path.resolve(uploadConfing.UPLOADS_FOLDER, file);

    try {
      await fs.promises.access(tmpPath);
    } catch (error) {
      throw new Error(`File not found: ${tmpPath}`);
    }

    await fs.promises.mkdir(uploadConfing.UPLOADS_FOLDER, { recursive: true });
    await fs.promises.rename(tmpPath, destPath);

    return file;
  }

  async deleteFile(file: string, type: "tpm" | "upload") {
    const pathFile =
      type === "tpm" ? uploadConfing.TMP_FOLDER : uploadConfing.UPLOADS_FOLDER;

    const filePath = path.resolve(pathFile, file);

    try {
      await fs.promises.stat(filePath);
    } catch {
      return;
    }

    await fs.promises.unlink(filePath);
  }
}

export { DiskStorage };
