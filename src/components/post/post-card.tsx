"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, MessageCircle, Repeat2, Bookmark, Share, MoreHorizontal, BadgeCheck } from "lucide-react";

import { cn, formatDate, formatNumber } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface PostUser {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  isVerified: boolean;
  userTier: string;
}

interface PostMedia {
  id: string;
  url: string;
  thumbnailUrl: string | null;
  mediaType: string;
  width: number | null;
  height: number | null;
}

interface Post {
  id: string;
  content: string | null;
  postType: string;
  contentRating: string;
  createdAt: string;
  user: PostUser;
  media: PostMedia[];
  likeCount: number;
  _count: {
    likes: number;
    replies: number;
    reposts: number;
  };
  isLiked?: boolean;
}

interface PostCardProps {
  post: Post;
  onLikeUpdate?: (postId: string, isLiked: boolean, newCount: number) => void;
}

export function PostCard({ post, onLikeUpdate }: PostCardProps) {
  const { toast } = useToast();
  const [isLiked, setIsLiked] = useState(post.isLiked || false);
  const [likeCount, setLikeCount] = useState(post.likeCount || post._count.likes);
  const [isLiking, setIsLiking] = useState(false);

  const handleLike = async () => {
    if (isLiking) return;
    
    setIsLiking(true);
    const wasLiked = isLiked;
    const prevCount = likeCount;

    // Optimistic update
    setIsLiked(!wasLiked);
    setLikeCount(wasLiked ? prevCount - 1 : prevCount + 1);

    try {
      const response = await fetch(`/api/posts/${post.id}/like`, {
        method: wasLiked ? "DELETE" : "POST",
      });

      if (!response.ok) {
        // Revert on error
        setIsLiked(wasLiked);
        setLikeCount(prevCount);
        toast({
          title: "Error",
          description: "Could not update like",
          variant: "destructive",
        });
      } else {
        onLikeUpdate?.(post.id, !wasLiked, wasLiked ? prevCount - 1 : prevCount + 1);
      }
    } catch (error) {
      // Revert on error
      setIsLiked(wasLiked);
      setLikeCount(prevCount);
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <article className="border-b border-border p-4 hover:bg-accent/5 transition-colors">
      <div className="flex gap-3">
        {/* Avatar */}
        <Link href={`/${post.user.username}`} className="flex-shrink-0">
          <Avatar className="h-10 w-10">
            <AvatarImage src={post.user.avatarUrl || undefined} alt={post.user.displayName} />
            <AvatarFallback>
              {post.user.displayName[0]?.toUpperCase() || post.user.username[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Link>

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-1 text-sm">
            <Link href={`/${post.user.username}`} className="font-bold hover:underline truncate">
              {post.user.displayName}
            </Link>
            {post.user.isVerified && (
              <BadgeCheck className="h-4 w-4 text-primary flex-shrink-0" />
            )}
            <Link href={`/${post.user.username}`} className="text-muted-foreground truncate">
              @{post.user.username}
            </Link>
            <span className="text-muted-foreground">·</span>
            <Link href={`/post/${post.id}`} className="text-muted-foreground hover:underline">
              {formatDate(post.createdAt)}
            </Link>
            <Button variant="ghost" size="icon" className="ml-auto h-8 w-8 -mr-2">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          {post.content && (
            <Link href={`/post/${post.id}`}>
              <p className="mt-1 whitespace-pre-wrap break-words">{post.content}</p>
            </Link>
          )}

          {/* Content Rating Badge */}
          {post.contentRating !== "SFW" && (
            <span className="inline-block mt-2 px-2 py-0.5 text-xs font-medium rounded bg-destructive/10 text-destructive">
              {post.contentRating}
            </span>
          )}

          {/* Media */}
          {post.media && post.media.length > 0 && (
            <div className={cn(
              "mt-3 rounded-xl overflow-hidden border border-border",
              post.media.length === 1 && "max-w-xl",
              post.media.length === 2 && "grid grid-cols-2 gap-0.5",
              post.media.length >= 3 && "grid grid-cols-2 gap-0.5"
            )}>
              {post.media.slice(0, 4).map((media, index) => (
                <div key={media.id} className="relative aspect-video bg-muted">
                  {media.mediaType === "IMAGE" || media.mediaType === "MANGA_PAGE" ? (
                    <img
                      src={media.url}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : media.mediaType === "VIDEO" ? (
                    <video
                      src={media.url}
                      controls
                      className="w-full h-full object-cover"
                    />
                  ) : null}
                  {index === 3 && post.media.length > 4 && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <span className="text-white text-2xl font-bold">
                        +{post.media.length - 4}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between mt-3 max-w-md -ml-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-primary gap-1"
              asChild
            >
              <Link href={`/post/${post.id}`}>
                <MessageCircle className="h-4 w-4" />
                <span className="text-xs">{formatNumber(post._count.replies)}</span>
              </Link>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-green-500 gap-1"
            >
              <Repeat2 className="h-4 w-4" />
              <span className="text-xs">{formatNumber(post._count.reposts)}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "gap-1",
                isLiked ? "text-red-500" : "text-muted-foreground hover:text-red-500"
              )}
              onClick={handleLike}
              disabled={isLiking}
            >
              <Heart className={cn("h-4 w-4", isLiked && "fill-current")} />
              <span className="text-xs">{formatNumber(likeCount)}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-primary"
            >
              <Bookmark className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-primary"
            >
              <Share className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}
