"use client";

import {
  getProfileByUsername,
  getUserPosts,
  updateProfile,
} from "@/actions/profile.action";
import { toggleFollow } from "@/actions/user.action";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SignInButton, useUser } from "@clerk/nextjs";
import { format } from "date-fns";
import { CalendarIcon, EditIcon, LinkIcon, MapPinIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type User = Awaited<ReturnType<typeof getProfileByUsername>>;
type Posts = Awaited<ReturnType<typeof getUserPosts>>;

interface ProfilePageClientProps {
  user: NonNullable<User>;
  posts: Posts;
  likedPosts: Posts;
  isFollowing: boolean;
}

const ProfilePageClient = ({
  user,
  posts,
  likedPosts,
  isFollowing: initialIsFollowing,
}: ProfilePageClientProps) => {
  const { user: currentUser } = useUser();
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isUpdatingFollow, setIsUpdatingFollow] = useState(false);

  const [editForm, setEditForm] = useState({
    name: user.name || "",
    bio: user.bio || "",
    location: user.bio || "",
    website: user.website || "",
  });

  const handleEditSubmit = async () => {
    const formData = new FormData();
    Object.entries(editForm).forEach(([key, value]) => {
      formData.append(key, value);
    });

    const result = await updateProfile(formData);
    if (result?.success) {
      setShowEditDialog(false);
      toast.success("Profile Updated Successfully");
    }
  };

  const handleFollow = async () => {
    if (!currentUser) return;
    try {
      setIsUpdatingFollow(true);
      await toggleFollow(user.id);
      setIsFollowing(!isFollowing);
    } catch (error) {
      toast.error("Failed to update follow status");
    } finally {
      setIsUpdatingFollow(false);
    }
  };

  const isOwnProfile =
    currentUser?.username === user.username ||
    currentUser?.emailAddresses[0].emailAddress.split("@")[0] === user.username;

  const formattedDate = format(new Date(user.createdAt), "MMMM yyyy");
  return (
    <div className="max-w-3xl mx-auto">
      <div className="grid grid-cols-1 gap-6">
        <div className="w-full max-w-lg mx-auto">
          <Card className="bg-card">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="size-24">
                  <AvatarImage
                    src={user.image ?? "/avatar.png"}
                    alt={user.username ?? "avatar"}
                  />
                </Avatar>
                <h1 className="mt-4 text-2xl font-bold">{user.name}</h1>
                <p className="text-muted-foreground">@{user.username}</p>
                <p className="text-sm mt-2">{user.bio}</p>
                <div className="w-full mt-6">
                  <div className="flex justify-between mb-4">
                    <div>
                      <div className="font-semibold">
                        {user._count.following.toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Following
                      </div>
                    </div>
                    <Separator orientation="vertical" />
                    <div>
                      <div className="font-semibold">
                        {user._count.posts.toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">Posts</div>
                    </div>
                    <Separator orientation="vertical" />
                    <div>
                      <div className="font-semibold">
                        {user._count.followers.toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Follwers
                      </div>
                    </div>
                  </div>
                </div>
                {!currentUser ? (
                  <SignInButton mode="modal">
                    <Button className="w-full mt-4">Follow</Button>
                  </SignInButton>
                ) : isOwnProfile ? (
                  <Button
                    className="w-full mt-4"
                    onClick={() => setShowEditDialog(true)}
                  >
                    <EditIcon className="size-4 mr-2" />
                    Edit Profile
                  </Button>
                ) : (
                  <Button
                    className="w-full mt-4"
                    variant={isFollowing ? "outline" : "default"}
                    onClick={handleFollow}
                    disabled={isUpdatingFollow}
                  >
                    {isFollowing ? "Unfollow" : "Follow"}
                  </Button>
                )}

                <div className="w-full mt-6 space-y-2 text-sm">
                  {user.location && (
                    <div className="flex items-center text-muted-foreground">
                      <MapPinIcon className="size-4 mr-2" />
                      {user.location}
                    </div>
                  )}
                  {user.website && (
                    <div className="flex items-center text-muted-foreground">
                      <LinkIcon className="mr-2 size-4" />
                      <a
                        href={
                          user.website.startsWith("http")
                            ? user.website
                            : `https://${user.website}`
                        }
                        className="hover:underline"
                        target="_blank"
                        rel="noopener noreferer"
                      >
                        {user.website}
                      </a>
                    </div>
                  )}
                  <div className="flex items-center text-muted-foreground">
                    <CalendarIcon className="size-4 mr-2"/>
                    Joined {formattedDate}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePageClient;
