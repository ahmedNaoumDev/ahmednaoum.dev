import Link from "next/link";
import React from "react";
import { allBlogs, allProjects } from "contentlayer/generated";
import { Navigation } from "../components/nav";
import { Card } from "../components/card";
import { Article } from "./article";
import { Eye } from "lucide-react";
import { Redis } from "@upstash/redis/nodejs";
import { blob } from "stream/consumers";

export const revalidate = 60;
const redis = Redis.fromEnv();

export default async function BlogsPage() {
  const views = (
    await redis.mget<number[]>(
      ...allBlogs.map((b) => ["pageviews", "blogs", b.slug].join(":"))
    )
  ).reduce((acc, v, i) => {
    acc[allBlogs[i].slug] = v ?? 0;
    return acc;
  }, {} as Record<string, number>);
  const featured = allBlogs.find((blog) => blog.slug === "webdev-journey")!;
  const top2 = allBlogs.find((blog) => blog.slug === "TechStack-Saas")!;
  const top3 = allBlogs.find((blog) => blog.slug === "Value-ot-time")!;
  const sorted = allBlogs
    .filter(
      (blog) =>
        blog.slug !== featured.slug &&
        blog.slug !== top2.slug &&
        blog.slug !== top3.slug
    )
    .sort(
      (a, b) =>
        new Date(b.date ?? Number.POSITIVE_INFINITY).getTime() -
        new Date(a.date ?? Number.POSITIVE_INFINITY).getTime()
    );

  return (
    <div className="relative pb-16">
      <Navigation />
      <div className="px-6 pt-16 mx-auto space-y-8 max-w-7xl lg:px-8 md:space-y-16 md:pt-24 lg:pt-32">
        <div className="max-w-2xl mx-auto lg:mx-0">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl">
            Blogs
          </h2>
          <p className="mt-4 text-zinc-400">
            I write blogs from time time about what I have learned and The tech
            stack that I work with to build my Saas projects
          </p>
        </div>
        <div className="w-full h-px bg-zinc-800" />

        <div className="grid grid-cols-1 gap-8 mx-auto lg:grid-cols-2 ">
          <Card>
            <Link href={`/blogs/${featured.slug}`}>
              <article className="relative w-full h-full p-4 md:p-8">
                <div className="flex items-center justify-between gap-2">
                  <div className="text-xs text-zinc-100">
                    {featured.date ? (
                      <time dateTime={new Date(featured.date).toISOString()}>
                        {Intl.DateTimeFormat(undefined, {
                          dateStyle: "medium",
                        }).format(new Date(featured.date))}
                      </time>
                    ) : (
                      <span>SOON</span>
                    )}
                  </div>
                  <span className="flex items-center gap-1 text-xs text-zinc-500">
                    <Eye className="w-4 h-4" />{" "}
                    {Intl.NumberFormat("en-US", { notation: "compact" }).format(
                      views[featured.slug] ?? 0
                    )}
                  </span>
                </div>

                <h2
                  id="featured-post"
                  className="mt-4 text-3xl font-bold text-zinc-100 group-hover:text-white sm:text-4xl font-display"
                >
                  {featured.title}
                </h2>
                <p className="mt-4 leading-8 duration-150 text-zinc-400 group-hover:text-zinc-300">
                  {featured.description}
                </p>
                <div className="absolute bottom-4 md:bottom-8">
                  <p className="hidden text-zinc-200 hover:text-zinc-50 lg:block">
                    Read more <span aria-hidden="true">&rarr;</span>
                  </p>
                </div>
              </article>
            </Link>
          </Card>

          <div className="flex flex-col w-full gap-8 mx-auto border-t border-gray-900/10 lg:mx-0 lg:border-t-0 ">
            {[top2, top3].map((blog) => (
              <Card key={blog.slug}>
                <Article blog={blog} views={views[blog.slug] ?? 0} />
              </Card>
            ))}
          </div>
        </div>
        <div className="hidden w-full h-px md:block bg-zinc-800" />

        <div className="grid grid-cols-1 gap-4 mx-auto lg:mx-0 md:grid-cols-3">
          <div className="grid grid-cols-1 gap-4">
            {sorted
              .filter((_, i) => i % 3 === 0)
              .map((blog) => (
                <Card key={blog.slug}>
                  <Article blog={blog} views={views[blog.slug] ?? 0} />
                </Card>
              ))}
          </div>
          <div className="grid grid-cols-1 gap-4">
            {sorted
              .filter((_, i) => i % 3 === 1)
              .map((blog) => (
                <Card key={blog.slug}>
                  <Article blog={blog} views={views[blog.slug] ?? 0} />
                </Card>
              ))}
          </div>
          <div className="grid grid-cols-1 gap-4">
            {sorted
              .filter((_, i) => i % 3 === 2)
              .map((blog) => (
                <Card key={blog.slug}>
                  <Article blog={blog} views={views[blog.slug] ?? 0} />
                </Card>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
