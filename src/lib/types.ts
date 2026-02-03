export type RashidResult = {
  case_type: string;
  track: string; // مسار التقاضي الإداري المقترح (مثلاً: تظلم/دعوى إلغاء/تعويض...)
  checklist: { item: string; required: boolean; notes?: string }[];
  required_documents: { name: string; why: string }[];
  warnings: { title: string; detail: string; severity: "low" | "medium" | "high" }[];
  references: { title: string; source: string }[];
  next_steps: string[];
  disclaimer: string;
};

export type ChatMessage = { role: "user" | "assistant"; content: string };
