import React, { useEffect, useRef, useState } from "react";
import ChatMessage, { Role } from "./ChatMessage";
import { Textarea } from "./MyTextArea";

type ChatMessageData = {
  role: Role;
  message: string;
};

const ChatWindow = () => {
  const chatMessagesRef = useRef<HTMLDivElement>(null);

  const initialMessages: ChatMessageData[] = new Array(15)
    .fill(null)
    .map((_, index) => {
      return {
        role: index % 2 == 0 ? "user" : "ai",
        message:
          "Porem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.",
      };
    });

  const [chatMessageData, setChatMessageData] =
    useState<ChatMessageData[]>(initialMessages);

  useEffect(() => {
    scrollToBottomOfChatWindow();
  }, [chatMessageData.length]);

  const chatIsEmpty = chatMessageData.length == 0;

  const onAddMessage = (message: string) => {
    setChatMessageData((prevMessages) => [
      ...prevMessages,
      {
        message,
        role: "user",
      },
    ]);
  };

  const scrollToBottomOfChatWindow = () => {
    if (chatMessagesRef.current) {
      const chatWindow = chatMessagesRef.current;
      const { scrollHeight } = chatWindow;

      chatWindow.scrollTo({
        behavior: "smooth",
        top: scrollHeight,
      });
    }
  };

  return (
    <div className="flex flex-col gap-y-2 h-full px-4">
      <div
        className={`flex-1 flex flex-col justify-${
          chatIsEmpty ? "center" : "start"
        } overflow-auto py-4 gap-y-4`}
        ref={chatMessagesRef}
      >
        {chatMessageData.map(({ role, message }, index) => (
          <ChatMessage key={index} role={role} message={message} />
        ))}
        {chatIsEmpty ? <div>Start by sending a message!</div> : null}
      </div>
      <div className="flex-[0_0_60px] bg-white py-4">
        <Textarea onAddMessage={onAddMessage} />
      </div>
    </div>
  );
};

export default ChatWindow;
