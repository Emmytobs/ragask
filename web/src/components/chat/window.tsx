import React, { useEffect, useRef, useState } from "react";
import ChatMessage, { Role } from "./message";
import { Textarea } from "./text-area";
import { IFile } from "@/interfaces/IFile";
import { EventSourcePolyfill } from "event-source-polyfill";
import { useSession } from "next-auth/react";

type ChatMessageData = {
  role: Role;
  message: string;
  relatedPages?: number[];
};

const ChatWindow = ({
  currentFile,
  setCurrentPage,
  currentPage,
}: {
  currentFile: IFile;
  setCurrentPage: (page: number) => void;
  currentPage: number;
}) => {
  const chatMessagesRef = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();
  const [userMessage, setUserMessage] = useState("");
  const [aiStreamingMessage, setAiStreamingMessage] = useState("");
  const [relatedPages, setRelatedPages] = useState<number[]>([]);

  useEffect(() => {
    let mount = true;
    let events: EventSourcePolyfill;
    let createEvents = () => {
      if (events) {
        events.close();
      }
      if (currentFile) {
      setRelatedPages([]);
        events = new EventSourcePolyfill(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/documents/pdf/chat/${currentFile.id}?query=${userMessage}`,
          { headers: { Authorization: `Bearer ${session?.jwt}` } }
        );
        events.onmessage = (event) => {
          if (mount) {
            setAiStreamingMessage((prev) => prev + event.data);
          }
        };

        events.addEventListener("end", (event: any) => {
        console.log("end event", event);
          setRelatedPages((prev) => prev.concat(JSON.parse(event.data)));
        });

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
        relatedPages: Array.from(new Set(relatedPages)),
      } as ChatMessageData;

      if (lastMessage && lastMessage.role === "ai") {
        return [...prevMessages.slice(0, -1), newMessage];
      }
      return [...prevMessages, newMessage];
    });
  }, [aiStreamingMessage, relatedPages]);

  const initialMessages: ChatMessageData[] = [];

  const [chatMessageData, setChatMessageData] =
    useState<ChatMessageData[]>(initialMessages);

  useEffect(() => {
    scrollToBottomOfChatWindow();
  }, [chatMessageData.length, aiStreamingMessage]);

  const chatIsEmpty =
    chatMessageData.filter(({ message }) => message !== "").length == 0;

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
          .map(({ role, message, relatedPages }, index) => (
            <ChatMessage
              key={index}
              role={role}
              message={message}
              relatedPages={relatedPages}
              setCurrentPage={setCurrentPage}
            />
          ))}
        {chatIsEmpty ? (
          <div className="text-center">Start by sending a message!</div>
        ) : null}
      </div>
      <div className="flex-[0_0_60px] bg-white py-4">
        <Textarea onAddMessage={onAddMessage} disable={!currentFile} />
      </div>
    </div>
  );
};

export default ChatWindow;
