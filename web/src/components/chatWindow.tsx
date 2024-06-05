import React, { useEffect, useRef, useState } from "react";
import ChatMessage, { Role } from "./ChatMessage";
import { Textarea } from "./MyTextArea";
import { IFile } from "@/interfaces/IFile";
import useAxios from "@/hooks/useAxios";

type ChatMessageData = {
  role: Role;
  message: string;
};

const ChatWindow = ({ currentFile }: { currentFile: IFile }) => {
  const chatMessagesRef = useRef<HTMLDivElement>(null);
  const { axios } = useAxios();

  const initialMessages: ChatMessageData[] = [];

  const [chatMessageData, setChatMessageData] =
    useState<ChatMessageData[]>(initialMessages);

  useEffect(() => {
    scrollToBottomOfChatWindow();
  }, [chatMessageData.length]);

  const chatIsEmpty = chatMessageData.length == 0;

  const onAddMessage = async (message: string) => {
    const llmResponse = await axios?.get(
      `/documents/pdf/chat/${currentFile.id}?query=${message}`
    );
    if (!llmResponse) {
      return;
    }
    setChatMessageData((prevMessages) => [
      ...prevMessages,
      {
        message,
        role: "user",
      },
      {
        message: llmResponse.data.response,
        role: "ai",
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
        {chatIsEmpty ? (
          <div className="text-center">Start by sending a message!</div>
        ) : null}
      </div>
      <div className="flex-[0_0_60px] bg-white py-4">
        <Textarea onAddMessage={onAddMessage} />
      </div>
    </div>
  );
};

export default ChatWindow;
