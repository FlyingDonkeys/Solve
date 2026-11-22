import type { Database } from "@/types/database.types";

export type ResourceDifficulty = Database["public"]["Enums"]["resource_dificulty"] | null

export type PracticeResource = {
  path: string;
  name: string;
  resource_type: Database["public"]["Enums"]["resource_type"] | null;
  resource_difficulty: ResourceDifficulty;
};