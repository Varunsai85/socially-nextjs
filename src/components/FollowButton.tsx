"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";
import { toggleFollow } from "@/actions/user.action";

const FollowButton = ({ userId }: { userId: string }) => {
  const [isLoading, setIsloading] = useState(false);

  const handleFollow = async () => {
    setIsloading(true)
    try {
        await toggleFollow(userId)
        toast.success("User followed Successfully");
    } catch (error) {
        toast.error("Error following User");
    }finally{
        setIsloading(false)
    }
  };
  return (
    <Button
      size={"sm"}
      variant={"secondary"}
      className="w-20"
      onClick={handleFollow}
      disabled={isLoading}
    >
        {isLoading?<Loader2Icon className="size-4 animate-spin"/>:"Follow"}
    </Button>
  );
};

export default FollowButton;
