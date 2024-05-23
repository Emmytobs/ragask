import React from "react";
import { Separator } from "./ui/separator";
import {
  MessageSquare,
  CloudUpload,
  FileText,
  WandSparkles,
  User,
  LogIn,
} from "lucide-react";
import { Logo } from "./Logo";

function SideNav() {
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
          <div className="my-4">
            <WandSparkles color="black" />
          </div>
          <div className="my-4">
            <User color="black" />
          </div>
          <div className="mt-4">
            <LogIn color="black" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SideNav;
