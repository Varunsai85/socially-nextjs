"use client";

import { useState } from "react";
import ModeToggle from "./ModeToggle";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Button } from "./ui/button";
import { BellIcon, HomeIcon, LogOutIcon, MenuIcon, UserIcon } from "lucide-react";
import Link from "next/link";
import { SignInButton, SignOutButton, useAuth } from "@clerk/nextjs";

const MobileNavbar = () => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { isSignedIn } = useAuth();

  return (
    <div className="flex md:hidden items-center space-x-2">
      <ModeToggle />
      <Sheet open={showMobileMenu} onOpenChange={setShowMobileMenu}>
        <SheetTrigger asChild>
          <Button variant={"ghost"} size={"icon"}>
            <MenuIcon className="size-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[250px] px-3">
          <SheetHeader>
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>
          <nav className="flex flex-col space-y-4 mt-3">
            <Button variant="ghost" className="flex items-center gap-2 justify-start" asChild>
              <Link href={"/"}>
                <HomeIcon className="size-4" />
                <span>Home</span>
              </Link>
            </Button>
            {isSignedIn ? (
              <>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 justify-start"
                  asChild
                >
                  <Link href={"/notifications"}>
                    <BellIcon className="size-4" />
                    <span>Notifications</span>
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 justify-start"
                  asChild
                >
                  <Link href={`/profile`}>
                    <UserIcon className="size-4" />
                    <span>Profile</span>
                  </Link>
                </Button>
                <SignOutButton>
                  <Button
                    variant={"ghost"}
                    className="flex items-center gap-3 justify-start w-full"
                  >
                    <LogOutIcon className="size-4"/>
                    Logout
                  </Button>
                </SignOutButton>
              </>
            ) : (
              <SignInButton mode="modal">
                <Button onClick={()=>setShowMobileMenu(!showMobileMenu)}>Sign In</Button>
              </SignInButton>
            )}
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileNavbar;
