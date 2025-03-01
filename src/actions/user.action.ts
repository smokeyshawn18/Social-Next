"use server";

import prisma from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function syncUser() {
  try {
    const { userId } = await auth();
    const user = await currentUser();
    if (!userId || !user) return;

    // check if user exists
    const existingUser = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
    });
    if (existingUser) return existingUser;

    const dbUser = await prisma.user.create({
      data: {
        clerkId: userId,
        name: `${user.firstName || ""} ${user.lastName || ""}`,

        username:
          user.username ?? user.emailAddresses[0].emailAddress.split("@")[0],
        email: user.emailAddresses[0].emailAddress,
        image: user.imageUrl,
      },
    });

    return dbUser;
  } catch (error) {
    console.log("Error in syncing user", error);
  }
}

export async function getUserByClerkId(clerkId: string) {
  return prisma.user.findUnique({
    where: {
      clerkId,
    },
    include: {
      _count: {
        select: {
          followers: true,
          following: true,
          posts: true,
        },
      },
    },
  });
}

export async function getDbUserId() {
  const { userId: clerkId } = await auth();
  if (!clerkId) throw new Error("Unauthorized");

  const user = await getUserByClerkId(clerkId);

  if (!user) throw new Error("User not found");
  return user.id;
}

export async function getRandomUsers() {
  try {
    const userid = await getDbUserId();

    const randomUsers = await prisma.user.findMany({
      where: {
        AND: [
          {
            NOT: { id: userid },
          },
          {
            NOT: {
              followers: {
                some: {
                  followerId: userid,
                },
              },
            },
          },
        ],
      },
      select: {
        id: true,
        name: true,
        username: true,
        image: true,
        _count: {
          select: {
            followers: true,
          },
        },
      },
      take: 4,
    });

    return randomUsers;
  } catch (error) {
    console.log("Error in fetching users to follow", error);

    return [];
  }
}

export async function toggleFollow(targetuserId: string) {
  try {
    const userId = await getDbUserId();
    if (!userId) throw new Error("User ID not found!");
    if (userId === targetuserId) throw new Error("You cannot follow yourself!");

    const existingFollow = await prisma.follows.findUnique({
      where: {
        followerId_followingId: {
          followerId: userId,
          followingId: targetuserId,
        },
      },
    });

    if (existingFollow) {
      // Unfollow
      await prisma.follows.delete({
        where: {
          followerId_followingId: {
            followerId: userId,
            followingId: targetuserId,
          },
        },
      });
    } else {
      // Follow
      await prisma.$transaction([
        prisma.follows.create({
          data: {
            followerId: userId,
            followingId: targetuserId,
          },
        }),
        prisma.notification.create({
          data: {
            type: "FOLLOW",
            userId: targetuserId,
            creatorId: userId, // Fixed naming consistency
          },
        }),
      ]);
    }
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error when following user:", error);
    return { success: false, error: "Error when following user" };
  }
}
