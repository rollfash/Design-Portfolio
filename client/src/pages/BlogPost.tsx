import { Layout } from "@/components/layout/Layout";
import { useParams, Link } from "wouter";
import { useLanguage } from "@/lib/language-context";
import { useSEO } from "@/lib/seo";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import type { BlogPost as BlogPostType } from "@shared/schema";

function formatDate(date: string | Date, language: string): string {
  const d = new Date(date);
  return d.toLocaleDateString(language === "he" ? "he-IL" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function BlogPost() {
  const { id } = useParams<{ id: string }>();
  const { language, direction } = useLanguage();

  const { data: post, isLoading } = useQuery<BlogPostType>({
    queryKey: ["blog", id],
    queryFn: async () => {
      const res = await fetch(`/api/blog/${id}`);
      if (!res.ok) throw new Error("Post not found");
      return res.json();
    },
    enabled: !!id,
  });

  const title = post
    ? language === "en" && post.titleEn
      ? post.titleEn
      : post.title
    : "";

  const content = post
    ? language === "en" && post.contentEn
      ? post.contentEn
      : post.content
    : "";

  useSEO({
    title: title
      ? `${title} | ${language === "he" ? "גל שינהורן" : "Gal Shinhorn"}`
      : language === "he"
      ? "פוסט בלוג | גל שינהורן"
      : "Blog Post | Gal Shinhorn",
    description: post
      ? language === "en" && post.excerptEn
        ? post.excerptEn
        : post.excerpt
      : "",
    image: post?.coverImage ?? undefined,
    type: "article",
  });

  const ArrowBack = direction === "rtl" ? ArrowRight : ArrowLeft;

  if (isLoading) {
    return (
      <Layout>
        <div className="container px-6 max-w-3xl mx-auto pt-24 pb-24 flex items-center justify-center min-h-[50vh]">
          <p className="text-muted-foreground">
            {language === "he" ? "טוען..." : "Loading..."}
          </p>
        </div>
      </Layout>
    );
  }

  if (!post) {
    return (
      <Layout>
        <div className="container px-6 max-w-3xl mx-auto pt-24 pb-24 text-center">
          <h1 className="text-2xl font-bold mb-4">
            {language === "he" ? "פוסט לא נמצא" : "Post not found"}
          </h1>
          <Link href="/blog">
            <Button variant="outline">
              <ArrowBack className="h-4 w-4 me-2" />
              {language === "he" ? "חזרה לבלוג" : "Back to Blog"}
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const paragraphs = content
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <Layout>
      <article className="container px-6 max-w-3xl mx-auto pt-24 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link href="/blog">
            <Button variant="ghost" className="mb-8 -ms-2 text-muted-foreground hover:text-primary">
              <ArrowBack className="h-4 w-4 me-2" />
              {language === "he" ? "חזרה לבלוג" : "Back to Blog"}
            </Button>
          </Link>

          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Calendar className="h-4 w-4" aria-hidden="true" />
            <time dateTime={new Date(post.publishedAt).toISOString()}>
              {formatDate(post.publishedAt, language)}
            </time>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-8">
            {title}
          </h1>

          {post.coverImage && (
            <div className="mb-10 rounded-xl overflow-hidden aspect-[16/9]">
              <img
                src={post.coverImage}
                alt={title}
                className="w-full h-full object-cover"
                loading="eager"
                draggable={false}
                onContextMenu={(e) => e.preventDefault()}
                onDragStart={(e) => e.preventDefault()}
              />
            </div>
          )}

          <div className="prose prose-lg dark:prose-invert max-w-none space-y-6">
            {paragraphs.map((para, i) => (
              <p key={i} className="text-muted-foreground leading-relaxed text-lg">
                {para}
              </p>
            ))}
          </div>

          <div className="mt-16 pt-8 border-t border-border">
            <Link href="/blog">
              <Button variant="outline">
                <ArrowBack className="h-4 w-4 me-2" />
                {language === "he" ? "לכל הפוסטים" : "All Posts"}
              </Button>
            </Link>
          </div>
        </motion.div>
      </article>
    </Layout>
  );
}
