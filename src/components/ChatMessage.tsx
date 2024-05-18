import { useState } from "react";
import { Logo } from "./Logo";
import { User } from "lucide-react";

const ROLE = ["user", "ai"] as const;
export type Role = (typeof ROLE)[number];

function ChatMessage({ role, message }: { role: Role; message: string }) {
  return (
    <div className="flex flex-start mb-[12px] px-6">
      {role === "user" ? (
        <div className="max-w-[900px] p-3 bg-gray-100 rounded-[20px] ml-auto">
          {message}
        </div>
      ) : (
        <div className="flex gap-x-5">
          <span role="img" aria-label="ai" style={{ fontSize: "24px" }}>
            <Logo />
          </span>
          <span>{message}</span>
        </div>
      )}
    </div>
  );
}

export default ChatMessage;
