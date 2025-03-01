import { getRandomUsers } from "@/actions/user.action";
import { CirclePlus, ShieldPlus, SmilePlus } from "lucide-react";
import React from "react";
import { Card, CardContent, CardHeader } from "./ui/card";
import Link from "next/link";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import FollowBtn from "./FollowBtn";

const WhoToFollow = async () => {
  const users = await getRandomUsers();
  if (users.length === 0) return null;
  return (
    <Card>
      <CardHeader>
        Connect with your closed ones <SmilePlus />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {users.map((user) => (
            <div
              key={user.id}
              className="flex gap-2 items-center justify-between "
            >
              <div className="flex items-center gap-1">
                <Link href={`/profile/${user.username}`}>
                  <Avatar>
                    <AvatarImage src={user.image ?? "/avatar.png"} />
                  </Avatar>
                </Link>
                <div className="text-xs">
                  <Link
                    href={`/profile/${user.username}`}
                    className="font-medium cursor-pointer"
                  >
                    {user.name}
                  </Link>
                  <p className="text-muted-foreground">@{user.username}</p>
                  <p className="text-muted-foreground">
                    {user._count.followers} followers
                  </p>
                </div>
              </div>
              <FollowBtn userId={user.id} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default WhoToFollow;
