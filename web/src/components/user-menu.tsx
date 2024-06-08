import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { getInitials } from "@/lib/get-user-intials";
import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { redirect } from "next/navigation";

export function UserDropDown() {
  const { data: session, status } = useSession();

  const toggleLoggedIn = () => {
    if (status === "authenticated") {
      signOut();
    } else {
      signIn("google");
    }
  };
  
  useEffect(() => {
  if (status === "unauthenticated") {
  redirect("/login");
  }
  }, [status]);


  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar>
          {!session ? (
            <AvatarFallback>{getInitials("")}</AvatarFallback>
          ) : (
            <>
              <AvatarImage src={session.user.avatar} alt="User avatar" />
              <AvatarFallback>
                {getInitials(session.user.name ?? "")}
              </AvatarFallback>
            </>
          )}
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" side="right">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Billing</DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => toggleLoggedIn()}>
          {status === "authenticated" ? "Log out" : "Log in"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
