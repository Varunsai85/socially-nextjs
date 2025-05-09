import React from "react";
import ModeToggle from "./ModeToggle";
import { Button } from "./ui/button";
import Link from "next/link";
import { BellIcon, HomeIcon, UserIcon } from "lucide-react";
import { currentUser } from "@clerk/nextjs/server";
import { SignInButton, UserButton } from "@clerk/nextjs";

const DesktopNavbar = async () => {
  const user = await currentUser();
  return (
    <div className="hidden md:flex items-center space-x-4">
      <Button variant="ghost" className="flex items-center gap-2" asChild>
        <Link href={"/"}>
          <HomeIcon className="size-4" />
          <span className="hidden lg:inline">Home</span>
        </Link>
      </Button>
      {user ? (
        <>
          <Button variant="ghost" className="flex items-center gap-2" asChild>
            <Link href={"/notifications"}>
              <BellIcon className="size-4" />
              <span className="hidden lg:inline">Notifications</span>
            </Link>
          </Button>
          <Button variant="ghost" className="flex items-center gap-2" asChild>
            <Link
              href={`/profile/${
                user.username ??
                user.emailAddresses[0].emailAddress.split("@")[0]
              }`}
            >
              <UserIcon className="size-4" />
              <span className="hidden lg:inline">Profile</span>
            </Link>
          </Button>
          <ModeToggle />
          <UserButton />
        </>
      ) : (
        <>
          <ModeToggle />
          <SignInButton mode="modal">
            <Button>Sign In</Button>
          </SignInButton>
        </>
      )}
    </div>
  );
};

export default DesktopNavbar;
