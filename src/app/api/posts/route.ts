import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

const createPostSchema = z.object({
  content: z.string().min(1, "Content is required").max(5000, "Content too long"),
  postType: z.enum(["TEXT", "IMAGE", "VIDEO", "DOCUMENT", "MANGA_CHAPTER"]).default("TEXT"),
  contentRating: z.enum(["SFW", "NSFW", "NSFW_EXTREME"]).default("SFW"),
  visibility: z.enum(["PUBLIC", "FOLLOWERS", "SUBSCRIBERS", "PRIVATE"]).default("PUBLIC"),
  mediaIds: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  scientificMetadata: z.object({
    doi: z.string().optional(),
    citations: z.array(z.string()).optional(),
    institution: z.string().optional(),
    field: z.string().optional(),
  }).optional(),
});

// GET /api/posts - Get feed posts
export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const cursor = searchParams.get("cursor");
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const feedType = searchParams.get("feedType") || "home"; // home, following, explore

    let posts;

    if (feedType === "following") {
      // Get posts from users the current user follows
      const following = await db.follow.findMany({
        where: { followerId: session.user.id },
        select: { followingId: true },
      });

      const followingIds = following.map((f) => f.followingId);
      followingIds.push(session.user.id); // Include own posts

      posts = await db.post.findMany({
        where: {
          userId: { in: followingIds },
          deletedAt: null,
          visibility: "PUBLIC",
        },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              displayName: true,
              avatarUrl: true,
              isVerified: true,
              userTier: true,
            },
          },
          media: true,
          _count: {
            select: {
              likes: true,
              replies: true,
              reposts: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: limit + 1,
        ...(cursor && { cursor: { id: cursor }, skip: 1 }),
      });
    } else {
      // Home/Explore feed - all public posts
      posts = await db.post.findMany({
        where: {
          deletedAt: null,
          visibility: "PUBLIC",
          parentId: null, // Only top-level posts
        },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              displayName: true,
              avatarUrl: true,
              isVerified: true,
              userTier: true,
            },
          },
          media: true,
          _count: {
            select: {
              likes: true,
              replies: true,
              reposts: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: limit + 1,
        ...(cursor && { cursor: { id: cursor }, skip: 1 }),
      });
    }

    // Check if there are more posts
    let nextCursor: string | undefined;
    if (posts.length > limit) {
      const nextItem = posts.pop();
      nextCursor = nextItem?.id;
    }

    // Check if current user has liked each post
    const postIds = posts.map((p) => p.id);
    const userLikes = await db.like.findMany({
      where: {
        userId: session.user.id,
        postId: { in: postIds },
      },
      select: { postId: true },
    });
    const likedPostIds = new Set(userLikes.map((l) => l.postId));

    const postsWithLikeStatus = posts.map((post) => ({
      ...post,
      isLiked: likedPostIds.has(post.id),
    }));

    return NextResponse.json({
      posts: postsWithLikeStatus,
      nextCursor,
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/posts - Create a new post
export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is a creator (ROM users cannot post)
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { userTier: true },
    });

    if (user?.userTier === "ROM") {
      return NextResponse.json(
        { error: "ROM users cannot create posts. Upgrade to Creator to post." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const validatedData = createPostSchema.parse(body);

    // Create the post
    const post = await db.post.create({
      data: {
        userId: session.user.id,
        content: validatedData.content,
        postType: validatedData.postType,
        contentRating: validatedData.contentRating,
        visibility: validatedData.visibility,
        scientificMetadata: validatedData.scientificMetadata,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true,
            isVerified: true,
            userTier: true,
          },
        },
        media: true,
        _count: {
          select: {
            likes: true,
            replies: true,
            reposts: true,
          },
        },
      },
    });

    // Update user's post count
    await db.user.update({
      where: { id: session.user.id },
      data: { postCount: { increment: 1 } },
    });

    // Handle tags if provided
    if (validatedData.tags && validatedData.tags.length > 0) {
      for (const tagName of validatedData.tags) {
        const slug = tagName.toLowerCase().replace(/\s+/g, "-");
        
        // Upsert tag
        const tag = await db.tag.upsert({
          where: { slug },
          update: { postCount: { increment: 1 } },
          create: { name: tagName, slug },
        });

        // Link tag to post
        await db.postTag.create({
          data: { postId: post.id, tagId: tag.id },
        });
      }
    }

    // Link media if provided
    if (validatedData.mediaIds && validatedData.mediaIds.length > 0) {
      await db.media.updateMany({
        where: {
          id: { in: validatedData.mediaIds },
          userId: session.user.id,
          postId: null,
        },
        data: { postId: post.id },
      });
    }

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error creating post:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
