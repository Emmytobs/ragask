import React from "react";
import { Separator } from "./ui/separator";
import {
  MessageSquare,
  CloudUpload,
  FileText,
  WandSparkles,
} from "lucide-react";
import { Logo } from "./Logo";
import { useSession } from "next-auth/react";
import { UserDropDown } from "./user-drop-down";
import Link from "next/link";

function SideNav() {
  const { data: session } = useSession();

  return (
    <div className="h-screen w-16 flex flex-col items-center text-white space-y-32 border">
      <div className="my-4">
        <Logo />
      </div>
      <div className="space-y-16">
        <div className="my-4">
          <MessageSquare color="black" />
        </div>
        <div className="my-4">
          <CloudUpload color="black" />
        </div>
        <div className="my-4" style={{ cursor: "pointer" }}>
          <Link href="/file-uploads">
            <FileText color="black" />
          </Link>
        </div>
      </div>

      <div>
        <Separator />
        <div className="space-y-16">
          <div className="my-4 ml-1">
            <WandSparkles color="black" />
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
