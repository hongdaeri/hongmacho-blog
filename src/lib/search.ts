import type { CategoryId } from './categories';

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: CategoryId;
  tags: string[];
  date: string;
  slug: string;
}

export interface ScoredPost {
  post: BlogPost;
  score: number;
}

export function searchPosts(posts: BlogPost[], query: string): BlogPost[] {
  if (!query.trim()) return posts;

  const q = query.toLowerCase().trim();

  const scored: ScoredPost[] = posts.map((post) => {
    let score = 0;
    const titleLower = post.title.toLowerCase();
    const excerptLower = post.excerpt.toLowerCase();

    if (titleLower.includes(q)) score += 10;
    if (titleLower.startsWith(q)) score += 5;
    if (excerptLower.includes(q)) score += 4;
    if (post.tags.some((tag) => tag.toLowerCase().includes(q))) score += 6;
    if (post.category.toLowerCase().includes(q)) score += 3;

    return { post, score };
  });

  return scored
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((item) => item.post);
}
