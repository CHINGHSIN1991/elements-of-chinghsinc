import type { Project } from "../../types";

export function invalidResult(): never {
  throw new Error('Invalid result')
}

export function slugify(text: string) {
  if (text) {
    return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
  } else {
    return invalidResult()
  }
}

export function formatDate(date: Date) {
  return new Date(date).toLocaleDateString('en-US', {
    timeZone: "UTC",
  })
}

export function formatProjectPost(posts: Project[], {
  filterOutDrafts = true,
  filterOutFuturePosts = true,
  sortByDate = true,
  limit = undefined as number | undefined,
} = {}) {
  const filteredPosts = posts.reduce((acc, post) => {
    const { date, draft } = post.frontmatter;

    // filterOutDrafts if true
    if (filterOutDrafts && draft) return acc;

    // filterOutFuturePosts if true
    if (filterOutFuturePosts && new Date(date) > new Date()) return acc;
    // add post to acc
    acc.push(post);
    return acc;
  }, [] as Project[])
  // sort by date or randomize
  if (sortByDate) {
    filteredPosts.sort((a, b) => {
      const dateA = new Date((a as Project).frontmatter.date).getTime();
      const dateB = new Date((b as Project).frontmatter.date).getTime();
      return dateB - dateA;
    });
  } else {
    filteredPosts.sort(() => Math.random() - 0.5);
  }

  // limit if number is passed
  if (typeof limit === "number") {
    return filteredPosts.slice(0, limit);
  }

  return filteredPosts;
}