import { request, Request, Response } from "express";
import z, { ZodError } from "zod";
import uploadConfig from "@/configs/upload";
import { DiskStorage } from "@/providers/disk-storage";
import { AppError } from "@/utils/AppError";

class UploadsController {
  async create(req: Request, res: Response) {
    const diskStorage = new DiskStorage();
    try {
      const fileSchema = z
        .object({
          filename: z.string().min(1, "Filename is required"),
          mimetype: z
            .string()
            .refine(
              (type) => uploadConfig.ACCEPTED_IMAGE_TYPES.includes(type),
              "Invalid file type" + uploadConfig.ACCEPTED_IMAGE_TYPES
            ),
          size: z
            .number()
            .positive()
            .refine(
              (size) => uploadConfig.MAX_FILE_SIZE,
              `Arquivo excede o tamanho maximo de ${uploadConfig.MAX_SIZE}`
            ),
        })
        .passthrough();

      res.json({ message: "ok" });

      const file = fileSchema.parse(req.file);
      const filename = await diskStorage.savefile(file.filename);

      res.json({ filename });
    } catch (error) {
      if (error instanceof ZodError) {
        if (req.file) {
          await diskStorage.deleteFile(req.file.filename, "tpm");
        }

        throw new AppError(error.issues[0].message);
      }
      throw Error("");
    }
  }
}

export { UploadsController };
