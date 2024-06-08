import React from "react";
import { Separator } from "./ui/separator";
import { UserDropDown } from "./user-menu";
import Link from "next/link";
import { Icons } from "./icons";
import { Logo } from "@/components/logo";

function SideNav() {
  return (
    <div className="h-screen w-16 flex flex-col items-center text-white space-y-32">
      <div className="my-4 flex flex-col items-center justify-center">
        <Logo width="36" height="36" className="mx-auto h-12 w-12" />
      </div>
      <div className="space-y-16">
        <div className="my-4">
          <Icons.chatHistory color="black" />
        </div>
        <div className="my-4">
          <Icons.fileHistory color="black" />
        </div>
        <div className="my-4" style={{ cursor: "pointer" }}>
          <Link href="/file-uploads">
            <Icons.fileUpload color="black" />
          </Link>
        </div>
      </div>

      <div>
        <Separator />
        <div className="space-y-16">
          <div className="my-4 ml-1">
            <Icons.subscriptionUpgrade color="black" />
          </div>
          <div className="my-4" style={{ cursor: "pointer" }}>
            <UserDropDown />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SideNav;
