import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

// POST /api/users/[username]/follow - Follow a user
export async function POST(
  req: Request,
  { params }: { params: { username: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { username } = params;

    // Find the user to follow
    const userToFollow = await db.user.findUnique({
      where: { username },
      select: { id: true },
    });

    if (!userToFollow) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Cannot follow yourself
    if (userToFollow.id === session.user.id) {
      return NextResponse.json(
        { error: "Cannot follow yourself" },
        { status: 400 }
      );
    }

    // Check if already following
    const existingFollow = await db.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: session.user.id,
          followingId: userToFollow.id,
        },
      },
    });

    if (existingFollow) {
      return NextResponse.json(
        { error: "Already following" },
        { status: 400 }
      );
    }

    // Create follow and update counts in a transaction
    await db.$transaction([
      db.follow.create({
        data: {
          followerId: session.user.id,
          followingId: userToFollow.id,
        },
      }),
      db.user.update({
        where: { id: session.user.id },
        data: { followingCount: { increment: 1 } },
      }),
      db.user.update({
        where: { id: userToFollow.id },
        data: { followerCount: { increment: 1 } },
      }),
    ]);

    // Create notification
    await db.notification.create({
      data: {
        userId: userToFollow.id,
        type: "FOLLOW",
        actorId: session.user.id,
      },
    });

    return NextResponse.json({ success: true, following: true });
  } catch (error) {
    console.error("Error following user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/users/[username]/follow - Unfollow a user
export async function DELETE(
  req: Request,
  { params }: { params: { username: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { username } = params;

    // Find the user to unfollow
    const userToUnfollow = await db.user.findUnique({
      where: { username },
      select: { id: true },
    });

    if (!userToUnfollow) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if following
    const existingFollow = await db.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: session.user.id,
          followingId: userToUnfollow.id,
        },
      },
    });

    if (!existingFollow) {
      return NextResponse.json(
        { error: "Not following" },
        { status: 400 }
      );
    }

    // Delete follow and update counts in a transaction
    await db.$transaction([
      db.follow.delete({
        where: {
          followerId_followingId: {
            followerId: session.user.id,
            followingId: userToUnfollow.id,
          },
        },
      }),
      db.user.update({
        where: { id: session.user.id },
        data: { followingCount: { decrement: 1 } },
      }),
      db.user.update({
        where: { id: userToUnfollow.id },
        data: { followerCount: { decrement: 1 } },
      }),
    ]);

    return NextResponse.json({ success: true, following: false });
  } catch (error) {
    console.error("Error unfollowing user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
