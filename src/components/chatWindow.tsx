import React from "react";
import ChatMessage, { Role } from "@/components/ChatMessage";
import { Textarea } from "@/components/MyTextArea";

type ChatMessageData = {
  role: Role;
  message: string;
};

const ChatWindow = () => {
  const chatMessageData: Array<ChatMessageData> = new Array(15)
    .fill(null)
    .map((_, index) => {
      return {
        role: index % 2 == 0 ? "user" : "ai",
        message:
          "Porem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.",
      };
    });

  const chatIsEmpty = chatMessageData.length == 0;

  return (
    <div className="flex flex-col gap-y-2 h-full px-4">
      <div
        className={`flex-1 flex flex-col justify-${
          chatIsEmpty ? "center" : "start"
        } overflow-auto py-4 gap-y-4`}
      >
        {chatMessageData.map(({ role, message }, index) => (
          <ChatMessage key={index} role={role} message={message} />
        ))}
        {chatIsEmpty ? <div>Start by sending a message!</div> : null}
      </div>
      <div className="flex-[0_0_60px] bg-white py-4">
        <Textarea />
      </div>
    </div>
  );
};

export default ChatWindow;
