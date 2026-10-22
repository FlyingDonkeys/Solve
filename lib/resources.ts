import { z } from "zod";

// The Supabase Bucket where papers are stored
export const RESOURCES_BUCKET = "Question PDFs";

// The particular folder containing practice papers for students
export const RESOURCES_FOLDER = "Practice Papers";

export const resourceAccessSchema = z.object({
  resource_path: z.string().max(1024).refine((path) => {
    const parts = path.split("/");
    return parts[0] === RESOURCES_FOLDER && parts.length > 1
      && parts.every((part) => part.length > 0 && part !== "." && part !== "..")
      && !/[\\\x00-\x1f\x7f%]/.test(path)
      && /\.pdf$/i.test(path);
  }, "Invalid practice paper path"),
  event_type: z.enum(["view_requested", "download_requested"]),
}).strict();

export type PracticeResource = {
  path: string;
  name: string;
};
