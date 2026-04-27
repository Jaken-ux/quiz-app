import type { Interest } from "@/types/quiz";

export type User = {
  username: string;
  avatar: string;
  interests: Interest[];
  createdAt: string;
};
