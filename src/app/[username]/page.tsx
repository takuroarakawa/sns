import { notFound } from "next/navigation";
import Link from "next/link";
import { CalendarDays, MapPin, LinkIcon, BadgeCheck } from "lucide-react";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatNumber } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { FollowButton } from "@/components/user/follow-button";
import { ProfilePosts } from "@/components/user/profile-posts";

interface ProfilePageProps {
  params: { username: string };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const session = await auth();
  const { username } = params;

  const user = await db.user.findUnique({
    where: { username },
    select: {
      id: true,
      username: true,
      displayName: true,
      bio: true,
      avatarUrl: true,
      bannerUrl: true,
      userTier: true,
      isVerified: true,
      creatorTypes: true,
      followerCount: true,
      followingCount: true,
      postCount: true,
      createdAt: true,
    },
  });

  if (!user) {
    notFound();
  }

  // Check if current user is following
  let isFollowing = false;
  if (session?.user && session.user.id !== user.id) {
    const follow = await db.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: session.user.id,
          followingId: user.id,
        },
      },
    });
    isFollowing = !!follow;
  }

  const isOwnProfile = session?.user?.id === user.id;
  const joinDate = new Date(user.createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div>
      {/* Banner */}
      <div className="h-48 bg-muted relative">
        {user.bannerUrl && (
          <img
            src={user.bannerUrl}
            alt=""
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Profile Header */}
      <div className="px-4 pb-4">
        {/* Avatar and Actions */}
        <div className="flex justify-between items-start -mt-16 mb-4">
          <Avatar className="h-32 w-32 border-4 border-background">
            <AvatarImage src={user.avatarUrl || undefined} alt={user.displayName} />
            <AvatarFallback className="text-4xl">
              {user.displayName[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="mt-20">
            {isOwnProfile ? (
              <Button variant="outline" className="rounded-full" asChild>
                <Link href="/settings/profile">Edit profile</Link>
              </Button>
            ) : session?.user ? (
              <FollowButton
                username={user.username}
                isFollowing={isFollowing}
              />
            ) : (
              <Button variant="outline" className="rounded-full" asChild>
                <Link href="/login">Follow</Link>
              </Button>
            )}
          </div>
        </div>

        {/* User Info */}
        <div className="space-y-3">
          <div>
            <div className="flex items-center gap-1">
              <h1 className="text-xl font-bold">{user.displayName}</h1>
              {user.isVerified && (
                <BadgeCheck className="h-5 w-5 text-primary" />
              )}
            </div>
            <p className="text-muted-foreground">@{user.username}</p>
          </div>

          {/* Creator Types */}
          {user.creatorTypes.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {user.creatorTypes.map((type) => (
                <span
                  key={type}
                  className="px-2 py-0.5 text-xs font-medium rounded-full bg-primary/10 text-primary"
                >
                  {type.toLowerCase()}
                </span>
              ))}
            </div>
          )}

          {user.bio && <p className="whitespace-pre-wrap">{user.bio}</p>}

          {/* Meta info */}
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <CalendarDays className="h-4 w-4" />
              Joined {joinDate}
            </span>
          </div>

          {/* Stats */}
          <div className="flex gap-4">
            <Link href={`/${username}/following`} className="hover:underline">
              <span className="font-bold">{formatNumber(user.followingCount)}</span>
              <span className="text-muted-foreground ml-1">Following</span>
            </Link>
            <Link href={`/${username}/followers`} className="hover:underline">
              <span className="font-bold">{formatNumber(user.followerCount)}</span>
              <span className="text-muted-foreground ml-1">Followers</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border">
        <nav className="flex">
          <Link
            href={`/${username}`}
            className="flex-1 text-center py-4 font-medium border-b-2 border-primary"
          >
            Posts
          </Link>
          <Link
            href={`/${username}/media`}
            className="flex-1 text-center py-4 text-muted-foreground hover:bg-accent/50"
          >
            Media
          </Link>
          <Link
            href={`/${username}/likes`}
            className="flex-1 text-center py-4 text-muted-foreground hover:bg-accent/50"
          >
            Likes
          </Link>
        </nav>
      </div>

      {/* Posts */}
      <ProfilePosts userId={user.id} />
    </div>
  );
}
