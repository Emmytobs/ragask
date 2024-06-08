import React, { useEffect, useRef, useState } from "react";
import ChatMessage, { Role } from "./ChatMessage";
import { Textarea } from "./MyTextArea";
import { IFile } from "@/interfaces/IFile";
import { EventSourcePolyfill } from "event-source-polyfill";
import { useSession } from "next-auth/react";

type ChatMessageData = {
  role: Role;
  message: string;
};

const ChatWindow = ({ currentFile }: { currentFile: IFile }) => {
  const chatMessagesRef = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();
  const [userMessage, setUserMessage] = useState("");
  const [aiStreamingMessage, setAiStreamingMessage] = useState("");
  
  useEffect(() => {
    let mount = true;
    let events: EventSourcePolyfill;
    let createEvents = () => {
      if (events) {
        events.close();
      }
      if (currentFile) {
        events = new EventSourcePolyfill(
          `http://localhost:8000/api/v1/documents/pdf/chat/${currentFile.id}?query=${userMessage}`,
          { headers: { Authorization: `Bearer ${session?.jwt}` } }
        );
        events.onmessage = (event) => {
          if (mount) {
            setAiStreamingMessage((prev) => prev + event.data);
          }
        };
        events.onerror = (err) => {
          events.close();
        };
      }
    };

    createEvents();

    return () => {
      mount = false;
      if (events) {
        events.close();
      }
      setAiStreamingMessage("");
    };
  }, [userMessage]);

  useEffect(() => {
    setChatMessageData((prevMessages) => {
      const lastMessage = prevMessages[prevMessages.length - 1];

      const newMessage = {
        message: aiStreamingMessage,
        role: "ai",
      } as ChatMessageData;

      if (lastMessage && lastMessage.role === "ai") {
        return [...prevMessages.slice(0, -1), newMessage];
      }
      return [...prevMessages, newMessage];
    });
  }, [aiStreamingMessage]);

  const initialMessages: ChatMessageData[] = [];

  const [chatMessageData, setChatMessageData] =
    useState<ChatMessageData[]>(initialMessages);

  useEffect(() => {
    scrollToBottomOfChatWindow();
  }, [chatMessageData.length, aiStreamingMessage]);

  const chatIsEmpty = chatMessageData.length == 0;

  const onAddMessage = async (message: string) => {
    setUserMessage(message);
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
        {chatMessageData
          .filter(({ message }) => message !== "")
          .map(({ role, message }, index) => (
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
