import React from "react";
import { Separator } from "./ui/separator";
import { UserDropDown } from "./user-menu";
import Link from "next/link";
import { Icons } from "./icons";
import { Logo } from "@/components/logo";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FileDropzone } from "@/components/file-drop-zone";

function NavLink({
  href,
  icon: IconComponent,
  iconColor,
  className,
}: {
  href: string;
  icon: React.ElementType;
  iconColor: string;
  className?: string;
}) {
  return (
    <div className={`my-4 ${className}`} style={{ cursor: "pointer" }}>
      <Link href={href}>
        <IconComponent color={iconColor} />
      </Link>
    </div>
  );
}

function AddFilesDialog() {
  return (
    <Dialog>
      <DialogTrigger>
        <Icons.fileUpload color="black" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Files </DialogTitle>
          <DialogDescription>
            <FileDropzone
              onFileUploaded={(uploadedFiles) => console.log(uploadedFiles)}
            />
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

function SideNav() {
  return (
    <div className="h-screen w-16 flex flex-col items-center text-white space-y-32">
      <div className="my-4 flex flex-col items-center justify-center">
        <Logo width="36" height="36" className="mx-auto h-12 w-12" />
      </div>
      <div className="space-y-16">
        <NavLink href="/chats" icon={Icons.chatHistory} iconColor="black" />
        <NavLink href="/files" icon={Icons.fileHistory} iconColor="black" />
        <div className={`my-4`} style={{ cursor: "pointer" }}>
          <AddFilesDialog />
        </div>
      </div>
      <div>
        <Separator />
        <div className="space-y-16">
          <NavLink
            href="/upgrade"
            icon={Icons.subscriptionUpgrade}
            iconColor="black"
            className="ml-2"
          />
          <div className="my-4" style={{ cursor: "pointer" }}>
            <UserDropDown />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SideNav;
