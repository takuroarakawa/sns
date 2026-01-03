"use client";

import { useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { Image, Film, FileText, Smile, X } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface PostComposerProps {
  onPostCreated?: (post: unknown) => void;
  placeholder?: string;
  replyTo?: string;
}

export function PostComposer({ 
  onPostCreated, 
  placeholder = "What's happening?",
  replyTo 
}: PostComposerProps) {
  const { data: session } = useSession();
  const { toast } = useToast();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contentRating, setContentRating] = useState<"SFW" | "NSFW">("SFW");

  const handleSubmit = async () => {
    if (!content.trim() || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: content.trim(),
          postType: "TEXT",
          contentRating,
          visibility: "PUBLIC",
          parentId: replyTo,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        toast({
          title: "Error",
          description: data.error || "Failed to create post",
          variant: "destructive",
        });
        return;
      }

      const post = await response.json();
      setContent("");
      setContentRating("SFW");
      onPostCreated?.(post);

      toast({
        title: "Success",
        description: replyTo ? "Reply posted!" : "Post created!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  };

  if (!session?.user) {
    return null;
  }

  // ROM users cannot post
  if (session.user.userTier === "ROM") {
    return (
      <div className="border-b border-border p-4">
        <p className="text-center text-muted-foreground">
          Upgrade to Creator to start posting
        </p>
      </div>
    );
  }

  return (
    <div className="border-b border-border p-4">
      <div className="flex gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={session.user.image || undefined} alt={session.user.name || ""} />
          <AvatarFallback>
            {session.user.name?.[0]?.toUpperCase() || session.user.username[0].toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={handleTextareaChange}
            placeholder={placeholder}
            className="w-full resize-none bg-transparent text-lg outline-none placeholder:text-muted-foreground min-h-[60px]"
            rows={1}
            maxLength={5000}
          />

          {/* Content Rating Toggle */}
          <div className="flex items-center gap-2 mt-2">
            <button
              type="button"
              onClick={() => setContentRating(contentRating === "SFW" ? "NSFW" : "SFW")}
              className={`px-2 py-0.5 text-xs font-medium rounded transition-colors ${
                contentRating === "NSFW"
                  ? "bg-destructive/10 text-destructive"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {contentRating}
            </button>
          </div>

          <div className="flex items-center justify-between mt-3 border-t border-border pt-3">
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" className="h-9 w-9 text-primary" disabled>
                <Image className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9 text-primary" disabled>
                <Film className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9 text-primary" disabled>
                <FileText className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9 text-primary" disabled>
                <Smile className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              {content.length > 0 && (
                <span className={`text-sm ${content.length > 4500 ? "text-destructive" : "text-muted-foreground"}`}>
                  {content.length}/5000
                </span>
              )}
              <Button
                onClick={handleSubmit}
                disabled={!content.trim() || isSubmitting}
                className="rounded-full px-4"
              >
                {isSubmitting ? "Posting..." : replyTo ? "Reply" : "Post"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
