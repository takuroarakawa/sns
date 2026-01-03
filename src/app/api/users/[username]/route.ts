import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

// GET /api/users/[username] - Get user profile
export async function GET(
  req: Request,
  { params }: { params: { username: string } }
) {
  try {
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
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if current user is following this user
    let isFollowing = false;
    let isFollowedBy = false;

    if (session?.user && session.user.id !== user.id) {
      const [followStatus, followedByStatus] = await Promise.all([
        db.follow.findUnique({
          where: {
            followerId_followingId: {
              followerId: session.user.id,
              followingId: user.id,
            },
          },
        }),
        db.follow.findUnique({
          where: {
            followerId_followingId: {
              followerId: user.id,
              followingId: session.user.id,
            },
          },
        }),
      ]);

      isFollowing = !!followStatus;
      isFollowedBy = !!followedByStatus;
    }

    return NextResponse.json({
      ...user,
      isFollowing,
      isFollowedBy,
      isOwnProfile: session?.user?.id === user.id,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH /api/users/[username] - Update user profile
export async function PATCH(
  req: Request,
  { params }: { params: { username: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { username } = params;

    // Find user and verify ownership
    const user = await db.user.findUnique({
      where: { username },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.id !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { displayName, bio, avatarUrl, bannerUrl } = body;

    const updatedUser = await db.user.update({
      where: { id: user.id },
      data: {
        ...(displayName !== undefined && { displayName }),
        ...(bio !== undefined && { bio }),
        ...(avatarUrl !== undefined && { avatarUrl }),
        ...(bannerUrl !== undefined && { bannerUrl }),
      },
      select: {
        id: true,
        username: true,
        displayName: true,
        bio: true,
        avatarUrl: true,
        bannerUrl: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
