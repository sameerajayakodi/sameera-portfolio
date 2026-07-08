import React, { useState, useEffect } from "react";
import { BookOpen, Calendar, Clock, ArrowRight, X, Heart, MessageSquare } from "lucide-react";
import { BlogPost } from "../types";

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [likes, setLikes] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  // Keyboard shortcut to close article with Esc
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && selectedPost) {
        setSelectedPost(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedPost]);

  useEffect(() => {
    fetch("/api/blog")
      .then((res) => res.json())
      .then((data) => {
        setPosts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading blog posts:", err);
        setLoading(false);
      });
  }, []);

  const handleLike = (postId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikes((prev) => ({
      ...prev,
      [postId]: (prev[postId] || 0) + 1,
    }));

    // Log like action to analytics
    fetch("/api/system-stats/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "btn_click",
        element: `blog_like_${postId}`,
      }),
    }).catch((err) => console.error(err));
  };

  const handlePostClick = (post: BlogPost) => {
    setSelectedPost(post);
    // Track read event
    fetch("/api/system-stats/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "page_view",
        page: `blog_view_${post.id}`,
      }),
    }).catch((err) => console.error(err));
  };

  if (loading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-400 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Tab Header */}
      <div className="border-b border-neutral-100 pb-5 dark:border-white/10">
        <h2 className="font-serif text-2xl font-normal text-neutral-900 dark:text-white sm:text-3xl">
          Technical Articles
        </h2>
        <p className="mt-1 text-xs font-mono uppercase tracking-widest text-neutral-450 dark:text-zinc-500">
          In-depth writeups on architecture, automation, and full-stack performance solutions written by Sameera.
        </p>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <article
            key={post.id}
            onClick={() => handlePostClick(post)}
            className="group flex cursor-pointer flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm hover:border-neutral-900 dark:border-white/10 dark:bg-white/1 dark:hover:border-white/20 transition duration-300"
          >
            {/* Card Content */}
            <div className="flex-1 p-6 space-y-4">
              <div className="flex items-center justify-between text-xs text-neutral-400">
                <span className="rounded border border-neutral-200 bg-neutral-100 dark:bg-white/10 px-2 py-0.5 text-[9px] font-mono uppercase tracking-wider text-neutral-600 dark:text-zinc-300 dark:border-white/10">
                  {post.category}
                </span>
                <span className="flex items-center space-x-1 text-[10px] font-mono uppercase tracking-widest text-neutral-450 dark:text-zinc-500">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{post.readTime}</span>
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="font-serif text-base font-normal text-neutral-900 group-hover:text-neutral-850 transition dark:text-white dark:group-hover:text-zinc-300">
                  {post.title}
                </h3>
                <p className="text-xs text-neutral-500 dark:text-zinc-450 line-clamp-3 leading-relaxed font-light">
                  {post.excerpt}
                </p>
              </div>
            </div>

            {/* Card Footer */}
            <div className="flex items-center justify-between border-t border-neutral-100 bg-neutral-50/30 p-4 dark:border-white/10 dark:bg-white/2">
              <div className="flex items-center space-x-1 text-[10px] font-mono uppercase tracking-widest text-neutral-450">
                <Calendar className="h-3.5 w-3.5" />
                <span>{post.date}</span>
              </div>

              <div className="flex items-center space-x-3">
                {/* Like Button */}
                <button
                  onClick={(e) => handleLike(post.id, e)}
                  className="flex items-center space-x-1 text-xs text-neutral-400 hover:text-red-500 transition cursor-pointer"
                >
                  <Heart className={`h-3.5 w-3.5 ${likes[post.id] ? "fill-red-500 text-red-500" : ""}`} />
                  <span>{likes[post.id] || 12 + post.id.length}</span>
                </button>

                <span className="flex items-center space-x-1 text-xs text-neutral-400">
                  <MessageSquare className="h-3.5 w-3.5" />
                  <span>{(post.id.length % 4) + 1}</span>
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Expanded Article Drawer overlay / popup modal */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md animate-fadeIn">
          <div className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white p-6 shadow-2xl dark:bg-sophisticated-bg dark:border dark:border-white/10 sm:p-8">
            {/* Close Button */}
            <button
              onClick={() => setSelectedPost(null)}
              className="absolute top-4 right-4 rounded-full p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 dark:hover:bg-white/5 dark:hover:text-neutral-200 transition cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Header */}
            <div className="border-b border-neutral-100 pb-5 dark:border-white/10">
              <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-neutral-450">
                <span className="rounded border border-neutral-200 bg-neutral-100 dark:bg-white/10 px-2 py-0.5 text-[9px] font-mono uppercase tracking-wider text-neutral-600 dark:text-zinc-300 dark:border-white/10">
                  {selectedPost.category}
                </span>
                <span>•</span>
                <span>{selectedPost.date}</span>
                <span>•</span>
                <span className="flex items-center space-x-1">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{selectedPost.readTime}</span>
                </span>
              </div>
              <h2 className="mt-3 font-serif text-2xl font-normal text-neutral-900 dark:text-white sm:text-3xl leading-tight">
                {selectedPost.title}
              </h2>
            </div>

            {/* Article Content formatted manually for elegance and high readability */}
            <div className="prose prose-neutral max-w-none pt-6 text-neutral-700 dark:text-zinc-300 leading-relaxed space-y-4 font-light text-sm">
              {selectedPost.content.split("\n\n").map((chunk, idx) => {
                if (chunk.trim().startsWith("###")) {
                  return (
                    <h3 key={idx} className="font-serif text-lg font-normal text-neutral-900 dark:text-white pt-4 border-b border-neutral-100 dark:border-white/10 pb-1">
                      {chunk.replace("###", "").trim()}
                    </h3>
                  );
                } else if (chunk.trim().startsWith("-")) {
                  return (
                    <ul key={idx} className="list-disc list-inside space-y-1.5 pl-4 text-xs font-light">
                      {chunk.split("\n").map((li, k) => (
                        <li key={k}>{li.replace("-", "").trim()}</li>
                      ))}
                    </ul>
                  );
                } else if (chunk.trim().startsWith("```")) {
                  const cleaned = chunk.replace(/```[a-z]*/g, "").trim();
                  return (
                    <pre key={idx} className="overflow-x-auto rounded-xl border border-neutral-200 bg-neutral-50 p-4 font-mono text-xs dark:border-white/10 dark:bg-white/5 text-neutral-800 dark:text-neutral-200">
                      {cleaned}
                    </pre>
                  );
                }
                return <p key={idx}>{chunk.trim()}</p>;
              })}
            </div>

            {/* Drawer Footer controls */}
            <div className="mt-8 flex justify-end border-t border-neutral-100 pt-5 dark:border-white/10">
              <button
                onClick={() => setSelectedPost(null)}
                className="rounded-lg border border-neutral-200 bg-white px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-neutral-750 hover:bg-neutral-50 dark:border-white/10 dark:bg-white/5 dark:text-zinc-350 dark:hover:bg-white/10 transition cursor-pointer"
              >
                Close Article
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
