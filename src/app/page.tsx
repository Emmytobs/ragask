"use client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/MyTextArea";
import ChatMessage from "@/components/ChatMessage";
import SideNav from "@/components/sideNav";
import { Separator } from "@/components/ui/separator";
import DocumentList from "@/components/documentList";
import ChatWindow from "@/components/chatWindow";
import { PDF } from "@/components/pdf";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { TabsDemo } from "@/components/PdfTabs";

export default function Home() {
  return (
    <>
      <div className="fixed left-0">
        <SideNav />
      </div>
      <div className="flex ml-16 overflow-hidden">
        <div className="flex-1 h-screen border">
          <TabsDemo />
        </div>
        <div className="flex-1 h-screen">
          <ChatWindow />
        </div>
      </div>
    </>
  );
}
