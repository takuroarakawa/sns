"use client";

import { useState, useEffect, useCallback } from "react";
import { PostCard } from "@/components/post/post-card";

interface ProfilePostsProps {
  userId: string;
}

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

export function ProfilePosts({ userId }: ProfilePostsProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPosts = useCallback(async () => {
    try {
      const response = await fetch(`/api/posts?userId=${userId}`);
      if (!response.ok) throw new Error("Failed to fetch posts");

      const data = await response.json();
      setPosts(data.posts);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent" />
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">No posts yet</p>
      </div>
    );
  }

  return (
    <div>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
