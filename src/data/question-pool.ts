import type { QuestionPoolItem } from "@/types/training";

// Träna-poolen kommer fyllas på i en separat prompt. Tom tills dess —
// /traning-startskärmen visar "för få frågor"-bannern för alla val
// och Starta-session-knappen är inaktiv.
export const questionPool: QuestionPoolItem[] = [];
