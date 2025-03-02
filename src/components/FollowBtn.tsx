"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import { CirclePlus, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { toggleFollow } from "@/actions/user.action";

const FollowBtn = ({ userId }: { userId: string }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleFollow = async () => {
    setIsLoading(true); // ✅ Ensure loading state updates first
    try {
      await toggleFollow(userId);
      toast.success("User followed successfully");
    } catch (error) {
      console.error("Error when following user", error);
      toast.error("Failed to follow user");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      size="sm"
      variant="secondary"
      onClick={handleFollow}
      disabled={isLoading} // ✅ Prevent multiple clicks
      className="w-20 relative flex justify-center items-center"
    >
      {isLoading ? (
        <Loader2 className="size-4 animate-spin" /> // ✅ Smooth loading animation
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
