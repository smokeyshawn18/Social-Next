"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import { CirclePlus, Loader2Icon } from "lucide-react";
import toast from "react-hot-toast";
import { toggleFollow } from "@/actions/user.action";

const FollowBtn = ({ userId }: { userId: string }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleFollow = async () => {
    try {
      await toggleFollow(userId);
      toast.success("User followed successfully");
    } catch (error) {
      console.log("Error when following user", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Button
      size={"sm"}
      variant={"secondary"}
      onClick={handleFollow}
      disabled={isLoading} // Disable button while loading
      className="w-20"
    >
      <div className="flex items-center gap-2">
        {isLoading && <Loader2Icon className="size-4 animate-spin" />}
        <span>{isLoading ? "Following..." : "Follow"}</span>
        {!isLoading && <CirclePlus className="size-4" />}
      </div>
    </Button>
  );
};

export default FollowBtn;
