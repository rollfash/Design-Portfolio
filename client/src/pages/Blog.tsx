import { Layout } from "@/components/layout/Layout";
import { useLanguage } from "@/lib/language-context";
import { useSEO } from "@/lib/seo";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";
import type { BlogPost } from "@shared/schema";

function formatDate(date: string | Date, language: string): string {
  const d = new Date(date);
  return d.toLocaleDateString(language === "he" ? "he-IL" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function Blog() {
  const { language, t } = useLanguage();

  useSEO({
    title:
      language === "he"
        ? "בלוג | גל שינהורן - מחשבות על עיצוב"
        : "Blog | Gal Shinhorn - Design Thoughts",
    description:
      language === "he"
        ? "מחשבות, השראות וטיפים בנושא עיצוב פנים, עיצוב סטים וחללי חוויה."
        : "Thoughts, inspiration and tips on interior design, set design and experiential spaces.",
    type: "website",
  });

  const { data: posts = [], isLoading } = useQuery<BlogPost[]>({
    queryKey: ["blog"],
    queryFn: async () => {
      const res = await fetch("/api/blog");
      if (!res.ok) throw new Error("Failed to fetch blog posts");
      return res.json();
    },
  });

  return (
    <Layout>
      <div className="container px-6 max-w-[1920px] pt-12 pb-24 flex flex-col items-center mx-auto">
        <div className="text-center mb-16 max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">{t("blog.title")}</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t("blog.subtitle")}
          </p>
        </div>

        {isLoading && (
          <div className="text-muted-foreground text-lg">
            {language === "he" ? "טוען..." : "Loading..."}
          </div>
        )}

        {!isLoading && posts.length === 0 && (
          <div className="text-center text-muted-foreground py-24">
            <p className="text-xl">{t("blog.empty")}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-7xl">
          {posts.map((post, i) => {
            const title =
              language === "en" && post.titleEn ? post.titleEn : post.title;
            const excerpt =
              language === "en" && post.excerptEn
                ? post.excerptEn
                : post.excerpt;

            return (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
              >
                <Link href={`/blog/${post.id}`} data-testid={`link-blog-${post.id}`}>
                  <article className="group flex flex-col h-full bg-card border border-border rounded-lg overflow-hidden hover:border-primary/40 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md">
                    {post.coverImage ? (
                      <div className="aspect-[16/9] overflow-hidden bg-muted">
                        <img
                          src={post.coverImage}
                          alt={title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading={i < 3 ? "eager" : "lazy"}
                          draggable={false}
                          onContextMenu={(e) => e.preventDefault()}
                          onDragStart={(e) => e.preventDefault()}
                        />
                      </div>
                    ) : (
                      <div className="aspect-[16/9] bg-secondary/30 flex items-center justify-center">
                        <span className="text-4xl text-muted-foreground/30">✍</span>
                      </div>
                    )}

                    <div className="flex flex-col flex-1 p-6 gap-3">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" aria-hidden="true" />
                        <time dateTime={new Date(post.publishedAt).toISOString()}>
                          {formatDate(post.publishedAt, language)}
                        </time>
                      </div>

                      <h2 className="text-xl font-semibold leading-snug group-hover:text-primary transition-colors line-clamp-2">
                        {title}
                      </h2>

                      <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 flex-1">
                        {excerpt}
                      </p>

                      <span className="text-sm font-medium text-primary mt-1 group-hover:underline">
                        {t("blog.readMore")}
                      </span>
                    </div>
                  </article>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}
