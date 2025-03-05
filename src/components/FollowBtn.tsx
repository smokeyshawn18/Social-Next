"use client";

import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { CirclePlus, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { toggleFollow } from "@/actions/user.action";
import { getProfileByUsername } from "@/actions/profile.action";

interface FollowBtnProps {
  username: string; // Pass username as a prop to fetch user details
  userId: string;
}

const FollowBtn: React.FC<FollowBtnProps> = ({ username, userId }) => {
  const [user, setUser] = useState<{ username: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch user profile
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const fetchedUser = await getProfileByUsername(username);
        setUser(fetchedUser);
      } catch (error) {
        console.error("Failed to fetch user profile", error);
      }
    };

    fetchUser();
  }, [username]);

  const handleFollow = async () => {
    setIsLoading(true);
    try {
      const isNowFollowing = await toggleFollow(userId); // Assuming toggleFollow returns the new state (followed/unfollowed)

      if (isNowFollowing) {
        toast.success(`${user?.username || "User"} followed successfully`);
      } else {
        toast.success(`${user?.username || "User"} unfollowed successfully`);
      }
    } catch (error) {
      console.error("Error when following/unfollowing user", error);
      toast.error("Failed to update follow status");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      size="sm"
      variant="secondary"
      onClick={handleFollow}
      disabled={isLoading}
      className="w-20 relative flex justify-center items-center"
    >
      {isLoading ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <div className="flex items-center gap-2">
          <span>Follow</span>
          <CirclePlus className="size-4" />
        </div>
      )}
    </Button>
  );
};

export default FollowBtn;
