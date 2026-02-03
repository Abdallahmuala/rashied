import { NextResponse } from "next/server";
import { z } from "zod";
import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { systemPrompt, userPrompt } from "@/lib/ai/prompts";
import type { RashidResult } from "@/lib/types";

const BodySchema = z.object({
  caseText: z.string().min(10),
});

const ResultSchema = z.object({
  case_type: z.string(),
  track: z.string(),
  checklist: z.array(z.object({ item: z.string(), required: z.boolean(), notes: z.string().optional() })),
  required_documents: z.array(z.object({ name: z.string(), why: z.string() })),
  warnings: z.array(z.object({ title: z.string(), detail: z.string(), severity: z.enum(["low", "medium", "high"]) })),
  references: z.array(z.object({ title: z.string(), source: z.string() })),
  next_steps: z.array(z.string()),
  disclaimer: z.string(),
});

function safeJsonParse(text: string) {
  // يحاول يقتطع JSON حتى لو النموذج زاد نص
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) throw new Error("No JSON found");
  return JSON.parse(text.slice(start, end + 1));
}

function uniqBy<T>(arr: T[], keyFn: (x: T) => string) {
  const seen = new Set<string>();
  const out: T[] = [];
  for (const item of arr) {
    const k = keyFn(item);
    if (!seen.has(k)) {
      seen.add(k);
      out.push(item);
    }
  }
  return out;
}

function mergeResults(a: RashidResult, b: RashidResult): RashidResult {
  return {
    case_type: a.case_type || b.case_type,
    track: a.track || b.track,
    checklist: uniqBy([...(a.checklist || []), ...(b.checklist || [])], (x) => x.item.trim()),
    required_documents: uniqBy([...(a.required_documents || []), ...(b.required_documents || [])], (x) => x.name.trim()),
    warnings: uniqBy([...(a.warnings || []), ...(b.warnings || [])], (x) => `${x.severity}:${x.title}`.trim()),
    references: uniqBy([...(a.references || []), ...(b.references || [])], (x) => `${x.title}|${x.source}`.trim()),
    next_steps: uniqBy([...(a.next_steps || []), ...(b.next_steps || [])], (x) => x.trim()),
    disclaimer: a.disclaimer || b.disclaimer || "هذه إرشادات إجرائية عامة ولا تُعد استشارة قانونية.",
  };
}

export async function POST(req: Request) {
  try {
    const body = BodySchema.parse(await req.json());
    const prompt = userPrompt(body.caseText);

    const openaiKey = process.env.OPENAI_API_KEY!;
    const geminiKey = process.env.GEMINI_API_KEY!;
    if (!openaiKey || !geminiKey) {
      return NextResponse.json({ error: "Missing AI API keys" }, { status: 500 });
    }

    const openai = new OpenAI({ apiKey: openaiKey });
    const genAI = new GoogleGenerativeAI(geminiKey);

    const openaiModel = process.env.OPENAI_MODEL || "gpt-4.1-mini";
    const geminiModel = process.env.GEMINI_MODEL || "gemini-1.5-flash";

    const [oRes, gRes] = await Promise.allSettled([
      openai.chat.completions.create({
        model: openaiModel,
        temperature: 0.2,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt },
        ],
      }),
      (async () => {
        const model = genAI.getGenerativeModel({ model: geminiModel });
        const r = await model.generateContent([systemPrompt, prompt]);
        return r.response.text();
      })(),
    ]);

    let openaiJson: RashidResult | null = null;
    let geminiJson: RashidResult | null = null;

    if (oRes.status === "fulfilled") {
      const text = oRes.value.choices?.[0]?.message?.content || "";
      const parsed = safeJsonParse(text);
      openaiJson = ResultSchema.parse(parsed) as RashidResult;
    }

    if (gRes.status === "fulfilled") {
      const text = gRes.value || "";
      const parsed = safeJsonParse(text);
      geminiJson = ResultSchema.parse(parsed) as RashidResult;
    }

    if (!openaiJson && !geminiJson) {
      return NextResponse.json({ error: "Both models failed" }, { status: 502 });
    }

    const merged = openaiJson && geminiJson
      ? mergeResults(openaiJson, geminiJson)
      : (openaiJson || geminiJson)!;

    return NextResponse.json({ result: merged });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Unknown error" },
      { status: 400 }
    );
  }
}
