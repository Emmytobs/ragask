import React from "react";
import { Separator } from "./ui/separator";
import {
  MessageSquare,
  CloudUpload,
  FileText,
  WandSparkles,
  LogIn,
} from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Logo } from "./Logo";
import { signIn, useSession } from "next-auth/react";
import { getInitials } from "@/lib/get-user-intials";
import { ExtendedSession } from "@/session";
import { MyToolTip } from "./MyToolTip";

function SideNav() {
  const { data: session } = useSession() as { data: ExtendedSession }

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
        <div className="my-4">
          <FileText color="black" />
        </div>
      </div>

      <div>
        <Separator />
        <div className="space-y-16">
          <div className="my-4 ml-1">
            <WandSparkles color="black" />
          </div>
          <div className="my-4" style={{ cursor: "pointer" }}>
            <MyToolTip text="View Profile" content={
              <Avatar>
                <AvatarImage src={session?.user_info?.avatar ?? ""} alt="@shadcn" />
                <AvatarFallback>{getInitials(session?.user?.name ?? "")}</AvatarFallback>
              </Avatar>
            } />
          </div>
          <div className="mt-4 ml-1" style={{ cursor: "pointer" }}>
            <MyToolTip text="Log in" content={
              <LogIn color="black" onClick={() => signIn("google")} />
            } />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SideNav;
