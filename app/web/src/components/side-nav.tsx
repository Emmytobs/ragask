import React from "react";
import { Separator } from "@/components/ui/separator";
import { UserDropDown } from "@/components/user-menu";
import Link from "next/link";
import { Logo } from "@/components/logo";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Icons } from "@/components/icons";
import AddFilesDialog from "@/components/add-files-dialog";

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
    <div
      className={`my-4 ${className} py-4 rounded-lg px-4 hover:bg-gray-200 cursor-pointer`}
    >
      <Link href={href}>
        <IconComponent color={iconColor} />
      </Link>
    </div>
  );
}

function SideNavSheet({
  icon: IconComponent,
  iconColor,
  className,
}: {
  icon: React.ElementType;
  iconColor: string;
  className?: string;
}) {
  return (
    <div
      className={`${className ? className : ""} py-4 rounded-lg px-4 hover:bg-gray-200 cursor-pointer`}
    >
      <Sheet>
        <SheetTrigger className="flex items-center">
          <IconComponent color={iconColor} />
        </SheetTrigger>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>Are you absolutely sure?</SheetTitle>
            <SheetDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </div>
  );
}


export default function SideNav() {
  return (
    <div className="h-screen w-16 flex flex-col items-center text-white space-y-32">
      <div className="my-4 flex flex-col items-center justify-center">
        <Logo width="36" height="36" className="mx-auto h-12 w-12" />
      </div>
      <div className="space-y-16">
        <SideNavSheet icon={Icons.chatHistory} iconColor="black" />
        <SideNavSheet icon={Icons.fileHistory} iconColor="black" />
        <div className="flex flex-col items-center justify-center py-4 rounded-lg px-4 hover:bg-gray-200 cursor-pointer">
          <AddFilesDialog />
        </div>
      </div>
      <div>
        <Separator />
        <div className="space-y-16">
        <div className="bg-purple-500 rounded-lg">
          <NavLink
            href="/upgrade"
            icon={Icons.subscriptionUpgrade}
            iconColor="white"
            className="hover:bg-purple-900"
          />
        </div>
          <div className="my-4 flex flex-col items-center justify-center cursor-pointer">
            <UserDropDown />
          </div>
        </div>
      </div>
    </div>
  );
}
