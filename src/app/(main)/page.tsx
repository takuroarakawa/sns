"use client";

import { useState, useEffect, useCallback } from "react";
import { useInView } from "react-intersection-observer";

import { PostComposer } from "@/components/post/post-composer";
import { PostCard } from "@/components/post/post-card";

interface Post {
  id: string;
  content: string | null;
  postType: string;
  contentRating: string;
  createdAt: string;
  user: {
    id: string;
    username: string;
    displayName: string;
    avatarUrl: string | null;
    isVerified: boolean;
    userTier: string;
  };
  media: Array<{
    id: string;
    url: string;
    thumbnailUrl: string | null;
    mediaType: string;
    width: number | null;
    height: number | null;
  }>;
  likeCount: number;
  _count: {
    likes: number;
    replies: number;
    reposts: number;
  };
  isLiked: boolean;
}

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [nextCursor, setNextCursor] = useState<string | undefined>();
  const [hasMore, setHasMore] = useState(true);

  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "100px",
  });

  const fetchPosts = useCallback(async (cursor?: string) => {
    try {
      const params = new URLSearchParams({
        limit: "20",
        feedType: "home",
      });
      if (cursor) params.set("cursor", cursor);

      const response = await fetch(`/api/posts?${params}`);
      if (!response.ok) throw new Error("Failed to fetch posts");

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching posts:", error);
      return { posts: [], nextCursor: undefined };
    }
  }, []);

  // Initial load
  useEffect(() => {
    const loadInitialPosts = async () => {
      setIsLoading(true);
      const data = await fetchPosts();
      setPosts(data.posts);
      setNextCursor(data.nextCursor);
      setHasMore(!!data.nextCursor);
      setIsLoading(false);
    };

    loadInitialPosts();
  }, [fetchPosts]);

  // Load more on scroll
  useEffect(() => {
    const loadMore = async () => {
      if (!inView || !hasMore || isLoading) return;

      setIsLoading(true);
      const data = await fetchPosts(nextCursor);
      setPosts((prev) => [...prev, ...data.posts]);
      setNextCursor(data.nextCursor);
      setHasMore(!!data.nextCursor);
      setIsLoading(false);
    };

    loadMore();
  }, [inView, hasMore, isLoading, nextCursor, fetchPosts]);

  const handlePostCreated = (newPost: Post) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  const handleLikeUpdate = (postId: string, isLiked: boolean, newCount: number) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? { ...post, isLiked, likeCount: newCount }
          : post
      )
    );
  };

  return (
    <div>
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="px-4 py-3">
          <h1 className="text-xl font-bold">Home</h1>
        </div>
      </header>

      {/* Post Composer */}
      <PostComposer onPostCreated={handlePostCreated} />

      {/* Feed */}
      <div>
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onLikeUpdate={handleLikeUpdate}
          />
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="p-8 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent" />
          </div>
        )}

        {/* Load more trigger */}
        {hasMore && !isLoading && <div ref={ref} className="h-10" />}

        {/* Empty state */}
        {!isLoading && posts.length === 0 && (
          <div className="p-8 text-center">
            <p className="text-muted-foreground">No posts yet. Be the first to post!</p>
          </div>
        )}

        {/* End of feed */}
        {!hasMore && posts.length > 0 && (
          <div className="p-8 text-center text-muted-foreground">
            You&apos;ve reached the end
          </div>
        )}
      </div>
    </div>
  );
}
