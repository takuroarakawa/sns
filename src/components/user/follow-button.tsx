"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface FollowButtonProps {
  username: string;
  isFollowing: boolean;
}

export function FollowButton({ username, isFollowing: initialFollowing }: FollowButtonProps) {
  const { toast } = useToast();
  const [isFollowing, setIsFollowing] = useState(initialFollowing);
  const [isLoading, setIsLoading] = useState(false);

  const handleFollow = async () => {
    setIsLoading(true);
    const wasFollowing = isFollowing;

    // Optimistic update
    setIsFollowing(!wasFollowing);

    try {
      const response = await fetch(`/api/users/${username}/follow`, {
        method: wasFollowing ? "DELETE" : "POST",
      });

      if (!response.ok) {
        // Revert on error
        setIsFollowing(wasFollowing);
        const data = await response.json();
        toast({
          title: "Error",
          description: data.error || "Failed to update follow status",
          variant: "destructive",
        });
      }
    } catch (error) {
      setIsFollowing(wasFollowing);
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleFollow}
      disabled={isLoading}
      variant={isFollowing ? "outline" : "default"}
      className="rounded-full"
    >
      {isFollowing ? "Following" : "Follow"}
    </Button>
  );
}
