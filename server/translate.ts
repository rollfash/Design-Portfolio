import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

export interface TranslationRequest {
  text: string;
  from?: string;
  to?: string;
}

export interface TranslationResult {
  original: string;
  translated: string;
  from: string;
  to: string;
}

/**
 * Translate text from Hebrew to English using OpenAI
 */
export async function translateText(
  text: string,
  fromLang: string = "Hebrew",
  toLang: string = "English"
): Promise<string> {
  if (!text || text.trim() === "") {
    return "";
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: `You are a professional translator. Translate the following ${fromLang} text to ${toLang}. Return ONLY the translated text, without any explanations, notes, or additional formatting. Maintain the original tone and style.`,
        },
        {
          role: "user",
          content: text,
        },
      ],
      max_completion_tokens: 1024,
      temperature: 0.3, // Lower temperature for more consistent translations
    });

    const translated = response.choices[0]?.message?.content?.trim() || "";
    return translated;
  } catch (error) {
    console.error("Translation error:", error);
    throw new Error("Translation failed");
  }
}

/**
 * Translate multiple text fields in parallel
 */
export async function translateFields(
  fields: Record<string, string>,
  fromLang: string = "Hebrew",
  toLang: string = "English"
): Promise<Record<string, string>> {
  const entries = Object.entries(fields).filter(([_, value]) => value && value.trim() !== "");
  
  if (entries.length === 0) {
    return {};
  }

  const promises = entries.map(async ([key, value]) => {
    const translated = await translateText(value, fromLang, toLang);
    return [key, translated] as [string, string];
  });

  const results = await Promise.all(promises);
  return Object.fromEntries(results);
}

/**
 * Check if translation API is configured and available
 */
export function isTranslationAvailable(): boolean {
  return !!(
    process.env.AI_INTEGRATIONS_OPENAI_API_KEY &&
    process.env.AI_INTEGRATIONS_OPENAI_BASE_URL
  );
}
