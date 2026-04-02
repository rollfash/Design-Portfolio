import { openai } from "./translate";
import { translateText } from "./translate";
import type { InsertBlogPost } from "../shared/schema";

export async function generateBlogPost(
  recentTitles: string[]
): Promise<InsertBlogPost> {
  const avoidList =
    recentTitles.length > 0
      ? `\nAvoid topics similar to these recent posts:\n${recentTitles.map((t) => `- ${t}`).join("\n")}`
      : "";

  const response = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [
      {
        role: "system",
        content: `You are a blog writer for Gal Shinhorn, an Israeli interior designer and set designer.
Write a blog post in Hebrew about interior design or set design tips, trends, or insights.
The post should be informative and engaging for a general audience interested in design.
Do NOT write about specific projects. Focus on general tips, trends, or design philosophy.
The content field should use double newlines to separate paragraphs (no markdown headers or bullet lists).
The excerpt should be 1-2 sentences summarizing the post.${avoidList}

Return a JSON object with exactly these keys: title, excerpt, content`,
      },
    ],
    response_format: { type: "json_object" },
    max_completion_tokens: 2048,
    temperature: 0.7,
  });

  const raw = response.choices[0]?.message?.content?.trim();
  if (!raw) {
    throw new Error("Empty response from OpenAI");
  }

  const generated = JSON.parse(raw) as {
    title: string;
    excerpt: string;
    content: string;
  };

  if (!generated.title || !generated.excerpt || !generated.content) {
    throw new Error("Missing required fields in generated blog post");
  }

  // Translate all fields to English in parallel
  const [titleEn, excerptEn, contentEn] = await Promise.all([
    translateText(generated.title, "Hebrew", "English"),
    translateText(generated.excerpt, "Hebrew", "English"),
    translateText(generated.content, "Hebrew", "English", 2048),
  ]);

  return {
    title: generated.title,
    titleEn,
    excerpt: generated.excerpt,
    excerptEn,
    content: generated.content,
    contentEn,
    publishedAt: new Date(),
  };
}
