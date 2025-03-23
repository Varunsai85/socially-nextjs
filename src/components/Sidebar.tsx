import { currentUser } from "@clerk/nextjs/server";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { Button } from "./ui/button";
import { getUserByClerkId, syncUser } from "@/actions/user.action";
import Link from "next/link";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Separator } from "./ui/separator";
import { LinkIcon, MapPinIcon } from "lucide-react";

const Sidebar = async () => {
  const authUser = await currentUser();
  if (!authUser) return <UnauthenticatedSidebar />;

  await syncUser();

  let user;
  try {
    user = await getUserByClerkId(authUser.id);
  } catch (error) {
    console.error("Sidebar: Failed to fetch user:", error);
    return (
      <div className="sticky top-20">
        <Card>
          <CardContent className="pt-6">
            <p>Error loading profile. Please try again.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user?.id) {
    return (
      <div className="sticky top-20">
        <Card>
          <CardContent className="pt-6">
            <p>Loading profile...</p>
          </CardContent>
        </Card>
      </div>
    );
  }
  return (
    <div className="sticky top-20">
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center">
            <Link
              href={`/profile/${user?.username}`}
              className="flex flex-col items-center justify-center"
            >
              <Avatar className="size-20 border-2">
                <AvatarImage
                  src={user?.image || "/avatar.png"}
                  alt={user?.username || "avatar"}
                />
              </Avatar>
              <div className="mt-4 spacce-y-1">
                <h3 className="font-semibold hover:underline">{user?.name}</h3>
                <p className="text-sm text-muted-foreground hover:underline">
                  @{user?.username}
                </p>
              </div>
            </Link>
            {user?.bio && (
              <p className="mt-3 text-muted-foreground">{user?.bio}</p>
            )}
            <div className="w-full">
              <Separator className="my-4" />
              <div className="flex justify-between">
                <div>
                  <p className="font-medium">{user?._count.following}</p>
                  <p className="text-xs text-muted-foreground">Following</p>
                </div>
                <Separator orientation="vertical" />
                <div>
                  <p className="font-medium">{user?._count.posts}</p>
                  <p className="text-xs text-muted-foreground">Posts</p>
                </div>
                <Separator orientation="vertical" />
                <div>
                  <p className="font-medium">{user?._count.followers}</p>
                  <p className="text-xs text-muted-foreground">Followers</p>
                </div>
              </div>
              <Separator className="my-4" />
            </div>
            <div className="w-full space-y-2 text-sm">
              <div className="flex items-center text-muted-foreground">
                <MapPinIcon className="size-4 mr-2" />
                {user?.location || "No Location"}
              </div>
              <div className="flex items-center text-muted-foreground">
                <LinkIcon className="size-4 mr-2" />
                {user?.website ? (
                  <a
                    href={`${user?.website}`}
                    className="hover:underline truncate"
                    target="_blank"
                  >
                    {user?.website}
                  </a>
                ) : (
                  "No Website"
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Sidebar;

const UnauthenticatedSidebar = () => (
  <div className="sticky top-20">
    <Card>
      <CardHeader>
        <CardTitle className="text-center text-xl font-semibold">
          Welcome Back!
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-center text-muted-foreground mb-4">
          Login to access your profile and connect with others
        </p>
        <SignInButton mode="modal">
          <Button className="w-full" variant={"outline"}>
            LogIn
          </Button>
        </SignInButton>
        <SignUpButton mode="modal">
          <Button className="w-full mt-2">Sign Up</Button>
        </SignUpButton>
      </CardContent>
    </Card>
  </div>
);
